import { AutoDV } from 'auto-dv-type';
import { IDBPDatabase, openDB } from 'idb';

export const DB_NAME = 'DB_NAME';
export const DB_VERSION = 1;
export const COMP_STORE = 'COMP_STORE';
export const CANVAS_STORE = 'CANVAS_STORE';
export const APPINFO_STORE = 'APPINFO_STORE';

export default class Database {
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
        canvasStore.createIndex('appId', 'appId');
        appInfoStore.createIndex('appId', 'id');
      },
    });
    this.dbIns = db;
    return this;
  }
}
