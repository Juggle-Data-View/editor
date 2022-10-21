import { queryAppByID } from '@service/apps';
export const localStorageKey = {
  CURRENT_APP_ID: 'currentAPPID',
  REMOTE_VERSION: 'REMOTE_VERSION',
};

export const getAppID = () => {
  const appId = localStorage.getItem(localStorageKey.CURRENT_APP_ID);
  if (!appId) return '';
  return isNaN(Number(appId)) ? appId : Number(appId);
};

// 请求页面配置
const fetchAppConfig = async () => {
  try {
    const appId = getAppID() + '';
    if (!appId) {
      throw new Error('get empty app ');
    }
    const data = await queryAppByID(appId);
    if (!data) {
      throw new Error('get empty app ');
    }
    return data.toJSON() as any;
  } catch (error) {
    throw error;
  }
};

export default fetchAppConfig;
