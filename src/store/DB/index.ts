import components from './components';
import global from 'utils/global';
import { AutoDV } from 'auto-dv-type';
import { omit } from 'lodash';
import Database, { APPINFO_STORE, CANVAS_STORE, COMP_STORE } from './databaseInit';
import AppConfig from './default.conf';

export const defaultRect: AutoDV.Rect = {
  left: 0,
  top: 0,
  width: 0,
  height: 0,
};

class DB extends Database {
  initDB = async (config: AutoDV.AppConfig) => {
    const db = await this.dbIns;
    const { canvas: initCanvas } = config;
    const appInfo = omit(config, 'canvas');

    const canvas = {
      ...omit(initCanvas, 'compInsts'),
      appId: appInfo.id,
    };

    const normalizeComps: AutoDV.Comp<AutoDV.Config>[] = initCanvas.compInsts || [];
    await db.add(APPINFO_STORE, appInfo);
    await db.add(CANVAS_STORE, canvas);
    await components.addComponents(normalizeComps, Number(appInfo.id));
  };

  needInitDB = async (config: AutoDV.AppConfig) => {
    const appInfos = await this.getConfig<Omit<AutoDV.AppConfig, 'canvas'>[]>(
      APPINFO_STORE,
      'appId',
      Number(config.id),
      'getAll'
    );

    return (
      !appInfos.length ||
      !appInfos.every(
        ({ modifyTime, modifyUser }) => config.modifyTime === modifyTime && modifyUser === config.modifyUser
      )
    );
  };

  getConfig = async <T = any>(
    storeName: string,
    indexName: string,
    primaryKey?: number,
    operation: 'getAll' | 'get' = 'get'
  ): Promise<T> => {
    const index = (await this.dbIns).transaction([storeName], 'readonly').objectStore(storeName).index(indexName);
    const existedKeys = await index.getAllKeys();
    if (existedKeys.length > 0 || operation === 'get') {
      const isExist = existedKeys.includes(primaryKey as any);
      const searchKey = Array.isArray(existedKeys[0]) ? existedKeys[0][0] : existedKeys[0];
      const keyrange = IDBKeyRange.only(isExist ? primaryKey : searchKey);
      const result = await index[operation](keyrange);
      return result;
    } else {
      return (await index.getAll()) as any;
    }
  };

  getConfigByAPPID = async (appId: number): Promise<AutoDV.AppConfig | undefined> => {
    try {
      const app = await this.getConfig<AutoDV.AppConfig>(APPINFO_STORE, 'appId', appId, 'get');
      const canvas = await this.getConfig<AutoDV.AppConfig['canvas']>(CANVAS_STORE, 'appId', appId, 'get');

      const compInsts = (await this.getConfig<AutoDV.Comp[]>(COMP_STORE, 'appId', appId, 'getAll')).sort(
        (prev, next) => -1 * (next.createTime - prev.createTime)
      );
      global.appId = app.id;
      global.canvasId = canvas.id;
      return {
        ...app,
        canvas: {
          ...canvas,
          compInsts,
        },
      };
    } catch (error) {
      console.log(error);
    }
  };

  getDefaultConfig = async (): Promise<AutoDV.AppConfig | undefined> => {
    const app = omit(AppConfig, 'canvas');
    const { canvas } = AppConfig;
    global.appId = app.id;
    global.canvasId = canvas.id;
    await this.initDB(AppConfig);
    return {
      ...app,
      canvas,
    };
  };
}

const dbInst = new DB();

export default dbInst;
