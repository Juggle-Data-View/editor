/**
 * API URL 映射
 * TODO: 需要干掉，有点多余了。与 api.tsx 合并。
 */

/**
 * 组件菜单地址
 * Request URL: //{domain}/loadcomponent/list
 * Request Method: GET
 */
export const MENU = '/loadcomponent/list';

/**
 * 加载⻚⾯配置
 * Request URL: //{domain}/admin/appcfg?app={appId}
 * Request Method: GET
 */
export const APP_CONFIG = '/admin/appcfg';

/**
 * 画布
 * 修改画布
 *  Request URL: //{domain}/admin/appcfg/canvas/{canvasId}
 *  Request Method: PUT
 * 新建画布
 *  Request URL: //{domain}/admin/appcfg/canvas
 *  Request Method: POST
 *  Request Body: {object} canvasInfo
 *  Response Body: canvasId
 */
export const CANVAS = '/admin/appcfg/canvas';

/**
 * 组件实例相关
 * Request URL: //{domain}/admin/appcfg/compInst?canvas={canvasId}
 * Request Method:
 *  - POST 添加组件实例
 *  - DELETE 删除组件实例
 *  - PUT 修改组件实例信息
 */
export const COMP = '/admin/appcfg/compInst';

/**
 * 组件实例排序
 * Request URL: //{domain}/admin/appcfg/compInst/order?canvas={canvasId}
 * Request Method: PUT
 */
export const COMP_ORDER = '/admin/appcfg/compInst/order';

/**
 * 文件上传
 * Request URL: //{domain}/file/upload
 * Request Method: POST
 * Request Data: FormData
 */
export const UPLOAD = '/file/upload';

/**
 * 数据源
 * Request Method:
 *  - GET 数据源列表  URL: //admin/data/source/?space={spaceId}
 *  - GET 数据源详情  URL: //admin/data/source/{dataSourceId}
 *  - POST 新建数据源
 */
export const DATA_SOURCE = '/admin/data/source';

/**
 * 预览数据源（编排系统中使用）
 * Request URL: //{domain}/admin/data/source/preview?id={dataSourceId}
 * Request Method: POST
 */
export const DATA_SOURCE_PREVIEW = '/admin/data/source/preview';

/**
 * 预览数据源 by compInsCode
 * 区别于 DATA_SOURCE_PREVIEW, 使用 compInsCode 获取数据时没有登录验证操作，任何人都可以看到数据
 * Request URL: //{domain}/admin/appcfg/compInst/data?canvas={canvasId}&code={compInstCode}
 * Request Method: GET
 */
export const PREVIEW_DATA = '/admin/appcfg/compInst/data';

/**
 * 组件实例静态数据
 * Request URL: //{domain}/admin/appcfg/compInst/staticData?canvas={canvasId}&code={compInstCode}
 * Request Method: GET
 */
export const COMP_INST_STATIC_DATA = '/admin/appcfg/compInst/staticData';

/**
 * 访问大屏-获取发布大屏配置信息
 * Request URL: //{view.domain}/view/config?release={releaseCode}
 * Request Method: GET
 */
export const RELEASE_APP_CONFIG = '/view/config';

/**
 * 访问大屏-获取组件实例展示数据
 * Request URL: //{view.domain}/view/data?release={releaseCode}&compInstCode={compInstCode}
 */
export const PREVIEW_DATA_RELEASE = '/view/data';

/**
 * 代码片段
 * Request URL: //{domain}/admin/data/script
 * Request Method:
 *  - POST 新建代码片段
 *  - PUT 修改代码片段 //{domain}/admin/data/script/{scriptId}
 *  - DELETE 删除代码片段 //{domain}/admin/data/script/{scriptId}
 *  - GET 查询代码片段列表
 */
export const DATA_SCRIPT = '/admin/data/script/';

/**
 * 代码⽚片段语法检查
 * Request URL: //{domain}/admin/data/script/check
 * Request Method: POST
 */
export const DATA_SCRIPT_CHECK = '/admin/data/script/check';

/**
 * CSV⽂文件上传
 * Request URL: //{domain}/file/upload/csv
 * Request Method: POST
 */
export const UPLOAD_CSV = '/file/upload/csv';

/**
 * 校验数据源链接
 * Request URL: //{domain}/admin/data/source/connection
 * Request Method: POST
 */
export const DATA_SOURCE_CONNECTION = '/admin/data/source/connection';

/**
 * 访问⼤大屏-主动鉴权
 * Request URL: //{view.domain}/view/auth?release={releaseCode}&signature={}&time={}&password={}
 * Request Method: GET
 */
export const RELEASE_AUTHORITY = '/view/auth';

/**
 * 获取地图数据
 * Request URL: //{domain}/areas/v1/geojson
 * Request Method: GET
 */
export const GET_MAP_DATA = '/areas/v1/geojson';

/**
 * 获取预览时的子组件数据
 */
export const GET_SUBCOMP_DATA_IN_RELEASE = '/view/childcompinst/data';

/**
 * 获取发布时的子组件数据
 */
export const GET_SUBCOMP_DATA_IN_PREVIEW = '/admin/appcfg/childcompinst/data';

/**
 * geo 文件上传接口
 */
export const FILE_UPLOAD = '/file/upload/source';

/**
 * geo 文件读取接口
 */
export const FILE_READER = '/file/download/context';
/*查询所有收藏夹分组信息,id如果不填，返回全部收藏夹。填了根据id返回
 *Request URL: //{domain}/favorites/
 *Request Method: GET
 * */
export const GET_FAVORITES = '/favorites/';

/**
 *添加组件到收藏夹分组
 *Request URL: //{domain}/favorites/component/
 *Request Method: POST
 * */
export const ADD_FAVORITES_COM_TO_GROUP = '/favorites/component';

/**
 *单个/批量删除收藏夹分组内组件
 *Request URL: //{domain}/favorites/component/{favoritesId}/{id}
 *Request Method: delete
 * */
export const DELETE_FAVORITES_COMPONENT = '/favorites/component';

/**
 * 修改被收藏组件名称
 *Request URL: //{domain}/favorites/component/rename
 *Request Method: put
 */
export const MODIFY_FAVORITES_COMPONENT = '/favorites/component/rename';

/**
 *查询收藏组件信息
 * Request URL: //{domain}/favorites/component/{id}
 * Request Method: get
 * */
export const GET_FAVORITES_COMPONENT = '/favorites/component';

/**
 * 新增&更新组件阈值条件预警接口
 * request url: http://{domain}/admin/compInst/warning
 * request Method: post
 */
export const UPDATE_CREATE_LIMIT = '/admin/compInst/warning';

/**
 * 添加组件预警用户接口
 * request url: http://{domain}/admin/compInst/warning/user
 * request Method: post
 */
export const ADD_NOTIFICATION_USER = '/admin/compInst/warning/user';

/**
 * 查询组件预警用户接口
 * request url: http://{domain}/admin/compInst/warning/getUserList
 * request Method: post
 */
export const SELECT_NOTIFICATION_USER = '/admin/compInst/warning/getUserList';

/**
 * 删除组件预警用户接口
 * request url: http://{domain}/admin/compInst/warning/delUser
 * request Method: post
 */
export const DELETE_NOTIFICATION_USER = '/admin/compInst/warning/delUser';

/**
 * 组件阈值预警信息发送接口
 * request url: http://{domain}/view/compInst/warning/send
 * request Method: post
 */
export const TRIGGER_LIMIT_NOTIFICATION = '/view/compInt/warning/send';

/**
 * 全局阈值预警信息列表
 * request url: http://{domain}//view/warning
 * request Method: get
 */
export const GET_TRIGGER_LIST = '/view/warning';

/**
 * 检查登录状态
 * request url: http://{domain}//view/checkLogin
 * request Method: get
 */
export const CHECK_LOGIN_STATUS = '/view/checkLogin';
/**
 * 新增全局阈值提醒
 * request url: http://{domain}//view/warning
 * request Method: post
 */
export const ADD_NEW_TRIGGER = '/view/warning';
/**
 * 更新指定阈值预警信息
 * request url: http://{domain}//view/warning
 * request Method: put
 */
export const UPDATE_TRIGGER = '/view/warning';
/**
 * 删除指定的全局阈值预警
 * request url: http://{domain}//view/warning
 * request Method: delete
 */
export const DELETE_TRIGGER = '/view/warning';

/**
 * 获取erp列表
 * request url: http://{domain}//view/warning
 * request Method: delete
 */
export const GET_ERP_LIST = '/view/users';

/**
 * 阈值触发，发送提醒
 * request url: http://{domain}//view/compInt/warning/send
 * request Method: delete
 */
export const TRIGGERED = '/view/compInt/warning/send';
