/**
 * 创建数据源逻辑相关的类型、初始数据声明
 */
import { DataSourceType, HttpMethod, API_TYPE } from 'config/const';
import { pickBy } from 'lodash';
import { FormikProps } from 'formik';
import { createNextState as produce } from '@reduxjs/toolkit';

type Header = Array<{ k: string; v: string }>;

export enum PasswordType {
  Public,
  Private,
}

export enum IsEzdActiveTask {
  No,
  Yes,
}

type API_Values = {
  type: DataSourceType.API;
  /** API类型 枚举 1-http 2-jsf */
  apiType: API_TYPE;
  name: string;
  config: {
    method: HttpMethod;
    url: string;
    header: Header;
    transmitCookie: boolean;
    // GET
    params: string[];
    // POST & JSF
    jsonParam: string;
    // JSF
    interfaceName: string;
    alias: string;
    methodName: string;
    paramsType: string[]; //参数类型列表  String[]  该参数从 【5.1 查参数类型paramType】接口中获取
  };
};

type SQL_Values = {
  type: DataSourceType.MySQL;
  name: string;
  config: {
    host: string;
    port: number;
    user: string;
    password: string;
    database: string;
    connectionParams: {
      characterEncoding: 'UTF-8';
      zeroDateTimeBehavior: string;
    };
    passwordType: PasswordType;
  };
};

type CSV_Values = {
  type: DataSourceType.CSV;
  name: string;
  config: {
    path: string;
    header: string[];
  };
};

type EZD_Values = {
  type: DataSourceType.EZD;
  name: string;
  apiType: API_TYPE;
  /** 是否为ezd主动缓存api 枚举 0-否，1-是  */
  isEzdActiveTask: IsEzdActiveTask;
  config: {
    method: HttpMethod;
    apiName: string;
    apiGroupName: string;
    transmitCookie: boolean;
    header: Header;
    // GET
    params: string[];
    // POST & JSF
    jsonParam: string;
    // JSF
    alias: string;
  };
};

type ExtendValues = {
  useHeader?: boolean;
};

export type Values = (API_Values | SQL_Values | CSV_Values | EZD_Values) & ExtendValues;

// 获取部分 数据源 类型
export type LocalDataSourceType = Extract<
  AutoDV.DataSourceType,
  DataSourceType.API | DataSourceType.MySQL | DataSourceType.CSV | DataSourceType.EZD
>;

export type API_Formik = FormikProps<API_Values & ExtendValues>;
export type SQL_Formik = FormikProps<SQL_Values & ExtendValues>;
export type EZD_Formik = FormikProps<EZD_Values & ExtendValues>;

/**
 * -------------------------
 * 初始数据
 * -------------------------
 */

export const init_api_get_config = {
  method: HttpMethod.GET,
  url: '',
  params: [],
  header: [{ k: '', v: '' }],
  transmitCookie: false,
};

export const init_api_post_config = {
  method: HttpMethod.POST,
  url: '',
  jsonParam: '',
  transmitCookie: false,
  header: [{ k: '', v: '' }],
};

export const init_api_jsf_config = {
  interfaceName: '',
  alias: '',
  methodName: '',
  paramsType: [],
  jsonParam: '',
};

export const init_ezd_get_config = {
  method: HttpMethod.GET,
  params: [],
  apiName: '',
  apiGroupName: '',
  transmitCookie: false,
  header: [{ k: 'fds-app-token', v: '' }],
};

export const init_ezd_post_config = {
  method: HttpMethod.POST,
  jsonParam: '',
  apiName: '',
  apiGroupName: '',
  transmitCookie: false,
};

export const init_ezd_jsf_config = {
  alias: '',
  jsonParam: '',
};

export const initValues: Record<LocalDataSourceType, Values> = {
  1: {
    type: DataSourceType.API,
    name: '',
    apiType: API_TYPE.HTTP,
    config: {
      ...init_api_post_config,
      ...init_api_get_config,
      ...init_api_jsf_config,
    },
  },
  2: {
    type: DataSourceType.MySQL,
    name: '',
    config: {
      host: '',
      port: null as any,
      database: '',
      user: '',
      password: '',
      connectionParams: {
        characterEncoding: 'UTF-8',
        zeroDateTimeBehavior: 'convertToNull',
      },
      passwordType: 0,
    },
  },
  3: {
    type: DataSourceType.CSV,
    name: '',
    config: {
      path: '', // http://jd.com/pan/abc.csv
      header: [], // ['a', 'b', 'c']
    },
  },
  5: {
    type: DataSourceType.EZD,
    name: '',
    apiType: 1,
    isEzdActiveTask: 0,
    config: {
      ...init_ezd_post_config,
      ...init_ezd_get_config,
      ...init_ezd_jsf_config,
    },
  },
};

const defaultConfig: any = {
  [DataSourceType.API]: {
    [API_TYPE.HTTP]: {
      [HttpMethod.GET]: init_api_get_config,
      [HttpMethod.POST]: init_api_post_config,
    },
    [API_TYPE.JSF]: init_api_jsf_config,
  },
  [DataSourceType.EZD]: {
    [API_TYPE.HTTP]: {
      [HttpMethod.GET]: init_ezd_get_config,
      [HttpMethod.POST]: init_ezd_post_config,
    },
    [API_TYPE.JSF]: init_ezd_jsf_config,
  },
};

export const getConfig = (values: API_Values | EZD_Values) => {
  const config = defaultConfig[values.type];
  if (values.apiType === API_TYPE.HTTP) {
    const { method } = values.config;
    return config[API_TYPE.HTTP][method];
  }
  return config[API_TYPE.JSF];
};

/**
 * array to object
 * @param arr [{k:'a',v:1},{k:'b',v:2}]
 * @return {object} {a:1,b:2}
 */
const a2o = (arr: Header) => {
  return arr.reduce((acc, cur) => {
    if (!cur.k) return acc; // 必须填key，否则直接返回
    acc[cur.k] = cur.v;
    return acc;
  }, {} as Record<string, string>);
};

export const filterValues = (values: Values) => {
  const _config: any = pickBy(values.config, (v, k) => {
    let init_config: any = values.config;
    if (values.type === DataSourceType.API) {
      init_config = getConfig(values);
    }
    if (values.type === DataSourceType.EZD) {
      init_config = getConfig(values);
    }
    return typeof init_config[k] !== 'undefined';
  });

  // header 在表单中是以数组对象{k, v}的形式存在，服务端接收的需要是对象
  if (Array.isArray(_config.header)) {
    _config.header = values.useHeader ? a2o(_config.header) : {};
  }

  return produce(values, (draft) => {
    draft.config = _config;
    delete draft.useHeader; // 剔除扩展的属性
  });
};

export type EZD_API_DATA = {
  data: {
    svcNameCN: string;
    methodType: string;
    methodName: string; //apiName api名称
    isOnline: number;
    svcName: string; //apiGroupName分组名
    isActive: boolean; //主动缓存标志位
    ttl: number;
    tenant: string; //alias 别名
  };
  canDelete: boolean;
  isAdmin: boolean;
  title: string;
  isLeaf: boolean;
  key: string;
};

export type EZD_API_LIST = Array<{
  children: Array<EZD_API_DATA>;
  canDelete: boolean;
  isAdmin: boolean;
  title: string;
  isLeaf: boolean;
  key: string;
}>;
