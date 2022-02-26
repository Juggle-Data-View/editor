const updateComp: AutoDV.ReducerCaseWithPrepare<{ code: string; comp: AutoDV.Comp }> = {
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
