import { JuggleDV } from '@juggle-data-view/types';

const importJSON: JuggleDV.ReducerCaseWithPrepare<{ content: JuggleDV.ExportContent }> = {
  reducer(state, action) {
    const { content } = action.payload;
    state.selectedCompCodes = [];
    content.components.forEach((newComp) => {
      const { code } = newComp;
      state.compCodes.push(code);
      state.compDatas[code] = newComp;
      state.selectedCompCodes.push(code);
    });
    if (content.canvas) {
      state.canvas = {
        ...state.canvas,
        ...content.canvas,
      };
    }
  },
  prepare(payload) {
    return { payload: { ...payload, _alias: '导入组件' } };
  },
};

export default importJSON;
