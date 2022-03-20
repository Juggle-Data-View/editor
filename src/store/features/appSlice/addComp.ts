import { DataSourceType } from 'config/const';
import { handleAdd } from './addDatasource';

const addComp: AutoDV.ReducerCaseWithPrepare<{ comps: AutoDV.AddCompParams[] }> = {
  reducer: (state, action) => {
    const { comps } = action.payload;
    state.selectedCompCodes = [];
    comps.forEach((newComp) => {
      const { code, dataConfig, compCode, staticData } = newComp;
      state.compCodes.push(code);
      state.compDatas[code] = newComp;
      state.selectedCompCodes.push(code);
      if (!dataConfig) {
        //The component haven't data
        return;
      }
      const { dataSourceId } = dataConfig;
      const datasources = state.app.datasources;
      const oldDatasource = datasources[dataSourceId];
      dataConfig.dataSourceId = dataSourceId || compCode;
      if (dataSourceId in datasources) {
        //datasource is existed
        return;
      }
      handleAdd(datasources, {
        ...oldDatasource,
        dataSourceId: dataSourceId || compCode,
        dataSourceType: DataSourceType.Static,
        body: staticData,
        name: compCode,
      });
    });
  },
  prepare: ({ comps }) => {
    return {
      payload: {
        comps,
        _alias: comps.length === 1 ? `添加${comps[0].title || comps[0].alias}` : `批量添加`,
      },
    };
  },
};

export default addComp;
