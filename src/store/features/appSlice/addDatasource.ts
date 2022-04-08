import { JuggleDV } from '@juggle-data-view/types';
export const handleAdd = (datasources: JuggleDV.AppConfig['datasources'], datasource: JuggleDV.MixinDatasource) => {
  const { dataSourceId } = datasource;
  if (dataSourceId in datasource) {
    return;
  }
  datasources[dataSourceId] = datasource;
};

export const addDatasource: JuggleDV.ReducerCaseWithPrepare<{
  datasource: JuggleDV.MixinDatasource;
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
