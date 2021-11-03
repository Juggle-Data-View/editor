import { createBrowserHistory } from 'history';
const { REACT_APP_AutoDV_ENV } = process.env;

export default createBrowserHistory({
  // 除本地开发环境，其他环境均使用 /autoDV
  basename: REACT_APP_AutoDV_ENV === 'local' ? '' : '/autoDV',
});
