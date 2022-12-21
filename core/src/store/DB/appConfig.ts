import { JuggleDV } from '@juggle-data-view/types';
import Database, { APPINFO_STORE, CANVAS_STORE, COMP_STORE } from './databaseInit';
import components from './components';
import { localStorageKey } from '@helpers/fetchAppConfig';

class AppConfig extends Database {
  updateAppConfigVersion = async (appId: string | number, version: number) => {
    try {
      const db = await this.dbIns;
      if (!appId) {
        throw new Error('app id is not exit in local');
      }
      const app = await this.getConfig<JuggleDV.AppConfig>(APPINFO_STORE, 'appId', appId, 'get');
      if (!app) {
        return;
      }
      const keyRange = IDBKeyRange.only(appId);
      const cursor = await db.transaction(APPINFO_STORE, 'readwrite').objectStore(APPINFO_STORE).openCursor(keyRange);

      if (version > app.version) {
        cursor?.update({
          ...app,
          version,
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  getAppConfigVersion = async () => {
    try {
      const appId = localStorage.getItem(localStorageKey.CURRENT_APP_ID);
      if (!appId) {
        throw new Error('app id is not exit in local');
      }
      const app = await this.getConfig<JuggleDV.AppConfig>(APPINFO_STORE, 'appId', appId, 'get');
      return app.version;
    } catch (error) {
      console.log(error);
    }
  };

  updateAppConfig = async (payload: JuggleDV.AppConfig, appId: number | string) => {
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

  cloneAppConfig = async (newId: string, oldId: string) => {
    try {
      const db = await this.dbIns;
      const app = await this.getConfig<JuggleDV.AppConfig>(APPINFO_STORE, 'appId', oldId, 'get');
      const canvas = await this.getConfig<JuggleDV.AppConfig['canvas']>(CANVAS_STORE, 'appId', oldId, 'get');
      const compInsts = (await this.getConfig<JuggleDV.Comp[]>(COMP_STORE, 'appId', oldId, 'getAll')).sort(
        (prev, next) => -1 * (next.createTime - prev.createTime)
      );

      const appConfig = {
        ...app,
        id: newId,
      };
      const canvasConfig: JuggleDV.Canvas = {
        ...canvas,
        //TODO: update JuggleDV.Canvas.appId
        appId: newId as any,
      };
      const compInstsConfig = compInsts.map((data) => ({
        ...data,
        id: newId,
      }));
      db.add(APPINFO_STORE, appConfig);
      db.add(CANVAS_STORE, canvasConfig);
      //TODO: update JuggleDV.Comp.id
      components.addComponents(compInstsConfig, newId as any);
    } catch (error) {}
  };
}

export default new AppConfig();
