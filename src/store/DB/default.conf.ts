import { JuggleDV } from '@juggle-data-view/types';
const appId = Date.now();
const AppConfig: JuggleDV.AppConfig = {
  createTime: 0,
  createUser: '',
  id: appId,
  modifyTime: 0,
  modifyUser: '',
  name: '',
  userId: -1,
  datasources: {},
  canvas: {
    id: Date.now(),
    appId: appId,
    thumbnail: '',
    backgroundColor: '#cccccc',
    backgroundImg: '',
    width: 1920,
    height: 1080,
    zoomType: 0,
    compInsts: [],
  },
};

export default AppConfig;
