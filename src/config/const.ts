/**
 * 常量配置
 */

import { JuggleDV } from '@juggle-data-view/types';
export enum DataSourceType {
  Static = 0,
  API = 1,
  MySQL = 2,
  CSV = 3,
  /** 数据源组 */
  DataSource = 4,
}

export enum ContentType {
  json = 'application/json',
  form = 'application/x-www-form-urlencoded; charset=UTF-8',
}

export enum HttpMethod {
  GET = 'GET',
  POST = 'POST',
  PUT = 'PUT',
  PATCH = 'PATCH',
  DELETE = 'DELETE',
}

export enum API_TYPE {
  HTTP = 1,
  JSF = 2,
}

// 缩放方式配置
export const ZOOM_TYPE: Record<JuggleDV.ZoomType, string> = {
  0: '原始比例',
  1: '等比宽度铺满',
  2: '等比高度铺满',
  3: '全屏铺满',
  4: '等比宽度铺满&垂直居中',
  5: '等比高度铺满&水平居中',
};

// 数据源配置
export const DataSourceAlias: Record<DataSourceType, string> = {
  0: '静态数据',
  1: 'API',
  2: 'MySQL',
  3: 'CSV文件',
  4: '数据源组',
};

/**
 * 交互配置类型
 *  - key 交互类型，使用下划线命名
 *  - value 交互类型中的中文描述
 */
export const triggerTypes = {
  url_request: '当接口请求时',
  global_url_params: '当页面加载时',
  search_input_click: '当点击按钮时',
  dropdown_change: '当下拉项变化时',
  carouselitem_change: '当轮播项激活状态变化时',
  date_time_change: '当时间发生变化时',
};

export type TriggerType = keyof typeof triggerTypes;

export const CANVAS_ID = 'autoDV-canvas'; // 画布dom的id

export const UNDO_RESTORE = 'UNDO_RESTORE';

export const DEFAULT_THUMBNAIL = 'https://findicons.com/files/icons/1579/devine/48/file.png';

/** 画布缩放最小值 */
export const MIN_CANVAS_RATIO = 0.1;

/** 画布缩放最大值 */
export const MAX_CANVAS_RATIO = 2;

export const COPY_KEY = '_JuggleDV_COPYCODE_|';
