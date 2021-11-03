import { groupRectSelector } from 'helpers/selectors';
import getAllChildren from 'utils/getAllChildren';

interface Result {
  [code: string]: { oldGroup?: string; newGroup?: string };
}

/**
 * 组件排序时处理分组的逻辑。
 * 副作用：修改了 `compDatas[codes].config.groupCode`,影响组件的分组关系，在排序后确定当前组件的是否在某一分组中。
 * @param compCodes 所有组件的code
 * @param compDatas 所有组件的数据
 * @param destination 目标位置
 * @returns result {Result} 返回组件排序后的分组关系，用于分组关系变化后，处理分组的尺寸。
 */
export const groupResort = (
  compCodes: string[],
  selectedCompCodes: string[],
  compDatas: AutoDV.State['compDatas'],
  destination: number
): Result => {
  const isToplest = destination === 0;
  const isBottomlest = destination + 1 === compCodes.length - 1;
  const lowBounds = isBottomlest ? compCodes.length - 1 : destination + 1;
  const interval = compCodes.slice(0, lowBounds); //插入区间
  const intervalLastComp = compDatas[compCodes[lowBounds]];
  const nearLowBoundsGroup = interval.find((item) => intervalLastComp && item === intervalLastComp.config.groupCode); //插入区间最下面的分组段
  const firstCompPrev = compDatas[selectedCompCodes[0]] && compDatas[selectedCompCodes[0]].config.groupCode; // 第一个选中组件的分组
  const topLestSelectComps = selectedCompCodes.filter((item) => compDatas[item].config.groupCode === firstCompPrev); // 和第一个选中在同级的所有选中组件
  const result: Result = {};

  if (isToplest) {
    //如果移动位置在插入区间的顶部，表明组件在最外层
    topLestSelectComps.forEach((item) => {
      result[item] = { newGroup: undefined, oldGroup: compDatas[item].config.groupCode };
      return (compDatas[item].config.groupCode = undefined);
    });

    return result;
  }
  if (nearLowBoundsGroup !== firstCompPrev) {
    //如果移动位置的下界的分组code不等于移动组件的code，则解除或更新分组关系
    topLestSelectComps.forEach((item) => {
      if (item !== nearLowBoundsGroup) {
        result[item] = { newGroup: nearLowBoundsGroup, oldGroup: compDatas[item].config.groupCode };
        compDatas[item].config.groupCode = nearLowBoundsGroup;
      } else {
        result[item] = { newGroup: compDatas[item].config.groupCode, oldGroup: compDatas[item].config.groupCode };
      }
    });
    return result;
  }
  return result;
};

/**
 * 分组创建逻辑
 * 副作用：修改了 `compDatas[codes].config.groupCode`,影响组件的分组关系，如果选中组件已经在某一分组内，则用新创建的分组替代原有关系
 * @param selectCompCodes 选中的组件
 * @param compDatas 组件数据
 * @param group 要创建的分组
 */
export const groupCreate = (selectCompCodes: string[], compDatas: AutoDV.State['compDatas'], group: AutoDV.Comp) => {
  const firstCompPrev = compDatas[selectCompCodes[0]].config.groupCode;
  group.config.groupCode = firstCompPrev;
  selectCompCodes.forEach((item) => {
    if (compDatas[item].config.groupCode === firstCompPrev) {
      compDatas[item].config.groupCode = group.code;
    }
  });

  return compDatas;
};

/**
 * 分组尺寸更新逻辑
 * 副作用：选中组件的新旧分组尺寸都会收到影响
 * @param selectedCompCodes 选中的组件
 * @param compCodes 所有组件的code
 * @param compDatas 所有组件的数据
 * @param state 上一次reducer的状态
 * @param groupMap 组件位置更新后，新旧分组的和组件的映射
 */
export const updateGroupSize = (
  selectedCompCodes: string[],
  compCodes: string[],
  compDatas: AutoDV.State['compDatas'],
  state: AutoDV.State,
  groupMap?: Result
) => {
  // const hasGroups = selectedCompCodes.filter((item) => compDatas[item].config.groupCode).reverse();
  const groupCodeCache: string[] = [];
  const groups: { [group: string]: string[] } = {};

  /**
   * 获取所有受影响的分组，例如A分组内一个组件移动到B分组内，这个时候，两个分组的尺寸都需要更新
   */
  const generateGroupCodes = (codes: string[]): any => {
    const hasGroupComps: string[] = [];
    codes.forEach((item) => {
      const hasGroup = compDatas[item] && compDatas[item].config.groupCode;
      // 如果在分组中，且分组不等于受影响分组缓存的栈顶
      if (hasGroup && hasGroup !== groupCodeCache[groupCodeCache.length - 1]) {
        groupCodeCache.push(hasGroup);

        // 缓存当前分组的父分组，用于下次递归
        hasGroupComps.push(hasGroup);
      } else {
        if (groupMap && groupMap[item]) {
          const { newGroup, oldGroup } = groupMap[item];
          if (newGroup !== oldGroup) {
            if (newGroup) {
              groupCodeCache.push(newGroup);
              // 缓存当前分组的新分组，用于下次递归
              hasGroupComps.push(newGroup);
            }
            if (oldGroup) {
              groupCodeCache.push(oldGroup);
              // 缓存当前分组的旧分组，用于下次递归
              hasGroupComps.push(oldGroup);
            }
          }
        }
      }
    });
    if (hasGroupComps.length) {
      return generateGroupCodes(hasGroupComps);
    } else {
      return null;
    }
  };

  generateGroupCodes(selectedCompCodes);

  // 生成分组和子的映射
  groupCodeCache.forEach((code) => {
    groups[code] = compCodes.filter((item) => {
      return compDatas[item] && compDatas[item].config.groupCode === code;
    });
  });

  Object.keys(groups).forEach((item) => {
    const groupItems = groups[item];
    compDatas[item].attr = {
      ...compDatas[item].attr,
      ...groupRectSelector(groupItems)(state),
    };
  });
};

/**
 * 更新所有的子组件
 * 副作用：所有当前分组下的所有组件的位置都变化
 * @param selectedCompCodes 选择的组件code
 * @param compDatas 所有的组件数据
 * @param compCodes 所有的组件code
 * @param offset 偏移量
 */
export const updateAllChildrenRect = (
  selectedCompCodes: string[],
  compDatas: AutoDV.State['compDatas'],
  compCodes: string[],
  offset: AutoDV.Rect
) => {
  const result: string[] = [];

  /**
   * 递归查找所有的子组件
   * @param codes 这层递归使用的组件code, codes的长度逐层减少，减小搜索区域
   */
  const recrusivePushResult = (codes: string[]) => {
    codes.forEach((code) => {
      if (!selectedCompCodes.includes(code)) {
        result.push(code);
      }
      if (compDatas[code].compCode === 'group') {
        return recrusivePushResult(compCodes.filter((item) => compDatas[item].config.groupCode === code));
      }
    });
  };
  recrusivePushResult(selectedCompCodes);
  result.forEach((item) => {
    (Object.keys(offset) as []).forEach((k: keyof Omit<AutoDV.Rect, 'rotation'>) => {
      compDatas[item].attr[k] += Math.round(offset[k]);
    });
  });
};

/**
 * 获取指定分组区间内，某个分组的所在的部分上层分组区间
 * @param groupCode 要查询的分组
 * @param parentCode 分区区间限定
 * @param compCodes 所有的组件code
 * @param compDatas 所有的组件配置
 */
export const getParentGroup = (
  groupCode: string | undefined,
  parentCode: string | undefined,
  compCodes: string[],
  compDatas: AutoDV.State['compDatas']
): string[] => {
  if (!groupCode) {
    return compCodes;
  }
  if (compDatas[groupCode].config.groupCode === parentCode) {
    // if (parentCode) {
    return getAllChildren(groupCode, compCodes, compDatas);
    // } else {
    //   return compCodes;
    // }
  } else {
    return getParentGroup(compDatas[groupCode].config.groupCode, parentCode, compCodes, compDatas);
  }
};
