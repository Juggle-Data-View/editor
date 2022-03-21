import { AutoDV } from 'auto-dv-type';

const deleteDatasource: AutoDV.ReducerCaseWithPrepare<{ dataSourceId: string }> = {
  reducer(state, action) {
    const { dataSourceId } = action.payload;
    // const dataSourceIndex = state.app.datasources
    if (dataSourceId in state.app.datasources) {
      delete state.app.datasources[dataSourceId];
    }
  },
  prepare({ dataSourceId }) {
    return { payload: { _alias: '删除数据源', dataSourceId } };
  },
};
export default deleteDatasource;
