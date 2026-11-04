import { JuggleDV } from '@juggle-data-view/types';
import { DataSourceType } from '@configurableComponents/const';
import { getStaticData } from '@components/base/BaseActions';

/**
 * Keep API datasource records that were stored with the page, and fill static
 * bodies for components that do not have one yet. Preview and the editor both
 * use this so a fresh visit does not render charts against an empty map.
 */
export const hydrateDatasources = async (app: JuggleDV.AppConfig): Promise<JuggleDV.AppConfig['datasources']> => {
  const compInsts = app.canvas && app.canvas.compInsts;
  const result = { ...(app.datasources || {}) } as JuggleDV.AppConfig['datasources'];
  if (!compInsts) {
    return result;
  }
  for await (const { compCode, dataConfig } of compInsts) {
    if (!dataConfig) {
      continue;
    }
    const sourceId = dataConfig.dataSourceId || compCode;
    if (sourceId in result || compCode in result || dataConfig.dataSourceType === DataSourceType.API) {
      continue;
    }
    result[sourceId] = {
      ...dataConfig,
      dataSourceId: sourceId,
      name: compCode,
      dataSourceType: DataSourceType.Static,
      body: await getStaticData(compCode, result),
    } as JuggleDV.MixinDatasource;
  }
  return result;
};
