import { JuggleDV } from '@juggle-data-view/types';
import getAllChildren from 'utils/getAllChildren';

const cancelGroup: JuggleDV.ReducerCaseWithPrepare<{ code: string }> = {
  reducer(state, action) {
    const { compDatas, compCodes } = state;
    const { code } = action.payload;
    const groupChildren = getAllChildren(code, compCodes, compDatas);
    const groupIndex = compCodes.indexOf(code);
    groupChildren.forEach((item) => {
      compDatas[item].config.groupCode = compDatas[code].config.groupCode;
    });
    compCodes.splice(groupIndex, 1);
    delete compDatas[code];
    state.selectedCompCodes = [];
  },
  prepare(payload) {
    return { payload: { ...payload, _alias: '取消分组' } };
  },
};

export default cancelGroup;
