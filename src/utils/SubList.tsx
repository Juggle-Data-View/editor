import { JuggleDV } from '@juggle-data-view/types';
export interface AssistStruct {
  code: string;
  children?: AssistStruct[];
  parentGroupCode?: string;
}

interface GroupStack {
  groupCode: string;
  index: number; // 分组真实的下标
  offsetNumber: number;
}

const { REACT_APP_JuggleDV_ENV } = process.env;

// dev/test 环境
export const isDev = REACT_APP_JuggleDV_ENV === 'development';

/**
 * 将一维数组转成多层结构
 * @param compCodes 所有组件的code
 * @param compDatas 所有组件的数据
 * @returns 返回和code相关的嵌套结构、
 */
const subList = (compCodes: string[], compDatas: JuggleDV.State['compDatas']): AssistStruct[] => {
  let groupStack: GroupStack[] = [];
  const resultData: AssistStruct[] = [];

  const stackPop = (groupCode?: string) => {
    let len = groupStack.length - 1;
    while (len >= 0) {
      if (groupStack[len].groupCode !== groupCode) {
        groupStack.pop();
      } else {
        break;
      }
      len--;
    }
  };

  const setResult = (result: AssistStruct[], groupStack: GroupStack[], groupCode: string, value: AssistStruct) => {
    groupStack.forEach((item, index) => {
      if (!result) {
        return null;
      }
      if (!result[item.index]) {
        return;
      }
      if (result[item.index].code !== groupCode) {
        // 如果当前组件的分组不等于结果中的key，向下搜索
        return setResult(result[item.index].children as AssistStruct[], groupStack.slice(index + 1), groupCode, value);
      } else {
        if (result[item.index].children) {
          (result[item.index].children as AssistStruct[]).push(value);
          item.offsetNumber += 1;
        } else {
          result[item.index].children = [value];
        }
      }
    });
  };

  compCodes.forEach((item, index) => {
    const hasGroup = compDatas[item] ? compDatas[item].config.groupCode : undefined;
    stackPop(hasGroup);
    if (compDatas[item].compCode === 'group') {
      if (hasGroup) {
        // 如果当前组件的父组件在栈顶,更新结果树
        setResult(resultData, groupStack.slice(0), hasGroup, {
          code: item,
          children: [],
        });

        //如果当前分组有父分组,此时分组栈一定不为空，分组索引为父分组长度-1
        groupStack.push({
          groupCode: item,
          index: groupStack.length ? groupStack[groupStack.length - 1].offsetNumber - 1 : index,
          offsetNumber: 0,
        });
      } else {
        groupStack = []; //没有分组，清空栈
        resultData.push({
          code: item,
          children: [],
        });
        //如果当前分组没有父分组,此时分组栈一定为空，分组索引为结果长度
        groupStack.push({
          groupCode: item,
          index: resultData.length - 1,
          offsetNumber: 0,
        });
      }
    } else {
      if (hasGroup) {
        // 如果当前组件的父组件在栈顶,更新结果树
        setResult(resultData, groupStack.slice(0), hasGroup, {
          code: item,
        });
      } else {
        groupStack = []; //没有分组，清空栈
        resultData.push({
          code: item,
        });
      }
    }
  });
  return resultData;
};

export default subList;
