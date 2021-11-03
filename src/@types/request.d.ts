/**
 * 接口请求相关的类型声明
 * TODO: 完善接口类型定义
 */

interface AutoDVErrorInfo {
  /** 请求状态码 */
  code: number;
  /** 错误信息 */
  message: string;
}

interface AutoDVRes<T> {
  code: number;
  message: string;
  data?: T;
}

interface UpdateCanvasPayload {
  key: keyof AutoDV.Canvas;
  value: unknown;
}

/**
 * ---------------------------------
 * 组件实例接口 相关
 * ---------------------------------
 */

interface CompInstEditReqData {
  code: string;
  key: keyof AutoDV.Comp | 'staticData';
  value: any;
}

/** 增、删、改的集合 */
type CompInstReqData = (AutoDV.Comp | string | CompInstEditReqData)[];

/**
 * ---------------------------------
 * 数据源
 * ---------------------------------
 */
interface DataSourceParam {
  name: string;
  value: string;
}

/** 请求数据源数据的接口参数 */
interface DataSourceDataReqData {
  scriptId?: AutoDV.DataConfig['scriptId'];
  specScript?: string;
  params?: DataSourceParam[];
}
