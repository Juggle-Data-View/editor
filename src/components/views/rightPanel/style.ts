import styled from 'styled-components';

export const RightPanelStyled = styled.section<{ visible: boolean }>`
  position: relative;
  z-index: 15; // 比标尺高一点
  transition: margin 0.2s ease;
  will-change: transform;
  color: #222;
  margin-right: ${(props) => (props.visible ? 0 : '-300px')};
  box-shadow: -1px 6px 5px rgba(34, 34, 34, 0.25);
  .panel-form {
    position: relative;
    z-index: 14;
    display: flex;
    flex-direction: column;
    height: 100%;
    background-color: #fff;
    > .MuiTabPanel-root {
      padding: 0px;
      overflow: auto;
      overflow-x: hidden;
    }
  }

  .panel-head {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 10px;
    height: 28px;
    flex: none;
  }

  .panel-body {
    overflow-y: auto;
  }

  .panel-tabs {
    display: flex;
    flex-direction: column;
    height: 100%;
    /* tab head 样式 */
    > .bp3-tab-list {
      height: 28px;
      padding: 0 10px;
      /* tab 按钮样式 */
      > .bp3-tab {
        margin-right: 10px;
        padding: 0 3px;
        font-size: 12px;
      }
    }
    /* tab content 样式 */
    > .bp3-tab-panel {
      margin-top: 0;
      overflow-y: auto;
      padding-bottom: 50px; // 底部留一些空间
      min-height: 100%;
      box-sizing: border-box;
    }
  }

  .comp-info,
  .comp-attr {
    position: relative;
    &:after {
      position: absolute;
      content: '';
      left: 0;
      bottom: 0;
      width: 100%;
    }
  }
  .comp-info {
    display: flex;
    align-items: center;
    padding: 5px 10px;
    > h4 {
      margin-bottom: 3px;
    }
    .btn-refresh {
      margin-right: 5px;
      transform: scale(0.7);
      transform-origin: center;
    }
  }
  .comp-attr {
    padding: 10px 0;
    margin-bottom: -1px; // 防止边线与 Collapse 组件重叠
  }
`;

export const HistoryPanelStyled = styled.section<{ visible: boolean }>`
  display: flex;
  flex-direction: column;
  position: absolute;
  top: 0;
  bottom: 0;
  left: 1px;
  width: 200px;
  z-index: 11;
  transform: ${(props) => (props.visible ? 'translateX(-100%)' : 'none')};
  transition: transform 0.2s ease;
  will-change: transform;
  background-color: #eee;
  .panel-body {
    padding-top: 0;
    flex: 1;
  }

  .undo-future {
    opacity: 0.5;
  }
`;

export const DataConfigStyled = styled.div`
  .block {
    margin-top: 10px;
    padding: 0 10px;
  }
  .step {
    .gap {
      display: flex;
      justify-content: flex-end;
      align-items: center;
      position: relative;
      &:before {
        position: absolute;
        content: '';
        left: 2em;
        top: 0;
        bottom: 0;
        width: 1px;
        background-color: #fff;
      }
    }
    .to {
      pre {
        padding: 10px;
        height: 300px;
        overflow-y: auto;
      }
    }
    .autoDV-json-editor {
      margin-top: 10px;
    }
  }

  // 配置数据源 抽屉
  .datasource-config {
    .bp3-drawer-header {
      padding: 0 10px;
      h4 {
        font-size: 14px;
      }
    }
  }

  .drawer-container {
    background-color: #fff;
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    transform: translateX(100%);
    transition: transform 0.2s ease;
    overflow-y: auto;
    margin-left: -50px;
    z-index: 5;
    .head {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 7px 10px;
      .title {
        font-size: 16px;
      }
    }

    &.--show {
      transform: translateX(0);
    }
  }
`;

export const DSLContainer = styled.div`
  height: 100%;
  width: 100%;
  display: flex;
`;
