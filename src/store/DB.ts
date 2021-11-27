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
      console.log('trigger ddd');
      const db = await this.dbIns;
      const getIndex = (storeName: string, indexName: string) => {
        return db.transaction([storeName], 'readonly').objectStore(storeName).index(indexName);
      };
      const compIndex = getIndex(COMP_STORE, 'appId');
      const canvasIndex = getIndex(CANVAS_STORE, 'canvasId');
      const appIndex = getIndex(APPINFO_STORE, 'appId');
      const appKeyrange = IDBKeyRange.only(appId);
      const canvasKeyrange = IDBKeyRange.only(canvasId);
      const components: AutoDV.Comp[] = await compIndex.getAll(appKeyrange);
      const canvasInfo: AutoDV.Canvas = await canvasIndex.get(appKeyrange);
      const appInfo: Omit<AutoDV.AppConfig, 'canvas'> = await appIndex.get(canvasKeyrange);
      return {
        compInsts: components,
        canvas: canvasInfo,
        app: appInfo,
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
