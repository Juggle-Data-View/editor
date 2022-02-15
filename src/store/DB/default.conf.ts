const appId = Date.now();
const AppConfig: AutoDV.AppConfig = {
  createTime: 0,
  createUser: '',
  id: appId,
  modifyTime: 0,
  modifyUser: '',
  name: '',
  spaceId: -1,
  type: 0,
  datasources: [],
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
