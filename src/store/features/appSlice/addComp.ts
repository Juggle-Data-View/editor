import { JuggleDV } from '@juggle-data-view/types';
import { DataSourceType } from '@configurableComponents/const';
import { handleAdd as handleSourceDataAdd } from './addDatasource';

/**
 *
 * @param state redux store
 * @param comp new components
 * @returns void
 */
const handleDataConfig = (state: JuggleDV.State, comp: JuggleDV.AddCompParams) => {
  const { dataConfig, compCode, staticData } = comp;
  console.log(comp);

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
  handleSourceDataAdd(datasources, {
    ...oldDatasource,
    dataSourceId: dataSourceId || compCode,
    dataSourceType: DataSourceType.Static,
    body: staticData,
    name: compCode,
  });
};

/**
 * When add components,
 * it's version will be push `state.canvas.mountComp` if version is not in the array
 * @param state redux store
 * @param comp new components
 * @returns void
 */
const handleComponentVersionMount = (state: JuggleDV.State, comp: JuggleDV.AddCompParams) => {
  const { compCode, version } = comp;
  if (!state.canvas.mountComp) {
    state.canvas.mountComp = {
      [compCode]: [version],
    };
  } else {
    const oldVersion = state.canvas.mountComp[compCode];
    if (!oldVersion) {
      state.canvas.mountComp[compCode] = [version];
    } else if (oldVersion.includes(version)) {
      return;
    } else {
      state.canvas.mountComp[compCode].push(version);
    }
  }
};

const addComp: JuggleDV.ReducerCaseWithPrepare<{ comps: JuggleDV.AddCompParams[] }> = {
  reducer: (state, action) => {
    const { comps } = action.payload;
    state.selectedCompCodes = [];
    comps.forEach((newComp) => {
      const { code } = newComp;
      state.compCodes.push(code);
      state.compDatas[code] = newComp;
      state.selectedCompCodes.push(code);
      handleDataConfig(state, newComp);
      handleComponentVersionMount(state, newComp);
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
