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
 * 访问大屏-获取发布大屏配置信息
 * Request URL: //{view.domain}/view/config?release={releaseCode}
 * Request Method: GET
 */
export const RELEASE_APP_CONFIG = '/view/config';
