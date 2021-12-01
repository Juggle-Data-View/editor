import { IDBPDatabase, openDB } from 'idb';

export const DB_NAME = 'DB_NAME';
export const DB_VERSION = 1;
export const COMP_STORE = 'COMP_STORE';
export const CANVAS_STORE = 'CANVAS_STORE';
export const APPINFO_STORE = 'APPINFO_STORE';

class DB {
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
          keyPath: ['id', 'canvasId'],
          autoIncrement: false,
        });

        compStore.createIndex('appId', 'id');
        canvasStore.createIndex('canvasId', 'canvasId');
        appInfoStore.createIndex('appId', 'id');
      },
    });
    this.dbIns = db;
    return this;
  }

  async initDB(appId?: number) {
    console.log('init db', appId);
  }

  getConfigByAPPID = async (appId: number, canvasId: number) => {
    try {
      /**
       * The function is resolved transaction finish;
       * @param storeName
       * @param indexName
       * @param primaryKey
       * @param operation
       * @returns
       */
      const getConfig = async (
        storeName: string,
        indexName: string,
        primaryKey: number,
        operation: 'getAll' | 'get'
      ) => {
        const index = (await this.dbIns).transaction([storeName], 'readonly').objectStore(storeName).index(indexName);
        const keyrange = IDBKeyRange.only(primaryKey);
        const result = index[operation](keyrange);
        return result;
      };

      return {
        compInsts: (await getConfig(COMP_STORE, 'appId', appId, 'getAll')) as AutoDV.Comp[],
        canvas: (await getConfig(CANVAS_STORE, 'canvasId', canvasId, 'get')) as AutoDV.Canvas,
        app: (await getConfig(APPINFO_STORE, 'appId', appId, 'get')) as AutoDV.AppConfig,
      };
    } catch (error) {
      console.log(error);
    }
  };

  addComponents = async (payload: AutoDV.Comp[]) => {
    try {
      const db = await this.dbIns;
      payload.forEach((item) => {
        db.add(COMP_STORE, { id: 146, ...item });
      });
    } catch (error) {
      if (error) {
        console.log(error);
      } else {
        console.log('Add components success');
      }
    }
  };
  // setApp = async (appInfo: AutoDV.AppConfig) => {};
}

export default new DB();
