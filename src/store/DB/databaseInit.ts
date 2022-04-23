import { JuggleDV } from '@juggle-data-view/types';
import { IDBPDatabase, openDB } from 'idb';

export const DB_NAME = 'DB_NAME';
export const DB_VERSION = 4;
export const COMP_STORE = 'COMP_STORE';
export const CANVAS_STORE = 'CANVAS_STORE';
export const APPINFO_STORE = 'APPINFO_STORE';

export default class Database {
  dbIns: Promise<IDBPDatabase<JuggleDV.AppConfig>>;

  constructor() {
    const dbVersion = localStorage.getItem('dbVersion');
    if (!dbVersion || Number(dbVersion) !== DB_VERSION) {
      indexedDB.deleteDatabase(DB_NAME);
      localStorage.setItem('dbVersion', '' + DB_VERSION);
      window.location.reload();
    }

    const db = openDB<JuggleDV.AppConfig>(DB_NAME, DB_VERSION, {
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
