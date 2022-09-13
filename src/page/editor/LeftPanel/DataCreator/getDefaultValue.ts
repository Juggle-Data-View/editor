import { DataSourceType as DT, HttpMethod } from '@configurableComponents/const';
import { nanocode } from 'utils';
import { JuggleDV } from '@juggle-data-view/types';

const getDefaultValues = (options?: JuggleDV.MixinDatasource) => {
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
      } as unknown as JuggleDV.APIDatasourceInstance;

    case DT.CSV:
      return {
        ...options,
        dataSourceType: DT.CSV,
        url: '',
        body: '',
      } as JuggleDV.ExeclDatasourceInstance;

    default:
      return {
        ...options,
        dataSourceType: DT.Static,
        body: '',
      } as JuggleDV.StaticDatasourceInstance;
  }
};

export default getDefaultValues;
