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
  max-width: 350px;
  .bottomContainer {
    padding: 0px 10px;
  }
  .fieldMapList {
    > button {
      padding: 5px 0px 0px 0px;
    }
    .title {
      padding: 0px 5px;
      display: flex;
      align-items: center;
      width: 100%;
      background: ${({ theme }) => theme.palette.background.paper};
      border-radius: 5px;
      height: 44px;
      font-weight: blod;
    }
  }
`;

export const DSLContainer = styled.div`
  height: 100%;
  width: 100%;
  display: flex;
`;
