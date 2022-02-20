import { omit, pick } from 'lodash';

const init: AutoDV.ReducerCaseWithPrepare<{ app: AutoDV.AppConfig }> = {
  reducer(state, action) {
    const { app } = action.payload;
    const { compInsts } = app.canvas;

    state.app = omit(app, 'canvas');
    state.canvas = omit(pick(app, 'canvas').canvas, 'compInsts');
    if (compInsts) {
      compInsts.forEach((comp) => {
        state.compCodes.push(comp.code);
        state.compDatas[comp.code] = comp;
      });
    }
  },
  prepare: ({ app }) => {
    return {
      payload: {
        app,
        _alias: '初始状态',
      },
    };
  },
};

export default init;
