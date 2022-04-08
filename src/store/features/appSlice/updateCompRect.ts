import { JuggleDV } from '@juggle-data-view/types';
import { updateAllChildrenRect, updateGroupSize } from 'helpers/groupHandle';

const updateCompRect: JuggleDV.ReducerCaseWithPrepare<{ offset: JuggleDV.Rect }> = {
  reducer(state, action) {
    const { compDatas, selectedCompCodes, compCodes } = state;
    const { offset } = action.payload;
    selectedCompCodes.forEach((scode) => {
      (Object.keys(offset) as []).forEach((k: keyof Omit<JuggleDV.Rect, 'rotation'>) => {
        compDatas[scode].attr[k] += Math.round(offset[k]);
      });
    });
    // 更新所属分组的尺寸
    updateAllChildrenRect(selectedCompCodes, compDatas, compCodes, offset);
    // 更新分组尺寸
    updateGroupSize(selectedCompCodes, compCodes, compDatas, state);
  },
  prepare(payload) {
    const { offset } = payload;
    let _alias = '更新位置或大小';
    if (offset.left || offset.top) {
      _alias = '移动组件';
    }
    if (offset.width || offset.height) {
      _alias = '更改大小';
    }
    return { payload: { ...payload, _alias } };
  },
};

export default updateCompRect;
