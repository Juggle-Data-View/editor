import { IDBPDatabase, openDB } from 'idb';

export const DB_NAME = 'DB_NAME';
export const DB_VERSION = 1;
export const COMP_STORE = 'COMP_STORE';
export const CANVAS_STORE = 'CANVAS_STORE';

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
          keyPath: ['id', 'canvasId'],
          autoIncrement: false,
        });

        compStore.createIndex('compId', ['id', 'code']);
        canvasStore.createIndex('canvasId', ['id', 'canvasId']);
      },
    });
    this.dbIns = db;
    return this;
  }

  async initDB(appId?: number) {
    console.log('init db', appId);
  }

  getConfigByAPPID = async (appId: number) => {
    try {
      const db = await this.dbIns;
      // const keyrange = IDBKeyRange.only(appId);
      // const components = await db.getAll(COMP_STORE, appId);
      // console.log(components);
      const tx = db.transaction(COMP_STORE);
      const index = tx.store.index('compId');
      console.log(index, index.iterate(appId));

      const result = [];
      for await (const item of index.iterate(appId)) {
        console.log(item.value);
        result.push(item.value);
      }
      console.log(result);
    } catch (error) {}
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
}

export default new DB();
