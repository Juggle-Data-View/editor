import { DataSourceType as DT, HttpMethod } from '@configurableComponents/const';
import { nanocode } from 'utils';
import { JuggleDV } from '@juggle-data-view/types';

interface Options extends JuggleDV.DataConfig {
  dataSourceType: DT;
}

const sourceString = (type: DT) => {
  switch (type) {
    case DT.Static:
      return 'static';
    case DT.API:
      return 'api';
    case DT.CSV:
      return 'csv';
    default:
      return 'static';
  }
};
const sourceName = (type: string) => `new ${type} datasource`;
const sourceID = (type: string) => nanocode(type);

const sourceBaseOptions = (type: DT): Options => {
  return {
    dataSourceType: type,
    name: sourceName(sourceString(type)),
    dataSourceId: sourceID(sourceString(type)),
    body: '',
  };
};

const defaultOptions: Options = sourceBaseOptions(DT.Static);

const getDefaultValues = (dataSourceType: DT) => {
  const option = sourceBaseOptions(dataSourceType);
  switch (dataSourceType) {
    case DT.Static:
      return defaultOptions as JuggleDV.StaticDatasourceInstance;
    case DT.API:
      return {
        ...option,
        url: '',
        method: HttpMethod.GET,
        header: [
          {
            key: 'Content-type',
            value: 'application/json;',
          },
        ],
      } as unknown as JuggleDV.APIDatasourceInstance;

    case DT.CSV:
      return {
        ...option,
        url: '',
        body: '',
      } as JuggleDV.ExeclDatasourceInstance;
  }
};

export default getDefaultValues;
