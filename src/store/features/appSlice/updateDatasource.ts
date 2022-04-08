import { JuggleDV } from '@juggle-data-view/types';

const updateDatasource: JuggleDV.ReducerCaseWithPrepare<{
  datasource: JuggleDV.MixinDatasource;
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
