/**
 * 环境变量设置，详细设置可参考 `CRA` 官方文档：
 * @see https://create-react-app.dev/docs/adding-custom-environment-variables
 *
 * 关于 `env-cmd` 的说明，见：
 * @see https://create-react-app.dev/docs/deployment#customizing-environment-variables-for-arbitrary-build-environments
 */

module.exports = {

  development: {
    REACT_APP_AutoDV_ENV: 'development',
    REACT_APP_API_BASE_URL: '//localhost:3002',
    REACT_APP_COVER_IMAGE_API_BASE_URL: 'http://11.50.77.199',
  },

};
