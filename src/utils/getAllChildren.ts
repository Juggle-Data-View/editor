import { JuggleDV } from '@juggle-data-view/types';
/**
 * 获取所有分组子组件的code
 * @param groupCode 要查找的分组code
 * @param compCodes 所有的分组code
 * @param compDatas 所有的分组数据
 * @returns 所有的子组件
 */
const getAllChildren = (groupCode: string, compCodes: string[], compDatas: JuggleDV.State['compDatas']) => {
  const result: string[] = [];
  const groupIndex = compCodes.indexOf(groupCode);
  let groupCache: string[] = [groupCode];

  compCodes.forEach((item, index) => {
    const hasGroup = compDatas[item].config.groupCode;
    if (!(index > groupIndex)) {
      return;
    }
    if (groupCache.length === 0) {
      // 查询分组已经闭合
      return;
    }
    if (!hasGroup) {
      //组件没有分组。弹出所有的分组缓存
      groupCache = [];
      return;
    }

    if (!groupCache.includes(hasGroup)) {
      //组件的分组不在查询的分组内。弹出所有的分组缓存
      groupCache = [];
      return;
    } else {
      result.push(item); //组件的分组在分组缓存中

      if (hasGroup !== groupCache[groupCache.length - 1]) {
        // 如果组件的分组不在缓存的顶层
        const hasGroupCacheIndex = groupCache.indexOf(hasGroup);
        groupCache = groupCache.slice(0, hasGroupCacheIndex + 1);
      }
      if (compDatas[item].compCode === 'group') {
        // 组件本身是分组组件
        groupCache.push(item);
      }
    }
  });

  return result;
};
export default getAllChildren;

export const getAllParentGroup = (code: string, compDatas: JuggleDV.State['compDatas']) => {
  const searchGroup = (code: string, result: string[] = []): string[] => {
    const hasGroup = compDatas[code] && compDatas[code].config.groupCode;
    if (hasGroup) {
      result.push(hasGroup);
      return searchGroup(hasGroup, result);
    } else {
      return result;
    }
  };
  return searchGroup(code);
};

/**
 * 获取所有被选中组件，包括其子组件
 * @param codes 有序的被选中组件的code
 */
export const getAllSelectedComps = (codes: string[], compDatas: JuggleDV.State['compDatas'], compCodes: string[]) => {
  let result: string[] = [];
  codes.forEach((item) => {
    result.push(item);
    if (compDatas[item].compCode === 'group') {
      result = [...result, ...getAllChildren(item, compCodes, compDatas)];
    }
  });
  return result;
};
