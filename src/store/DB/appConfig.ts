import { JuggleDV } from '@juggle-data-view/types';
import Database, { APPINFO_STORE } from './databaseInit';

class AppConfig extends Database {
  updateAppConfig = async (payload: JuggleDV.AppConfig, appId: number) => {
    try {
      const db = await this.dbIns;
      const keyRange = IDBKeyRange.only(appId);
      const cursor = await db.transaction(APPINFO_STORE, 'readwrite').objectStore(APPINFO_STORE).openCursor(keyRange);
      if (cursor) {
        await cursor.update(payload);
      } else {
        throw new Error(`Can't update app information ${appId}`);
      }
    } catch (error) {
      console.log(error);
    }
  };
}

export default new AppConfig();
