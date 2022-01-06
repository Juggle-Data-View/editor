import { IDBPDatabase, openDB } from 'idb';
import components from './components';

export const DB_NAME = 'DB_NAME';
export const DB_VERSION = 1;
export const COMP_STORE = 'COMP_STORE';
export const CANVAS_STORE = 'CANVAS_STORE';
export const APPINFO_STORE = 'APPINFO_STORE';

export class DB {
  dbIns: Promise<IDBPDatabase<AutoDV.AppConfig>>;

  constructor() {
    const db = openDB<AutoDV.AppConfig>(DB_NAME, DB_VERSION, {
      upgrade(db) {
        const compStore = db.createObjectStore(COMP_STORE, {
          keyPath: ['id', 'code'],
          autoIncrement: false,
        });

        const canvasStore = db.createObjectStore(CANVAS_STORE, {
          keyPath: 'id',
          autoIncrement: false,
        });

        const appInfoStore = db.createObjectStore(APPINFO_STORE, {
          keyPath: 'id',
          autoIncrement: false,
        });

        compStore.createIndex('appId', 'id');
        canvasStore.createIndex('canvasId', 'id');
        appInfoStore.createIndex('appId', 'id');
      },
    });
    this.dbIns = db;
    return this;
  }

  initDB = async (config: AutoDV.AppConfig) => {
    const db = await this.dbIns;
    const { canvas: initCanvas } = config;
    const appInfo = {
      ...config,
      canvas: {
        ...initCanvas,
      },
    };
    delete appInfo.canvas.compInsts;
    const canvas = appInfo.canvas;
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
    primaryKey: number,
    operation: 'getAll' | 'get'
  ): Promise<T> => {
    const index = (await this.dbIns).transaction([storeName], 'readonly').objectStore(storeName).index(indexName);
    const keyrange = IDBKeyRange.only(primaryKey);
    const result = index[operation](keyrange);
    return result;
  };

  getConfigByAPPID = async (appId: number): Promise<AutoDV.AppConfig | undefined> => {
    try {
      const app = (await this.getConfig(APPINFO_STORE, 'appId', appId, 'get')) as AutoDV.AppConfig;
      const compInsts = await (
        await this.getConfig<AutoDV.Comp[]>(COMP_STORE, 'appId', appId, 'getAll')
      ).sort((prev, next) => -1 * (next.createTime - prev.createTime));
      return {
        ...app,
        canvas: {
          ...app.canvas,
          compInsts,
        },
      };
    } catch (error) {
      console.log(error);
    }
  };
}

const dbInst = new DB();

export default dbInst;
