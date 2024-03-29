/**
 * common ui styles
 */
import { createGlobalStyle } from 'styled-components';

/**
 * 编辑器公共样式
 */
export const EditorGlobalStyle = createGlobalStyle`
  html, body {
    overflow: hidden;
    font-size: 12px;
  }
  #root {
    display: flex;
    flex-direction: column; // 使主轴向下排列，上下布局
  }
  .main {
    position: relative;
    display: flex;
    flex: 1;
    height: 100vh;
    flex-direction: row;
  }
`;
