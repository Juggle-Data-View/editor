import { AutoDV } from 'auto-dv-type';
export const handleAdd = (datasources: AutoDV.AppConfig['datasources'], datasource: AutoDV.MixinDatasource) => {
  const { dataSourceId } = datasource;
  if (dataSourceId in datasource) {
    return;
  }
  datasources[dataSourceId] = datasource;
};

export const addDatasource: AutoDV.ReducerCaseWithPrepare<{
  datasource: AutoDV.MixinDatasource;
}> = {
  reducer(state, action) {
    return handleAdd(state.app.datasources, action.payload.datasource);
  },
  prepare({ datasource }) {
    return {
      payload: {
        datasource,
        _alias: '新建数据源',
      },
    };
  },
};
