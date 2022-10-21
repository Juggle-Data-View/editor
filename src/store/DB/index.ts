import components from './components';
import { JuggleDV } from '@juggle-data-view/types';
import { omit } from 'lodash';
import Database, { APPINFO_STORE, CANVAS_STORE, COMP_STORE } from './databaseInit';
import AppConfig from './default.conf';
import { localStorageKey } from '@helpers/fetchAppConfig';

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

  getDefaultConfig = async (): Promise<JuggleDV.AppConfig | undefined> => {
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
