/**
 * 全局变量、常量.
 */

interface GlobalVarsType {
  canvasId: AutoDV.Canvas['id'];
  appId: AutoDV.AppID;
  spaceId: AutoDV.SpaceID;
  zoomStyle: any;
  wssType: AutoDV.AppConfig['type'];
  io: SocketIOClient.Socket | null;
}

const global: GlobalVarsType = {
  canvasId: null,
  appId: null,
  spaceId: null,
  zoomStyle: {},
  wssType: undefined, // webSocket 类型 为1时表示 实验室大屏
  io: null,
};

export default global;

// 这里设置一个全局的map，用了存储全局的fakeIFrame变量，主要用来验证封板后,检查空间ID是否在白名单中
export const fakeIFrameVars = new Map();
