import { DataSourceType as DT, HttpMethod } from 'config/const';
import { nanocode } from 'utils';

const getDefaultValues = (type?: AutoDV.DataSourceType) => {
  switch (type) {
    case DT.API:
      return {
        url: '',
        method: HttpMethod.GET,
        name: '',
        dataSourceId: nanocode('api'),
        dataSourceType: DT.API,
      } as AutoDV.APIDatasourceInstance;

    case DT.CSV:
      return {
        dataSourceType: DT.CSV,
        url: '',
        name: '',
        dataSourceId: nanocode('csv'),
        body: '',
      } as AutoDV.ExeclDatasourceInstance;

    default:
      return {
        dataSourceType: DT.Static,
        dataSourceId: nanocode('static'),
      } as AutoDV.StaticDatasourceInstance;
  }
};

export default getDefaultValues;
