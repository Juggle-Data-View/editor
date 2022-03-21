import { AutoDV } from 'auto-dv-type';
export interface CompBinaryTreeNode {
  code: string;
  groupItem: CompBinaryTreeNode | null; // group item
  sameLevel: CompBinaryTreeNode | null; // same level item
}

// 辅助结构 {父:子[]}
interface GroupDictionary {
  [parent: string]: string[];
}

// 辅助结构 {子:父}
interface GroupItemDictionary {
  [child: string]: {
    code: string; //group code
    index: number; // group component index
    groupItemStart: number;
    groupItemEnd: number;
  };
}

interface GroupConfigStruct {
  groupItemCode: string[];
}

/**
 * 获取当前组件的分组
 * @param compData 当前组件的数据
 * @param compDatas 所有组件的数据
 * @param compCodes 所有组件的code
 */
const getGroup = (compData: AutoDV.Comp, compDatas: AutoDV.State['compDatas'], compCodes: string[]) => {
  const { code } = compData;
  const groupCodes = compCodes.filter((item) => item.includes('group'));
  const belongToGroupCode = groupCodes.find((item) => {
    // const groupItemCodeWithoutSelf = (compDatas[item].config as GroupConfigStruct).groupItemCode.slice(1);
    const groupItemCodeWithoutSelf = (compDatas[item].config as GroupConfigStruct).groupItemCode;
    return groupItemCodeWithoutSelf && groupItemCodeWithoutSelf.includes(code);
  });

  return belongToGroupCode ? belongToGroupCode : undefined;
};

const compIsGroup = (code: string): boolean => {
  return code.includes('group');
};

export const compBinaryTree = (compCodes: string[], compDatas: AutoDV.State['compDatas']): any => {
  const groupDictionary: GroupDictionary = {};
  const groupItemDictionary: GroupItemDictionary = {};
  const groupCodes: string[] = compCodes.filter((item) => item.includes('group'));
  const groupCodeCache: string[] = [];
  let codeArrayOfCompInGroup: string[] = [];

  // 生成辅助结构，分组字典
  groupCodes.forEach((group) => {
    const { config } = compDatas[group] as AutoDV.Comp<{ groupItemCode: string[] }>;
    //过滤掉分组本身
    // const groupItemCode = config.groupItemCode;
    const groupItemCode = config.groupItemCode[0] === group ? config.groupItemCode.slice(1) : config.groupItemCode;
    groupDictionary[group] = groupItemCode;
    codeArrayOfCompInGroup = [...codeArrayOfCompInGroup, ...groupItemCode];
  });

  //生成辅助结构，分组内组件字典
  codeArrayOfCompInGroup.forEach((code) => {
    const groupCode = getGroup(compDatas[code], compDatas, compCodes);
    if (groupCode) {
      const { config } = compDatas[groupCode] as AutoDV.Comp<{ groupItemCode: string[] }>;
      const groupItemCode =
        config.groupItemCode[0] === groupCode ? config.groupItemCode.slice(1) : config.groupItemCode;
      // const groupItemCode = config.groupItemCode;
      if (code !== groupCode) {
        groupItemDictionary[code] = {
          code: groupCode,
          groupItemStart: compCodes.indexOf(groupItemCode[groupItemCode.length - 1]),
          groupItemEnd: compCodes.indexOf(groupItemCode[0]),
          index: compCodes.indexOf(groupCode),
        };
      }
    }
  });
  const createTree = (index: number, maxLength: number): CompBinaryTreeNode | null => {
    const code: string = compCodes[index];
    if (index >= maxLength) {
      return null;
    }
    if (compIsGroup(code)) {
      groupCodeCache.push(code);
      const groupLastItem = groupDictionary[code][groupDictionary[code].length - 1];
      return {
        code: code,
        groupItem: createTree(
          groupItemDictionary[groupLastItem].groupItemStart,
          groupItemDictionary[groupLastItem].groupItemEnd
        ),
        sameLevel: createTree(groupItemDictionary[groupLastItem].groupItemEnd + 1, compCodes.length),
      };
    } else {
      if (index <= maxLength) {
        return {
          code: code,
          groupItem: null,
          sameLevel: createTree(index + 1, compCodes.length),
        };
      } else {
        if (groupCodeCache.length > 0) {
          groupCodeCache.pop();
        }
        return null;
      }
    }
  };

  return createTree(0, compCodes.length);
  // return 0;
};
