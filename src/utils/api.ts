/**
 * 业务请求 函数封装
 */

import * as API_URL from 'utils/api-url';
import request from 'utils/request';
import { getApp, getCanvas, qs, getParentURL } from 'utils';
import global, { fakeIFrameVars } from 'utils/global';
import { HttpMethod } from 'config/const';

const { release } = qs.query;
const RELEASE_CODE = typeof release === 'string' && release ? release : '';

/**
 * 加载应用配置项
 */
export const fetchAppConfig = (id: number) => {
  return request<AutoDV.AppConfig>({
    url: API_URL.APP_CONFIG,
    credentials: 'include',
    params: { app: id },
    headers: {
      'X-Referer': getParentURL(),
    },
  });
};

/**
 * 加载发布页面配置
 * @param releaseCode
 */
export const fetchReleaseAppConfig = (releaseCode: string) => {
  return request<AutoDV.AppConfig>({
    url: API_URL.RELEASE_APP_CONFIG,
    credentials: 'include',
    params: { release: releaseCode },
    headers: {
      'X-Referer': getParentURL(),
    },
  });
};

/**
 * 新建画布
 * @param payload 默认画布信息
 */
export const createCanvas = (payload: AutoDV.Canvas) => {
  return request<number>({
    url: API_URL.CANVAS,
    method: HttpMethod.POST,
    credentials: 'include',
    data: payload,
  });
};

/**
 * 修改画布信息
 * @param payload
 */
export const updateCanvas = (payload: UpdateCanvasPayload[]) => {
  const { id } = getCanvas();
  return request({
    url: `${API_URL.CANVAS}/${id}`,
    method: HttpMethod.PUT,
    credentials: 'include',
    useNProgress: true,
    data: payload,
  });
};

/**
 * 组件实例（CRUD）相关
 */
function fetchComp<T>(method: HttpMethod) {
  return (payload: CompInstReqData) => {
    return request<T>({
      url: API_URL.COMP,
      method,
      params: { canvas: global.canvasId },
      credentials: 'include',
      useNProgress: true,
      data: payload,
    });
  };
}

/**
 * 添加组件实例
 */
export const addComp = fetchComp<{ id: number; code: string }[]>(HttpMethod.POST);

/**
 * 组件实例信息修改
 */
export const updateComp = fetchComp(HttpMethod.PUT);

/**
 * 组件实例信息删除
 */
export const deleteComp = fetchComp(HttpMethod.DELETE);

/**
 * 排序组件实例.
 * 内部使用getStateFromStore，确保函数在action之后执行。
 * @param codes 组件实例code集合
 */
export const resortComp = (codes: string[]) => {
  const { id } = getCanvas();
  return request({
    url: API_URL.COMP_ORDER,
    method: HttpMethod.PUT,
    credentials: 'include',
    useNProgress: true,
    params: {
      canvas: id,
    },
    data: codes,
  });
};

/**
 * 获取上传文件的url
 * @param file file文件对象
 * @return 图片url
 */
export const fetchImgUrl = async (file: File) => {
  try {
    const fd = new FormData();
    fd.append('file', file);
    const data = await request<{ imgDomain: string; url: string }>({
      url: API_URL.UPLOAD,
      method: HttpMethod.POST,
      credentials: 'include',
      body: fd,
    });
    return data.imgDomain + data.url;
  } catch (error) {
    throw error;
  }
};

/**
 * 获取组件实例的静态数据
 * @param code 组件实例ID
 */
export const fetchCompInstStaticData = (code: string) => {
  const { id } = getCanvas();
  return request({
    url: API_URL.COMP_INST_STATIC_DATA,
    method: HttpMethod.GET,
    credentials: 'include',
    params: {
      canvas: id,
      code,
    },
  });
};

/**
 * 获取数据源 列表
 */

type DataSourceList = {
  pageNo: number;
  pageSize: number;
  totalCount: number;
  content: {
    id: number;
    spaceId: number;
    name: string;
    type: number;
    config: any;
    createUser: string;
    createTime: string;
    modifyUser: string;
    modifyTime: string;
  }[];
};

export const fetchDataSourceList = (dataSourceType: number) => {
  const app = getApp();
  return request<DataSourceList>({
    url: API_URL.DATA_SOURCE,
    method: HttpMethod.GET,
    credentials: 'include',
    params: {
      space: app.spaceId,
      pageSize: 10000,
      type: dataSourceType,
    },
  });
};

/**
 * 获取数据源 预览数据
 */
export const fetchDataSourceData = (
  code: string,
  dataSourceId: AutoDV.DataSourceId,
  payload: DataSourceDataReqData
) => {
  return request(
    {
      url: API_URL.DATA_SOURCE_PREVIEW,
      method: HttpMethod.POST,
      credentials: 'include',
      params: { id: dataSourceId },
      data: payload,
    },
    code
  );
};

/**
 * 获取数据源详情
 * 如果
 * @param dataSourceId
 */
type DataSourceDetail = {
  spaceId: number;
  name: string;
  type: AutoDV.DataSourceType;
  apiType?: 1 | 2;
  config: {
    method?: HttpMethod;
    params?: string[];
    jsonParam?: string;
  };
  createUser: string;
  createTime: string;
  modifyUser: string;
  modifyTime: string;
};

export const fetchDataSourceDetail = (dataSourceId: AutoDV.DataSourceId) => {
  return request<DataSourceDetail>({
    url: API_URL.DATA_SOURCE + `/${dataSourceId}`,
    credentials: 'include',
  });
};

/**
 * 新建数据源
 * @param payload 有三种状态
 */
export const createDataSource = (payload: any) => {
  const app = getApp();
  return request({
    url: API_URL.DATA_SOURCE,
    credentials: 'include',
    method: HttpMethod.POST,
    data: {
      spaceId: app.spaceId,
      ...payload,
    },
  });
};

/**
 * 获取组件实例数据（预览）
 */
export const fetchPreviewCompInstData = (
  params: {
    canvas: AutoDV.Canvas['id']; // canvasId
    code: string; // 组件实例code
  },
  dynamicParams: DataSourceParam[]
) => {
  return request(
    {
      url: API_URL.PREVIEW_DATA,
      method: HttpMethod.POST,
      credentials: 'include',
      params,
      data: dynamicParams,
      headers: {
        'X-Referer': getParentURL(),
      },
    },
    params.code
  );
};

/**
 * 获取组件实例数据（预览）
 */
export const fetchPreviewSubCompInstData = (
  params: {
    canvas: AutoDV.Canvas['id']; // canvasId
    code: string; // 父组件实例code
    childCompInstCode: string; //子组件code
  },
  dynamicParams: DataSourceParam[]
) => {
  return request(
    {
      url: API_URL.GET_SUBCOMP_DATA_IN_PREVIEW,
      method: HttpMethod.POST,
      credentials: 'include',
      params,
      data: dynamicParams,
      headers: {
        'X-Referer': getParentURL(),
      },
    },
    params.code + params.childCompInstCode
  );
};

/**
 * 获取组件实例数据（发布）
 */
export const fetchReleaseCompInstData = (
  params: {
    release: string; // 发布版本号
    compInstCode: string; // 组件实例code
    appId: AutoDV.AppID; // 资源隔离使用
  },
  dynamicParams: DataSourceParam[]
) => {
  return request(
    {
      url: API_URL.PREVIEW_DATA_RELEASE,
      method: HttpMethod.POST,
      credentials: 'include',
      params,
      data: dynamicParams,
      headers: {
        'X-Referer': getParentURL(),
      },
    },
    params.compInstCode
  );
};

/**
 * 获取组件实例子组件数据（发布）
 */
export const fetchReleaseSubCompInstData = (
  params: {
    release: string; // 发布版本号
    compInstCode: string; // 父组件实例code
    childCompInstCode: string; //子组件实例
  },
  dynamicParams: DataSourceParam[]
) => {
  return request(
    {
      url: API_URL.GET_SUBCOMP_DATA_IN_RELEASE,
      method: HttpMethod.POST,
      credentials: 'include',
      params,
      data: dynamicParams,
      headers: {
        'X-Referer': getParentURL(),
      },
    },
    params.compInstCode + params.childCompInstCode
  );
};

/**
 * 新建 代码片段
 */
interface IDataScriptPayload {
  spaceId: number;
  name: string;
  dataSourceId: AutoDV.DataSourceId;
  dataSourceType: AutoDV.DataSourceType;
  content: any;
}

export const createDataScript = (payload: IDataScriptPayload) => {
  return request({
    url: API_URL.DATA_SCRIPT,
    method: HttpMethod.POST,
    credentials: 'include',
    data: payload,
  });
};

/**
 * 编辑 代码片段
 */
export const updateDataScript = (scriptId: number, payload: IDataScriptPayload) => {
  return request({
    url: API_URL.DATA_SCRIPT + `/${scriptId}`,
    method: HttpMethod.PUT,
    credentials: 'include',
    data: payload,
  });
};

/**
 * 删除 代码片段
 */
export const deleteDataScript = (scriptId: number) => {
  return request({
    url: API_URL.DATA_SCRIPT + `/${scriptId}`,
    method: HttpMethod.DELETE,
    credentials: 'include',
  });
};

/**
 * 获取 代码片段 列表
 */
type DataScriptList = {
  pageNo: number;
  pageSize: number;
  totalCount: number;
  content: {
    id: number;
    spaceId: number;
    dataSourceId: AutoDV.DataSourceId;
    dataSourceName: string;
    dataSourceType: AutoDV.DataSourceType;
    name: string;
    content: string;
    paramNames: string[];
    createUser: string;
    createTime: string;
  }[];
};

export const fetchDataScriptList = (params: {
  dataSourceId: AutoDV.DataSourceId; // 数据源id
  name?: string; // 代码⽚片段名称 ⽀支持模糊搜索
  order?: string; // 排序字段 枚举:create_time|modify_time| 不不传默认按创建时间倒序
  sort?: string; // 排序⽅方式 枚举:asc|desc 默认 desc
  pageNo?: number; // 默认 1
  pageSize?: number; // 默认20
}) => {
  const app = getApp();
  return request<DataScriptList>({
    url: API_URL.DATA_SCRIPT,
    method: HttpMethod.GET,
    credentials: 'include',
    params: {
      space: app.spaceId,
      pageSize: 10000,
      ...params,
    },
  });
};

/**
 * 代码⽚片段语法检查
 */
export const checkDataScript = (payload: { dataSourceType: AutoDV.DataSourceType; content: string }) => {
  return request({
    url: API_URL.DATA_SCRIPT_CHECK,
    method: HttpMethod.POST,
    credentials: 'include',
    data: payload,
  });
};

/**
 * 上传 csv 接口
 * @param file
 */
type CSVRes = {
  data: unknown;
  downloadUrl: string;
  newFileName: string;
  originalFilename: string;
};
export const uploadCSV = (csv: File) => {
  const fd = new FormData();
  fd.append('file', csv);
  return request<CSVRes>({
    url: API_URL.UPLOAD_CSV,
    method: HttpMethod.POST,
    credentials: 'include',
    body: fd,
  });
};

/**
 * 上传 geo 接口
 * @param file
 */
type GeoRes = {
  data: unknown;
  downloadUrl: string;
  newFileName: string;
  originalFilename: string;
};
export const uploadGeo = (geo: Blob) => {
  const fd = new FormData();
  fd.append('file', geo);
  return request<GeoRes>({
    url: API_URL.FILE_UPLOAD,
    method: HttpMethod.POST,
    credentials: 'include',
    body: fd,
  });
};

/**
 * 读取 geo 接口
 * @param file
 */
export const ReadGeo = (path: string) => {
  return request<GeoRes>({
    url: path,
    method: HttpMethod.GET,
    credentials: 'include',
  });
};

/**
 * 校验数据源连通性
 */
export const checkDataSourceConnection = (payload: any) => {
  const app = getApp();
  return request({
    url: API_URL.DATA_SOURCE_CONNECTION,
    method: HttpMethod.POST,
    credentials: 'include',
    data: {
      spaceId: app.spaceId,
      ...payload,
    },
  });
};

/**
 * 发布页面权限校验
 * ⚠️ 接口参数有顺序要求，所以没有使用 params 对象传参。而是
 * 通过 location.search 的方式将参数拼接是 get 请求的 url 中
 */
export const checkReleaseAuthority = (params?: {
  /** 发布编号 */
  release?: string;
  /** 访问时间戳(依据⽤用户访问发布⼤大屏传⼊入的时间) */
  time?: number | string;
  /** token计算的签名 */
  signature?: string;
  /** 访问密码，优先级高于token */
  password?: string;
}) => {
  return request({
    url: API_URL.RELEASE_AUTHORITY + window.location.search,
    method: HttpMethod.GET,
    credentials: 'include',
    params,
  });
};

export const getMapData = (
  params: Partial<{
    adcode: number;
    type: string;
    level: 'province' | 'city' | 'district';
    name: string;
  }>
) => {
  return request({
    url: API_URL.GET_MAP_DATA,
    credentials: 'include',
    params,
  });
};

/**
 *服务端截图接口
 **/
export const coverImageOnServer = (
  params?: { width: number; height: number; url: string; quality: number },
  headers?: any
) => {
  return request({
    url: process.env.REACT_APP_COVER_IMAGE_API_BASE_URL + '/coverimage',
    method: HttpMethod.POST,
    params: params,
    headers: headers,
    credentials: 'include',
  });
};

/**
 *服务端截图接口 block
 **/
export const coverImageOnServerClick = (
  params?: { width: number; height: number; url: string; quality: number },
  headers?: any
) => {
  return request({
    url: process.env.REACT_APP_COVER_IMAGE_API_BASE_URL + '/coverimage/block',
    method: HttpMethod.POST,
    params: params,
    headers: headers,
    credentials: 'include',
  });
};

/**
 * 查询收藏夹分组信息
 */
export const getFavorites = () => {
  return request({
    url: API_URL.GET_FAVORITES,
    method: HttpMethod.GET,
    credentials: 'include',
  });
};

/**
 *添加组件到收藏夹分组
 * */
export const addFavoritesComToGroup = (params: {
  favoritesId: number;
  componentName: string;
  spaceId: number | null;
  components: string;
}) => {
  return request({
    url: API_URL.ADD_FAVORITES_COM_TO_GROUP,
    method: HttpMethod.POST,
    credentials: 'include',
    data: params,
  });
};

/**
 *单个/批量删除收藏夹分组内组件
 * */
export const deleteFavoritesComponent = (url: string) => {
  return request({
    url: API_URL.DELETE_FAVORITES_COMPONENT + url,
    method: HttpMethod.DELETE,
    credentials: 'include',
  });
};

/**
 *修改被收藏组件名称
 * */
export const modifyFavoritesComponent = (params: { favoritesId: number; id: number; componentName: string }) => {
  const fd = new FormData();
  fd.append('favoritesId', params.favoritesId.toString());
  fd.append('id', params.id.toString());
  fd.append('componentName', params.componentName);
  return request({
    url: API_URL.MODIFY_FAVORITES_COMPONENT,
    method: HttpMethod.PUT,
    credentials: 'include',
    body: fd,
  });
};

/**
 * 获取收藏组件
 * */
export const getFavoritesComponent = (url: string) => {
  return request({
    url: API_URL.GET_FAVORITES_COMPONENT + url,
    method: HttpMethod.GET,
    credentials: 'include',
  });
};

/**
 * 添加&更新阈值条件
 */
export const addAndUpdateLimitCondition = (option: {
  appId: number;
  canvasId: number;
  instCode: string;
  conditionCode: string;
  version?: number;
  status: number;
  intervalTime: number;
  timeUnit: 'min' | 'sec';
}) => {
  return request<{
    code: number;
    message: string;
  }>({
    url: API_URL.UPDATE_CREATE_LIMIT,
    method: HttpMethod.POST,
    credentials: 'include',
    data: option,
  });
};

/**
 * 添加通知用户接口
 */
export const addNotificationUsers = (option: {
  appId: number;
  canvasId: number;
  instCode: string;
  conditionCode: string;
  version?: number;
  users: [string];
}) => {
  return request<{ accountName: string; id: number; loginAccount: string }[]>({
    url: API_URL.ADD_NOTIFICATION_USER,
    method: HttpMethod.POST,
    credentials: 'include',
    data: option,
  });
};

/**
 * 获取通知用户接口
 */
export const getNotificationUserList = (option: {
  appId: number;
  canvasId: number;
  instCode: string;
  conditionCode: string;
  version?: number;
  pageNo?: number;
  pageSize?: number;
}) => {
  return request<{
    content: { accountName: string; id: number; loginAccount: string }[];
    pageNo: number;
    pageSize: number;
    totalCount: number;
  }>({
    url: API_URL.SELECT_NOTIFICATION_USER,
    method: HttpMethod.GET,
    credentials: 'include',
    params: option,
  });
};

/**
 * 删除通知用户接口
 */
export const deleteNotificationUsers = (option: {
  appId: number;
  canvasId: number;
  instCode: string;
  conditionCode: string;
  version?: number;
  warningUserIds: number[];
}) => {
  return request({
    url: API_URL.DELETE_NOTIFICATION_USER,
    method: HttpMethod.POST,
    credentials: 'include',
    data: option,
  });
};

/**
 * 触发预警通知
 */
export const triggerNotification = (option: {
  instCode: string;
  conditionCode: string;
  version?: number;
  columnId?: string;
  columnName?: string;
  rowId?: string;
  rowName?: string;
  conditionName: string;
  value: string | number;
}) => {
  if (!RELEASE_CODE) {
    return;
  }

  return request({
    url: API_URL.TRIGGER_LIMIT_NOTIFICATION,
    method: HttpMethod.POST,
    credentials: 'include',
    data: {
      ...option,
      release: RELEASE_CODE,
    },
  });
};

/**
 * 检查封版状态
 */
export const closeVersion = () => {
  return request<{
    cfgKey: string; // 配置项的key
    /** 0-正常 1-已经封版 */
    cfgValue: '0' | '1';
    createTime: string;
    createUser: string;
    /** 删除标示；0-正常，1-已经删除； */
    deleteFlag: 0 | 1;
    id: number;
    modifyTime: string;
    modifyUser: string;
    remark: string; // 备注
  }>({
    url: '/commonCfg/closeVersion',
    credentials: 'include',
  });
};

/**
 * 检查空间ID是否在白名单中
 */
export const checkInWhiteList = (fakeIFrameCode?: string) => {
  return request<{
    /** 0-不在白名单中；1-在白名单 */
    inWhiteListFlag: number;
  }>({
    url: '/whiteList/checkInWhiteList',
    credentials: 'include',
    params: {
      spaceId: fakeIFrameCode ? fakeIFrameVars.get(fakeIFrameCode) : global.spaceId, // 在编排系统还是内嵌iframe
    },
  });
};

export type TriggerTimeUnit = 'sec' | 'min';

export interface TriggerFormContent {
  appId: number;
  canvasId: number;
  instCode: string;
  compName: string;
  version: number;
  conditionCode: string;
  warningName: string;
  //1：咚咚 2：页面 3：咚咚+页面
  warningPattern: 1 | 2 | 3;
  //1：一次 -1：多次
  warningCount: -1 | 1;
  intervalTime: number;
  timeUnit: TriggerTimeUnit;
  erps: { name: string; value: string }[];
}

export interface TriggerListData extends TriggerFormContent {
  status: 0 | 1;
  id: number;
}

export const checkLoginStatus = () => {
  return request({ url: API_URL.CHECK_LOGIN_STATUS, method: HttpMethod.GET });
};

export const getTriggerList = (appId: number) => {
  return request<{ total: number; content: TriggerListData[] }>({
    url: API_URL.GET_TRIGGER_LIST,
    method: HttpMethod.GET,
  });
};

export const addNewTrigger = (option: TriggerFormContent) => {
  return request({
    url: API_URL.ADD_NEW_TRIGGER,
    method: HttpMethod.POST,
    data: option,
  });
};

export const updateTrigger = (option: TriggerFormContent) => {
  return request({
    url: API_URL.UPDATE_TRIGGER,
    method: HttpMethod.POST,
    data: option,
  });
};

/**
 *
 * @param id 组件不存在时传组件code用于批量物理删除，组件存在时传列表项id删除单条记录
 */
export const deleteTrigger = (id: number | string) => {
  return request({
    url: API_URL.DELETE_TRIGGER,
    method: HttpMethod.DELETE,
    params: { id },
  });
};
export const getErpList = (name: string) => {
  return request<{
    erp: string;
    name: string;
  }>({
    url: API_URL.GET_ERP_LIST,
    method: HttpMethod.GET,
    params: { name },
  });
};

export interface TriggeredParams {
  instCode: string;
  conditionCode: string;
  version?: number;
  columnId?: string;
  columnName?: string;
  rowId?: string;
  rowName?: string;
  conditionName: string;
  value: string | number;
  release: string;
  configType: number;
}

export const triggered = (option: TriggeredParams) => {
  return request({
    url: API_URL.TRIGGERED,
    method: HttpMethod.GET,
    data: option,
  });
};

export const checkJSFApi = (params: { interfaceName: string; alias: string; methodName: string }) => {
  return request({
    url: '/jsf/paramType',
    method: HttpMethod.GET,
    credentials: 'include',
    params,
  });
};

export const getEZDApiList = () => {
  return request({
    url: '/ezdDataSource/queryApiList',
    method: HttpMethod.GET,
    credentials: 'include',
  });
};
