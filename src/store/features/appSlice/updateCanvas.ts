import { AutoDV } from 'auto-dv-type';

const updateCanvas: AutoDV.ReducerCaseWithPrepare<{ canvas: AutoDV.Canvas }> = {
  reducer(state, action) {
    state.canvas = action.payload.canvas;
  },
  prepare(payload) {
    return { payload: { ...payload, _alias: '更新画布' } };
  },
};

export default updateCanvas;
