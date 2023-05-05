import { JuggleDV } from '@juggle-data-view/types';
const appId = Date.now();

export const AppInfo = {
  createTime: 0,
  createUser: '',
  id: appId,
  modifyTime: 0,
  modifyUser: '',
  name: '',
  userId: -1,
  datasources: {},
}

export const initCanvas:JuggleDV.Canvas = {
  id: Date.now(),
  appId: appId,
  thumbnail: '',
  backgroundColor: '#cccccc',
  backgroundImg: '',
  width: 1920,
  height: 1080,
  zoomType: 0,
}

const AppConfig: JuggleDV.AppConfig = {
  version: 0,
  ...AppInfo,
  canvas: {
    ...initCanvas,
    compInsts: [],
  },
};

export default AppConfig;
