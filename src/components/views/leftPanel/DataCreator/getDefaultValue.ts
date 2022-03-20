import { DataSourceType as DT, HttpMethod } from 'config/const';
import { nanocode } from 'utils';

const getDefaultValues = (options?: AutoDV.MixinDatasource) => {
  if (!options) {
    return {
      dataSourceType: DT.Static,
      dataSourceId: nanocode('static'),
      name: 'default name',
      body: '',
    };
  }
  const { dataSourceType: type } = options;
  switch (type) {
    case DT.API:
      return {
        ...options,
        url: '',
        method: HttpMethod.GET,
        header: [
          {
            key: 'Content-type',
            value: 'application/json;',
          },
        ],
        dataSourceType: DT.API,
      } as AutoDV.APIDatasourceInstance;

    case DT.CSV:
      return {
        ...options,
        dataSourceType: DT.CSV,
        url: '',
        body: '',
      } as AutoDV.ExeclDatasourceInstance;

    default:
      return {
        ...options,
        dataSourceType: DT.Static,
        body: '',
      } as AutoDV.StaticDatasourceInstance;
  }
};

export default getDefaultValues;
