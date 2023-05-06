import QS from 'query-string';
import store from '@store/index';
import numeral from 'numeral';
import { nanoid as _nanoid } from '@reduxjs/toolkit';
import { JuggleDV } from '@juggle-data-view/types';
import DB from '@store/DB';
import fetchAppConfig, { getAppID, localStorageKey, setAppID } from '@helpers/fetchAppConfig';
import app from '@store/DB/appConfig';
import { User } from 'parse';
import { omit } from 'lodash';
import AppConfig from '@store/DB/default.conf';

export { getAppID, localStorageKey } from '@helpers/fetchAppConfig';

export const qs = QS.parseUrl(window.location.href);

export const qsDynamic = (url: string) => QS.parseUrl(url);

const { REACT_APP_JuggleDV_ENV } = process.env;

// dev/test 环境
export const isDev = REACT_APP_JuggleDV_ENV === 'development';

// 预发环境
export const isPre = REACT_APP_JuggleDV_ENV === 'prerelease';

// 线上环境
export const isRelease = REACT_APP_JuggleDV_ENV === 'production';

export const nanoid = _nanoid;

export const nanocode = (prefix: string) => [prefix, nanoid(6)].join('_');

/**
 * 从store中获取app state
 * 一般用于异步操作，如：点击某个按钮时需要获取数据
 */
export const getJuggleDV = () => store.getState().autoDV.present;

export const getApp = () => store.getState().autoDV.present.app;

export const getCanvas = () => store.getState().autoDV.present.canvas;

export const getOriginDatas = () => store.getState().data.originDatas;

/**
 * 异步加载图片
 * @param {string}   url         图片地址
 * @param {boolean}  is_cors     是否对此元素的CORS请求设置凭据标志
 * @return {imageObject}        img对象
 */
export const loadImage = (url: string, is_cors = true): Promise<HTMLImageElement> => {
  return new Promise((resolve, reject) => {
    const img: HTMLImageElement = new Image();
    if (is_cors) {
      img.crossOrigin = 'Anonymous';
    }
    img.onload = () => {
      resolve(img);
    };

    img.onerror = () => {
      reject(new Error('That image was not found.:' + url.length));
    };
    img.src = url;
  });
};

/**
 * 转换数字为 千分位 或 含小数点 的字符串.
 * 默认都转换。
 */
export const num2ThousandOrDecimal = (num: number, isThousand = true, isDecimal = true) => {
  let formater = '';
  const str = isThousand.toString() + ',' + isDecimal.toString();
  switch (str) {
    case 'true,true':
      formater = '0,0.[00]';
      break;
    case 'true,false':
      formater = '0,0';
      break;
    case 'false,false':
      formater = '00';
      break;
    case 'false,true':
      formater = '0.[00]';
      break;
    default:
      formater = '0.[00]';
  }
  return numeral(num).format(formater);
};

export const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * 将渐变色组件的值转换为 background
 * @param gradient 渐变色组件向外输出的值
 */
export const getGradientCSS = (color: string | JuggleDV.ColorResult): string => {
  if (typeof color === 'string') {
    return color;
  }
  const { type, colorStops, angle } = color;
  if (!colorStops.length) {
    return 'none';
  }
  const steps = colorStops.map(({ color, offset }) => `${color} ${offset * 100 + '%'}`).join(',');
  switch (type) {
    case 'linear':
      return `linear-gradient(${angle}deg, ${steps})`;
    case 'radial':
      return `radial-gradient(circle at center,${steps})`;
    default:
      console.error('gradient css type error');
      return 'none';
  }
};

/**
 * 角度转矩阵
 * @param angle 旋转角度
 *
 * vectorAngle = 360 - angle 顺时针
 *
 * cell = 1
 *
 * A = [
 *  [sin(vectorAngle),cos(vectorAngle)]
 *  [-sin(vectorAngle),-cos(vectorAngle)]
 * ]
 *
 * B = [
 *  [1,1]
 *  [1,1]
 * ]
 *
 * K = cell / 2;
 *
 * @returns (A+B)·K
 */
export const Angle2Matrix = (angle: number): { x: number; y: number; x2: number; y2: number } => {
  const radin = ((360 - angle) * Math.PI) / 180; //顺时针方向
  const xComponent = Math.sin(radin);
  const yComponent = Math.cos(radin);
  const xSComponent = -xComponent;
  const ySComponent = -yComponent;
  const cellMatrix = [
    [0.5 * (1 + xComponent), 0.5 * (1 + yComponent)],
    [0.5 * (1 + xSComponent), 0.5 * (1 + ySComponent)],
  ]; // 单位矩阵 * 0.5
  return {
    x: cellMatrix[0][0],
    y: cellMatrix[0][1],
    x2: cellMatrix[1][0],
    y2: cellMatrix[1][1],
  };
};

/**
 * 获取预览页面链接的状态，用来区分打开的是预览界面还是发布界面
 * 目前状态： preview | release
 */
export const getViewStatus = (url?: string) => {
  const { release } = url ? qsDynamic(url).query : qs.query;
  const isRelease = typeof release === 'string' ? true : false;
  return {
    isPreview: !isRelease,
    isRelease,
  };
};

export const loadScript = (url: string, callback: () => void) => {
  const script = document.createElement('script');
  script.type = 'text/javascript';
  script.src = url;
  document.body.appendChild(script);
  script.onload = function () {
    callback();
  };
  script.onerror = (err: any) => {
    throw new Error(err.message || '加载javascript文件失败');
  };
};
/**
 * 获取组件的json map
 * @param dataConfig 组件数据
 */
export const getJsonMap = (dataConfig: JuggleDV.CompDataConfig): JuggleDV.JsonMap => {
  if (!dataConfig) {
    return { auxFieldMap: [], sourceCode: '' };
  }
  const { jsonMap } = dataConfig;
  if (!jsonMap) {
    return { auxFieldMap: [], sourceCode: '' };
  }
  return jsonMap;
};

export const getParentURL = () => {
  let url = '';
  if (window.parent !== window) {
    try {
      url = window.parent.location.href;
    } catch (error) {
      url = document.referrer;
    }
  }
  return url;
};

export const getConfigFromServer = async () => {
  if (!window.navigator.onLine) {
    throw new Error('network error: user is offline');
  }
  try {
    const data = await fetchAppConfig();

    const version = await app.getAppConfigVersion();

    localStorage.setItem(localStorageKey.REMOTE_VERSION, data.version);
    if (version && Number(version) > Number(data.version)) {
      throw new Error('should use local config');
    }

    return { ...data, id: data.objectId || data.id };
  } catch (error) {
    throw new Error('get app has error from server side');
  }
};

const getDefaultConfig =  (id: string ): Promise< JuggleDV.AppConfig| undefined> => {
    const app = omit({...AppConfig,id}, 'canvas');
    const { canvas } = AppConfig;
    return {
      ...app,
      canvas,
    } as any;
  };

export const getConfigFromIndexedDB = async (
  id?: string
): Promise<JuggleDV.AppConfig | undefined> => {
  const defaultAppID = Date.now() + '';
  try {
    const appId = getAppID() || id;
    if (!appId) {
      const user = User.current();
      
      !user && setAppID(+'');
      const defaultConfig = getDefaultConfig(defaultAppID);
      await DB.initDB(AppConfig);
      return defaultConfig;
    }
    
    return DB.getConfigByAPPID(appId);
  } catch (error) {
    error instanceof Error && console.log(error.message);
    return getDefaultConfig(defaultAppID);
  }
};
