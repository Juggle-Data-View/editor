/**
 * 封装 fetch 请求
 */
import NProgress from 'nprogress';
import queryString from 'query-string';
import history from 'helpers/history';
import 'abortcontroller-polyfill/dist/polyfill-patch-fetch'; // 兼容守护工具(chrome v61)
import { HttpMethod, ContentType } from 'config/const';
import { merge } from 'lodash';
import { AutoDV } from 'auto-dv-type';

export interface AutoDVErrorInfo {
  /** 请求状态码 */
  code: number;
  /** 错误信息 */
  message: string;
}

export interface AutoDVRes<T> {
  code: number;
  message: string;
  data?: T;
}

export interface UpdateCanvasPayload {
  key: keyof AutoDV.Canvas;
  value: unknown;
}

/**
 * ---------------------------------
 * 组件实例接口 相关
 * ---------------------------------
 */

export interface CompInstEditReqData {
  code: string;
  key: keyof AutoDV.Comp | 'staticData';
  value: any;
}

/** 增、删、改的集合 */
export type CompInstReqData = (AutoDV.Comp | string | CompInstEditReqData)[];

/**
 * ---------------------------------
 * 数据源
 * ---------------------------------
 */
export interface DataSourceParam {
  name: string;
  value: string;
}

/** 请求数据源数据的接口参数 */
export interface DataSourceDataReqData {
  scriptId?: string | number;
  specScript?: string;
  params?: DataSourceParam[];
}

export const baseURL = process.env.REACT_APP_API_BASE_URL;

// mock 地址，启动了 `yarn dev` 时才会生效
export const mockURL = 'http://localhost:9000';

console.log('process.env:', process.env);

interface ReqConfig extends RequestInit {
  /** 与 `url` 拼接成完整的请求地址 */
  baseURL?: string;
  /** `url` 是用于请求的服务器 URL */
  url: string;
  /**
   * `params` 是即将与请求一起发送的 URL 参数
   * 必须是一个无格式对象(plain object)或 URLSearchParams 对象
   */
  params?: Record<string, any>;
  /**
   * `data` 是作为请求主体被发送的数据
   * 只适用于这些请求方法 'PUT', 'POST', 和 'PATCH'
   */
  data?: Record<string, any>;
  /** 是否使用 `NProgress` */
  useNProgress?: boolean;
  /** 超时时间，单位：ms */
  timeout?: number;
}

/**
 * Determine if a value is a FormData
 */
function isFormData(val: any) {
  return typeof FormData !== 'undefined' && val instanceof FormData;
}

function isAbsoluteUrl(url: string) {
  return /^(https:|http:|\/\/)/i.test(url);
}

const asyncAbort = (controller: AbortController, timeOut: number): Promise<Response> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(new Response('timeout', { status: 504, statusText: 'timeout' }) as any);
      controller.abort();
    }, timeOut);
  });
};

const wrapConfig = (config: ReqConfig) => {
  return config.method === HttpMethod.GET
    ? config
    : {
        method: HttpMethod.POST,
        body: JSON.stringify(config.data), // must match 'Content-Type' header
        ...config,
      };
};

const requestMap: Record<string, AbortController> = {};

/**
 * 封装 fetch 请求
 * @param config 配置项，类型继承自 `fetch`
 * @param id 请求的唯一标识，同一个标识的请求只允许存在一个
 */
export async function request<T>(config: ReqConfig, id?: string): Promise<T> {
  // 每次发起请求前重置 id 对应的请求，使请求总是唯一
  if (id && requestMap[id]) {
    requestMap[id].abort();
    delete requestMap[id];
  }

  const controller = new AbortController();

  if (id) {
    requestMap[id] = controller;
  }

  const defaultConfig: Omit<ReqConfig, 'url'> = {
    baseURL,
    method: HttpMethod.GET,
    signal: controller.signal,
    headers: {
      'Content-Type': ContentType.json,
    },
  };

  const _config = merge({}, defaultConfig, config);
  const timeOut = _config.timeout || 30000;

  _config.useNProgress && NProgress.start();

  try {
    const absoluteURL = isAbsoluteUrl(_config.url) ? _config.url : _config.baseURL + _config.url;

    const url: string = _config.params
      ? queryString.stringifyUrl({
          url: absoluteURL,
          query: _config.params,
        })
      : absoluteURL;

    _config.headers = new Headers(_config.headers);
    const contentType = _config.headers.get('Content-Type');

    /**
     * `FormData`与`headers`的坑：
     * 参考：https://zhuanlan.zhihu.com/p/34291688
     * 参考：https://stackoverflow.com/questions/17415084/multipart-data-post-using-python-requests-no-multipart-boundary-was-found/17438575
     */
    if (isFormData(_config.body)) {
      delete _config.headers;
    }

    // 带有 timeout 的 fetch 请求
    const _fetch = (config: ReqConfig) => {
      return Promise.race([asyncAbort(controller, timeOut), fetch(url, config)]);
    };

    const res = await _fetch(wrapConfig(_config));

    if (!res.ok) {
      // 请求失败，返回解析之后的失败的数据
      return Promise.reject({
        code: res.status,
        message: res.statusText,
      });
    }

    // ========== ↓ res ok ↓ ========== //

    let result = null;

    // 判定返回的内容类型，做不同的处理
    if (contentType) {
      if (contentType.indexOf('json') > -1) {
        result = await res.json();
      }
      if (contentType.indexOf('text') > -1) {
        result = await res.text();
      }
      if (contentType.indexOf('form') > -1) {
        result = await res.formData();
      }
      if (contentType.indexOf('video') > -1) {
        result = await res.blob();
      }
    } else {
      result = await res.text();
    }

    switch (result.code) {
      case 200:
        return result.data;
      case 401:
        // 未登录
        const returnURL = window.location.href;
        window.location.href = `${process.env.REACT_APP_LOGIN}?ReturnUrl=${returnURL}`;
        break;
      case 402:
        console.warn('接口未授权：', url);
        // 未授权
        history.push('./authoriz');
        break;
      default:
        return Promise.reject({
          code: result.code,
          message: result.message,
        });
    }
    return result.data;
  } catch (error) {
    throw error;
  } finally {
    _config.useNProgress && NProgress.done();
  }
}

export default request;
