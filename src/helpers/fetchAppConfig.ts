import { queryAppByID } from '@service/apps';
import { User } from 'parse';


export const localStorageKey = {
  CURRENT_APP_ID: 'currentAPPID',
  REMOTE_VERSION: 'REMOTE_VERSION',
};

export const setCacheAppID = (id: string | number) => {
  const userID = User.current()?.id;
  localStorage.setItem((userID?userID:'')+'_'+localStorageKey.CURRENT_APP_ID,  id + '');
}

export const getCachedAppID = () => {
  const userID = User.current()?.id;
  const appId = localStorage.getItem((userID?userID:'')+'_'+localStorageKey.CURRENT_APP_ID);
  if (!appId) return '';
  return isNaN(Number(appId)) ? appId : Number(appId);
}

export const setAppID = (id: string | number | null) =>{
  const pageURl = new URL(window.location.href);
  if (!id) {
    const id =  Date.now() 
    pageURl.searchParams.set('app_id',id + '');
  }else{
    pageURl.searchParams.set('app_id', id + '');
  }
  window.history.replaceState({}, '', pageURl.href);
}

export const getAppID = () => {
  const pageURl = new URL(window.location.href);
  const appId = pageURl.searchParams.get('app_id');
  return appId as string;
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
