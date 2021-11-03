/**
 * - @typescript-eslint/parser：将 TypeScript 转换为 ESTree，使 eslint 可以识别
 * - @typescript-eslint/eslint-plugin：只是一个可以打开或关闭的规则列表
 * - eslint-config-prettier: 禁用所有和 Prettier 产生冲突的规则
 * - eslint-plugin-prettier: 把 Prettier 应用到 Eslint，配合 rules "prettier/prettier": "error" 实现 Eslint 提醒。
 */

module.exports = {
  parser: '@typescript-eslint/parser',
  extends: [
    // 定义文件继承的子规范
    'plugin:@typescript-eslint/recommended',

    'react-app',

    /**
     * plugin:prettier/recommended: prettier 推荐的规则，需要修改的可以在 .prettierrc.js 文件里配置
     */
    'plugin:prettier/recommended',
  ],
  plugins: ['@typescript-eslint', 'react'],
  rules: {
    // 有一些 react-redux-form 的组件应用了A.b的规则，所以这里禁用掉
    'react/jsx-pascal-case': 'off',
    'react/self-closing-comp': 1,
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
  },
};
