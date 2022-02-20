import { getAllSelectedComps } from 'utils/getAllChildren';

const deleteComp: AutoDV.ReducerCaseWithPrepare = {
  reducer(state) {
    const { selectedCompCodes, compCodes, compDatas } = state;
    if (selectedCompCodes.length === compCodes.length) {
      state.compCodes = [];
      state.selectedCompCodes = [];
      state.compDatas = {};
      return;
    }
    const scodes: string[] = compCodes.filter((code) => selectedCompCodes.includes(code));
    const allSelectComp = getAllSelectedComps(scodes, compDatas, compCodes);
    allSelectComp.forEach((item) => {
      compCodes.splice(
        compCodes.findIndex((code) => code === item),
        1
      );
      delete compDatas[item];
    });
    state.selectedCompCodes = [];
  },
  prepare() {
    return { payload: { _alias: '删除组件' } };
  },
};
export default deleteComp;
