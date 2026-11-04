import components from './components';
import { JuggleDV } from '@juggle-data-view/types';
import { omit } from 'lodash';
import Database, { APPINFO_STORE, CANVAS_STORE, COMP_STORE } from './databaseInit';
import AppConfig from './default.conf';
import { localStorageKey } from '@helpers/fetchAppConfig';
import { isDemo } from 'demo/isDemo';
import demoAppConfig, { DEMO_APP_ID, DEMO_SEED_VERSION, sandboxAppConfig } from 'demo/seedApp';

export const defaultRect: JuggleDV.Rect = {
  left: 0,
  top: 0,
  width: 0,
  height: 0,
};

class DB extends Database {
  initDB = async (config: JuggleDV.AppConfig) => {
    const db = await this.dbIns;
    const { canvas: initCanvas } = config;
    const appInfo = omit(config, 'canvas');
    localStorage.setItem(localStorageKey.CURRENT_APP_ID, appInfo.id + '');
    const canvas = {
      ...omit(initCanvas, 'compInsts'),
      appId: appInfo.id,
    };

    const normalizeComps: JuggleDV.Comp<JuggleDV.Config>[] = initCanvas.compInsts || [];
    await db.add(APPINFO_STORE, appInfo);
    await db.add(CANVAS_STORE, canvas);
    await components.addComponents(normalizeComps, Number(appInfo.id));
  };

  needInitDB = async (id: string | number) => {
    const appId = isNaN(Number(id)) ? (id as unknown as string) : Number(id);

    const appInfos = await this.getConfig<Omit<JuggleDV.AppConfig, 'canvas'>[]>(
      APPINFO_STORE,
      'appId',
      appId,
      'getAll'
    );

    return !appInfos.length;
  };

  getConfigByAPPID = async (appId: number | string): Promise<JuggleDV.AppConfig | undefined> => {
    try {
      const app = await this.getConfig<JuggleDV.AppConfig>(APPINFO_STORE, 'appId', appId, 'get');
      if (!app || app.id == null) {
        return undefined;
      }
      const canvas = await this.getConfig<JuggleDV.AppConfig['canvas']>(CANVAS_STORE, 'appId', appId, 'get');

      const compInsts = (await this.getConfig<JuggleDV.Comp[]>(COMP_STORE, 'appId', appId, 'getAll')).sort(
        (prev, next) => -1 * (next.createTime - prev.createTime)
      );
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

  upsertApp = async (config: JuggleDV.AppConfig) => {
    const db = await this.dbIns;
    const appInfo = omit(config, 'canvas');
    const canvas = {
      ...omit(config.canvas, 'compInsts'),
      appId: appInfo.id,
    };
    const tx = db.transaction([APPINFO_STORE, CANVAS_STORE, COMP_STORE], 'readwrite');
    await tx.objectStore(APPINFO_STORE).put(appInfo as JuggleDV.AppConfig);
    await tx.objectStore(CANVAS_STORE).put(canvas as JuggleDV.AppConfig['canvas']);
    const index = tx.objectStore(COMP_STORE).index('appId');
    let cursor = await index.openCursor(IDBKeyRange.only(appInfo.id as number));
    while (cursor) {
      await cursor.delete();
      cursor = await cursor.continue();
    }
    const comps = config.canvas.compInsts || [];
    for (let i = 0; i < comps.length; i += 1) {
      await tx.objectStore(COMP_STORE).put({
        ...comps[i],
        createTime: comps[i].createTime || i + 1,
        id: appInfo.id,
      });
    }
    await tx.done;
  };

  ensureDemoApps = async () => {
    const main = await this.getConfigByAPPID(DEMO_APP_ID);
    if (!main || main.id == null || Number(main.version) < DEMO_SEED_VERSION) {
      await this.upsertApp(demoAppConfig);
      localStorage.setItem(localStorageKey.CURRENT_APP_ID, String(DEMO_APP_ID));
    } else if (!localStorage.getItem(localStorageKey.CURRENT_APP_ID)) {
      localStorage.setItem(localStorageKey.CURRENT_APP_ID, String(DEMO_APP_ID));
    }
    const sandbox = await this.getConfigByAPPID(sandboxAppConfig.id as number);
    if (!sandbox || sandbox.id == null || Number(sandbox.version) < DEMO_SEED_VERSION) {
      await this.upsertApp(sandboxAppConfig);
    }
  };

  getDefaultConfig = async (): Promise<JuggleDV.AppConfig | undefined> => {
    if (isDemo) {
      await this.ensureDemoApps();
      const current = localStorage.getItem(localStorageKey.CURRENT_APP_ID);
      return this.getConfigByAPPID(current || DEMO_APP_ID);
    }
    const app = omit(AppConfig, 'canvas');
    const { canvas } = AppConfig;
    await this.initDB(AppConfig);
    return {
      ...app,
      canvas,
    };
  };
}

const dbInst = new DB();

export default dbInst;
