import { JuggleDV } from '@juggle-data-view/types';

const updateCanvas: JuggleDV.ReducerCaseWithPrepare<{ canvas: JuggleDV.Canvas }> = {
  reducer(state, action) {
    state.canvas = action.payload.canvas;
  },
  prepare(payload) {
    return { payload: { ...payload, _alias: '更新画布' } };
  },
};

export default updateCanvas;
