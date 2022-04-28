import { JuggleDV } from '@juggle-data-view/types';
import { DataSourceType } from 'config/const';
import { fetchAPIData, fetchCSVData } from 'helpers/fetchData';

const getOriginData = async (
  datasource?: JuggleDV.MixinDatasource,
  dataConfig?: JuggleDV.CompDataConfig
): Promise<any[]> => {
  if (!datasource || !dataConfig) {
    return [];
  }
  switch (datasource?.dataSourceType) {
    case DataSourceType.Static:
      return datasource.body;
    case DataSourceType.API: {
      if (!dataConfig) {
        throw new Error('API datasource configuration error');
      }
      return await fetchAPIData(datasource);
    }
    case DataSourceType.CSV: {
      if (!dataConfig) {
        throw new Error('CSV datasource configuration error');
      }
      return await fetchCSVData(datasource);
    }
    default:
      throw new Error('Datasource bound error');
  }
};

export default getOriginData;
