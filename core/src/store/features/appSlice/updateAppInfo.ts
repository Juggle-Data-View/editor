import { JuggleDV } from '@juggle-data-view/types';

const updateAppInfo: JuggleDV.ReducerCaseWithPrepare<{
  targetId: string;
}> = {
  reducer(state, { payload }) {
    const { targetId } = payload;
    //TODO: update JuggleDV.AppConfig.appId & JuggleDV.Canvas.appId
    state.app.id = targetId as any;
    state.canvas.appId = targetId as any;
  },
  prepare(payload) {
    return { payload: { ...payload } };
  },
};

export default updateAppInfo;
