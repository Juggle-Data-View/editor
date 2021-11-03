/**
 * 获取可视化组件的服务端数据
 */

import * as Api from 'utils/api';
import { getViewStatus, qs } from 'utils/index';
import global from 'utils/global';

// 替换动态参数的变量名称为真实值

/**
 * 在编排系统中获取数据
 */
export const fetchDataInEditor = async (code: string, dataConfig: AutoDV.DataConfig) => {
  try {
    const { dataSourceType, dataSourceId, scriptId, specScript } = dataConfig;
    if (dataSourceType === 0) {
      // 静态数据类型时，直接从mockData中拿数据
      return dataConfig.mockData;
    }
    if (!dataSourceId) {
      return [];
    }
    const params: any[] = [{}];
    const payload: DataSourceDataReqData = {};
    if (params.length) {
      payload.params = params;
    }
    // MySQL
    if (dataSourceType === 2) {
      if (!scriptId && !specScript) {
        return [];
      }
      // scriptId 与 specScript 二选一。同时存在时，优先 scriptId
      if (scriptId) {
        payload.scriptId = scriptId;
      } else {
        if (specScript) {
          payload.specScript = specScript;
        }
      }
    }
    return await Api.fetchDataSourceData(code, dataSourceId, payload);
  } catch (error) {
    throw error;
  }
};

/**
 * 获取 预览/发布 界面的组件数据
 * @param code 组件实例code
 * @param dynamicParams 动态参数
 * @param layerCode {可选} 当有子图层code时，请求子图层接口。
 */
export const fetchDataInView = (code: string, dynamicParams: AutoDV.DataParam[], layerCode?: string) => {
  const { isRelease } = getViewStatus();
  // 发布界面
  if (isRelease) {
    if (layerCode) {
      return Api.fetchReleaseSubCompInstData(
        {
          compInstCode: code,
          childCompInstCode: layerCode,
          release: qs.query.release as string,
        },
        dynamicParams
      );
    }
    return Api.fetchReleaseCompInstData(
      {
        compInstCode: code,
        appId: global.appId,
        release: qs.query.release as string,
      },
      dynamicParams
    );
  }
  // 预览界面
  if (layerCode) {
    return Api.fetchPreviewSubCompInstData(
      {
        canvas: global.canvasId,
        code,
        childCompInstCode: layerCode,
      },
      dynamicParams
    );
  }
  return Api.fetchPreviewCompInstData(
    {
      code,
      canvas: global.canvasId,
    },
    dynamicParams
  );
};
