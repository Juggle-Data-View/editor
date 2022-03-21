import { AutoDV } from 'auto-dv-type';

const updateDatasource: AutoDV.ReducerCaseWithPrepare<{
  datasource: AutoDV.MixinDatasource;
}> = {
  reducer(state, action) {
    const { dataSourceId } = action.payload.datasource;
    const oldConfig = state.app.datasources[dataSourceId];
    state.app.datasources[dataSourceId] = {
      ...oldConfig,
      ...action.payload.datasource,
    };
  },
  prepare({ datasource }) {
    return {
      payload: {
        datasource,
        _alias: '更新数据源',
      },
    };
  },
};
export default updateDatasource;
