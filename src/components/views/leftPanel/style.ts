import styled from 'styled-components';

// Components layers
export const LeftPanelStyled = styled.section<{ visible: boolean }>`
  display: flex;
  flex-direction: column;
  width: 240px;
  margin-left: ${(props) => (props.visible ? 0 : '-240px')};
  height: 100%;
  transition: margin 0.2s ease;
  position: relative;
  background-color: #fff;
  z-index: 2;
  color: #222;
  .panel-head,
  .panel-actions {
    flex: none;
    height: 50px;
    display: flex;
    align-items: center;
    > .MuiButtonGroup-root {
      height: 28px !important;
    }
  }

  .panel-head {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 10px;
    height: 40px;
  }

  .panel-actions,
  .panel-bottom-actions {
    display: flex;
    justify-content: center;
    padding: 4px 5px;
    button {
      margin: 0 1px;
    }
    span {
      line-height: 0;
    }
  }
  .panel-bottom-actions {
    border-right: 1px solid rgba(34, 34, 34, 0.25);
  }
`;

export const ItemListStyled: any = styled.div<{ isDraggingOver: boolean }>`
  position: relative; // 子元素的offsetTop需要根据父元素计算，必须加上相对定位
  height: 100%;
  overflow-y: auto;
  background-color: #eee;
`;

interface IItemWrapProps {
  isDragging: boolean;
  isSelected: boolean;
  isGhosting: boolean;
}

// 组件列表每项的样式
export const ItemStyled = styled('div')<IItemWrapProps>`
  position: relative;
  opacity: ${(props) => (props.isGhosting ? 0.5 : 1)};
  box-sizing: border-box;
  border-bottom: 1px solid #eee;
  background-color: ${({ isSelected, theme }) =>
    isSelected ? theme.palette.action.active : theme.palette.action.disabledBackground};
  .inner {
    padding: 6px 8px;
    display: flex;
    align-items: center;
    height: 100%;
    font-size: 12px;
    user-select: none;
    box-sizing: border-box;
  }

  .thumb {
    margin: 0 8px 0 0;
    display: flex;
    align-items: center;
    justify-content: center;
    &.--img {
      position: relative;
      box-sizing: content-box;
      width: 50px;
      height: 30px;
      flex: none;
      > img {
        max-width: 100%;
        max-height: 100%;
      }
    }
  }

  .info {
    flex: 1;
    max-width: 150px;
    color: #fff;
    > p {
      white-space: nowrap;
      text-overflow: ellipsis;
      overflow: hidden;
    }
  }

  .badge {
    position: absolute;
    right: 0;
    top: 0;
    transform: translate(50%, -50%);
  }

  .actions {
    position: absolute;
    right: 3px;
    top: 2px;
    white-space: nowrap;
    cursor: default;
    color: #fff;
    transform: scale(0.8);
    transform-origin: right top;
    button {
      margin-left: 3px;
    }
  }

  &.--hover {
  }

  &.--hided,
  &.--locked {
    opacity: 0.75;
  }

  &.--selected {
    color: #fff;
  }
`;

export const GroupItem = styled.div<{
  isSelect: boolean;
}>`
  box-sizing: border-box;
  border-bottom: 1px solid #eee;
  .groupHeader {
    display: flex;
    widht: 100%;
    height: 32px;
    background-color: ${({ theme, isSelect }) => {
      return isSelect ? theme.palette.action.active : theme.palette.action.disabledBackground;
    }};
    .groupIcon {
      flex: 1;
      display: flex;
      padding: 0px 5px;
      align-items: center;
    }
    .groupName {
      flex: 7;
      color: #fff;
      font-size: 12px;
      padding: 0px 5px;
      cursor: pointer;
      display: flex;
      height: 100%;
      align-items: center;
    }
    .groupOperation {
      flex: 1;
      padding: 0px 5px;
    }
  }

  &.--hover {
  }
`;

export const CollapseList = styled.div<{
  indent: number;
}>`
  margin-left: ${({ indent }) => indent * 5}px;
`;

export const LeftPannelContainer = styled.div<{ visible: boolean }>`
  width: ${({ visible }) => (visible ? '300px' : '60px')};
  transition: width 0.2s ease;
  display: flex;
  .MuiTabPanel-root {
    padding: 0px;
  }
  .dashbroadController {
    z-index: 4;
    position: relative;
    width: 60px !important;
    background: #fff;
    height: 100%;
    padding: 10px 0px;
    box-sizing: border-box;
    border-right: 1px solid ${({ theme }) => theme.palette.divider};
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;
    .MuiButtonBase-root {
      padding: 9px 0px;
      min-width: 60px;
    }
    .operations {
      width: 44px;
      display: flex;
      align-items: center;
      justify-content: center;
      height: 44px;
      border-radius: 8px;
      background-color: ${({ theme }) => {
        return theme.palette.background.paper;
      }};
    }
  }
`;

export const ComponentsStoreContainer = styled.div`
  width: 240px;
  height: 100%;
  overflow: auto;
  background: ${({ theme }) => theme.palette.background.default};
  -webkit-touch-callout: none; /* iOS Safari */
  -webkit-user-select: none; /* Safari */
  -khtml-user-select: none; /* Konqueror HTML */
  -moz-user-select: none; /* Old versions of Firefox */
  -ms-user-select: none; /* Internet Explorer/Edge */
  user-select: none; /* Non-prefixed version, currently supported by Chrome, Edge, Opera and Firefox */
  .components {
    width: 115px;
    height: 55px;
    display: flex;
    align-items: center;
    cursor: pointer;
    border-radius: 5px;
    text-align: left;
    img {
      width: 40px;
    }
  }
  .storeListRow {
    width: 100%;
    display: flex;
  }
`;
