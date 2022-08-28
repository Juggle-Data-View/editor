import { JuggleDV } from '@juggle-data-view/types';
import { actionStatusSelector } from 'helpers/selectors';
import { getAllSelectedComps } from '@utils/getAllChildren';

const toggleCompStatus: JuggleDV.ReducerCaseWithPrepare<{ code?: string; status: keyof JuggleDV.ICompOwnStatus }> = {
  reducer(state, action) {
    const { compDatas, selectedCompCodes, compCodes } = state;
    const { code, status } = action.payload;
    const codes = getAllSelectedComps(selectedCompCodes, compDatas, compCodes);
    if (code) {
      // 对单个组件的状态处理
      compDatas[code][status] = false;
    } else {
      // 多个组件的状态处理，如果按钮状态是高亮，就解除高亮，否则相反。
      const { highlight_lock, highlight_hide } = actionStatusSelector(state);
      const highlight: Record<typeof status, boolean> = {
        locked: highlight_lock,
        hided: highlight_hide,
      };
      codes.forEach((scode) => (compDatas[scode][status] = !highlight[status]));
    }
  },
  prepare(payload: { code?: string; status: keyof JuggleDV.ICompOwnStatus }) {
    return {
      payload: { ...payload, _alias: payload.status === 'hided' ? '隐藏' : '锁定' },
    };
  },
};

export default toggleCompStatus;
