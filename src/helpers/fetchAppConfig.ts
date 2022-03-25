import { qs, getViewStatus, qsDynamic } from 'utils/index';
import * as Api from 'utils/api';
import global, { fakeIFrameVars } from 'utils/global';
import { AutoDV } from 'auto-dv-type';

// 请求页面配置
const fetchAppConfig = async (url?: string) => {
  try {
    const { isRelease } = getViewStatus(url);
    // 判断是在编排系统还是内嵌iframe

    const { id, release } = url ? qsDynamic(url).query : qs.query;

    let appConfig: any;

    if (isRelease) {
      appConfig = await Api.fetchReleaseAppConfig(release as string);
    } else {
      const appId = Number(id);

      if (typeof appId !== 'number' || isNaN(appId)) {
        throw new Error('错误的大屏ID');
      }
      // 编排系统
      appConfig = await Api.fetchAppConfig(appId);
    }

    if (!appConfig) {
      throw new Error('加载页面配置失败！');
    }

    // 第一次创建的大屏页面时是没有画布信息的，需要初始化画布
    if (!isRelease && !appConfig.canvas) {
      const canvas: AutoDV.Canvas = {
        id: null,
        appId: appConfig.id,
        backgroundColor: '#0D2A41',
        backgroundImg: '',
        width: 1920,
        height: 1080,
        thumbnail: '',
        zoomType: 0,
      };
      const canvasId = await Api.createCanvas(canvas);
      canvas.id = canvasId;
      appConfig.canvas = canvas;
    }

    if (!appConfig.canvas) throw new Error('加载画布失败：未找到画布信息');
    if (!appConfig.canvas.id) throw new Error('获取canvasId失败');

    if (!url) {
      document.title = appConfig.name;

      // 存储全局状态，方便后续使用
      global.appId = appConfig.id;
      global.canvasId = appConfig.canvas.id;
      global.spaceId = appConfig.spaceId;
      global.wssType = appConfig.type;
    }

    // 在iframe内加载
    if (url) {
      fakeIFrameVars.set(`${appConfig.name}`, {
        appId: appConfig.id,
        canvasId: appConfig.canvas.id,
        spaceId: appConfig.spaceId,
      });
    }

    return appConfig;
  } catch (error) {
    throw error;
  }
};

export default fetchAppConfig;
