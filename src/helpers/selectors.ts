/**
 * 创建`selector`函数，优化重复计算的性能.
 * createSelector函数的第一个参数为依赖项，只有当依赖项发现变化时，才会调用第二个参数的函数
 *
 * 优化点：
 * Redux Store状态发生变化引起组件更新时，组件绑定的`mapStateToProps`及内部函数都会被频道调用，影响性能。
 * 使用`selector`后，可以缓存处理，减少重复计算。如果传递的props只有selector计算的值，还会减少组件的重复渲染。
 */

import { createSelector } from '@reduxjs/toolkit';
import { getAutoDV } from 'utils';
import { AutoDV } from 'auto-dv-type';

const getCompCodes = (state: AutoDV.State) => state.compCodes;
const getCompDatas = (state: AutoDV.State) => state.compDatas;
const getSelectedCompCodes = (state: AutoDV.State) => state.selectedCompCodes;

/**
 * 组件按钮状态，一般在左侧组件列表上下位置的按钮中。
 */
export interface IActionStatus {
  /** 禁用上移 */
  disable_moveup: boolean;
  /** 禁用下移 */
  disable_movedown: boolean;
  /** 禁用置顶 */
  disable_move2head: boolean;
  /** 禁用置底 */
  disable_move2foot: boolean;
  /** 禁用删除 */
  disable_del: boolean;
  /** 禁用锁定 */
  disable_lock: boolean;
  /** 禁用隐藏 */
  disable_hide: boolean;
  /** 高亮锁定 */
  highlight_lock: boolean;
  /** 高亮隐藏 */
  highlight_hide: boolean;
}

/**
 * 根据依赖项，获取组件的操作状态
 * 依赖项：
 * @param codes 所有组件code
 * @param scodes 选中组件code
 * @param compDatas 所有组件数据
 */
export const actionStatusSelector = createSelector(
  [getCompCodes, getSelectedCompCodes, getCompDatas],
  (codes, scodes, compDatas) => {
    const sLen = scodes.length;
    const Len = codes.length;
    const hasGroup = scodes.every((code) => {
      return compDatas[code].config.groupCode === undefined;
    });
    return {
      disable_moveup: !sLen || scodes.includes(codes[0]),
      disable_movedown: !sLen || scodes.includes(codes[Len - 1]),
      disable_move2head: ((!sLen || scodes.includes(codes[0])) && sLen < 2) || !hasGroup,
      disable_move2foot: ((!sLen || scodes.includes(codes[Len - 1])) && sLen < 2) || !hasGroup,
      disable_del: !sLen,
      disable_lock: !sLen,
      disable_hide: !sLen,
      // 如果选中的组件全是某种状态，才高亮按钮
      highlight_lock: !!sLen && scodes.every((code) => compDatas[code].locked),
      highlight_hide: !!sLen && scodes.every((code) => compDatas[code].hided),
    };
  }
);

/**
 * 根据依赖项，获取选中组件的Rect
 * 依赖项：
 * @param scodes 选中的ids
 * @param compDatas 组件数据
 */
export const selectedRectSelector = createSelector([getSelectedCompCodes, getCompDatas], (scodes, compDatas) => {
  // 单选
  if (scodes.length === 1) {
    return compDatas[scodes[0]].attr;
  }
  // 多选
  const rects = scodes.map((scode) => {
    return compDatas[scode].attr;
  });

  const minLeft = Math.min(...rects.map((r) => r.left));
  const minTop = Math.min(...rects.map((r) => r.top));
  const maxRight = Math.max(...rects.map((r) => r.left + r.width));
  const maxBottom = Math.max(...rects.map((r) => r.top + r.height));

  return {
    left: minLeft,
    top: minTop,
    width: maxRight - minLeft,
    height: maxBottom - minTop,
    angle: 0,
    scale: [1, 1],
  };
});

/**
 * 根据依赖项，获取选中组件的Rect
 * 依赖项：
 * @param scodes 选中的ids
 * @param compDatas 组件数据
 */
export const groupRectSelector = (scodes: string[]) =>
  createSelector(getCompDatas, (compDatas) => {
    // 单选
    if (scodes.length === 1) {
      return compDatas[scodes[0]].attr;
    }
    // 多选
    const rects = scodes.map((scode) => compDatas[scode].attr);

    const minLeft = Math.min(...rects.map((r) => r.left));
    const minTop = Math.min(...rects.map((r) => r.top));
    const maxRight = Math.max(...rects.map((r) => r.left + r.width));
    const maxBottom = Math.max(...rects.map((r) => r.top + r.height));

    return {
      left: minLeft,
      top: minTop,
      width: maxRight - minLeft,
      height: maxBottom - minTop,
      angle: 0,
      scale: [1, 1],
    };
  });

export const getSelectedRect = () => {
  const autoDVState = getAutoDV();
  return selectedRectSelector(autoDVState);
};
