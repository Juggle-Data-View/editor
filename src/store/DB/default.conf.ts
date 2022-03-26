import { AutoDV } from 'auto-dv-type';
const appId = Date.now();
const AppConfig: AutoDV.AppConfig = {
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
