import { AutoDV } from 'auto-dv-type';

export interface GroupConfigStruct {
  groupItemCode: string[];
}

interface groupMapValueStruct {
  //分组内组件相对于分组索引的偏移量
  offsetNumer: number;
  //分组的索引
  currentIndex: number;
}

/**
 * 根据分组关系排序一维数组
 * @param compCodes 所有组件的code
 * @param compDatas 所有组件的数据
 */
const sortListItem = (compCodes: string[], compDatas: AutoDV.State['compDatas']) => {
  const groupCodeCache = new Map<string, groupMapValueStruct>();
  const result: string[] = [];

  /**
   * 递归的回溯当前分组的前驱分组，更新前驱分组的长度偏移量
   * @param groupCode 分组组件的code
   * @param offsetNumber 分组长度的偏移量
   */
  const recursiveBacktracking = (groupCode: string, offsetNumber: number): null => {
    const parentGroupCode = compDatas[groupCode].config.groupCode;
    const belongGroup = groupCodeCache.get(groupCode) as groupMapValueStruct;
    groupCodeCache.set(groupCode, {
      //更新分组缓存，每此插入组件，偏移量+1
      ...belongGroup,
      offsetNumer: belongGroup.offsetNumer + 1,
    });
    if (parentGroupCode) {
      // 如果分组有父分组，回溯一步
      return recursiveBacktracking(parentGroupCode, offsetNumber + 1);
    } else {
      return null;
    }
  };
  compCodes.forEach((item, index) => {
    const group = compDatas[item].config.groupCode ? compDatas[item].config.groupCode : null;
    if (compDatas[item].compCode === 'group') {
      //如果组件是分组组件，将code推入分组缓冲内
      groupCodeCache.set(item, { offsetNumer: 0, currentIndex: index });
    }
    if (group) {
      //在分组内
      if (groupCodeCache.has(group)) {
        // 组件的分组在缓存中

        const belongGroup = groupCodeCache.get(group) as groupMapValueStruct;

        // 分组内组件插入的位置
        const targetIndex = belongGroup.currentIndex + belongGroup.offsetNumer;

        result.splice(targetIndex + 1, 0, item);
        recursiveBacktracking(group, belongGroup.offsetNumer);
      }
    } else {
      result.push(item);
    }
  });
  return result;
};

export default sortListItem;
// export default sortListItemDom;
