import { JuggleDV } from '@juggle-data-view/types';

const updateComp: JuggleDV.ReducerCaseWithPrepare<{ code: string; comp: JuggleDV.Comp }> = {
  reducer(state, action) {
    const { code, comp } = action.payload;
    state.compDatas[code] = comp;
  },
  prepare(payload) {
    return {
      payload: { ...payload, _alias: `更新${payload.comp.alias}配置` },
    };
  },
};

export default updateComp;
