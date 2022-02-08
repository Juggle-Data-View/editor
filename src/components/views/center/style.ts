import styled from 'styled-components';

export const CenterStyled: any = styled.section`
  position: relative;
  z-index: 1; // 其他面板为2，防止selecto功能拖拽到其他面板穿帮
  display: flex;
  flex-direction: column;
  flex: 1;
  height: calc(100% - 56px);
  overflow: hidden;
`;

export const CanvasWrapStyled = styled.div`
  position: relative;
  flex: 1;
  height: 1px;
  z-index: 1;

  .screen {
    position: absolute;
    width: 100%;
    height: 100%;
    overflow: auto;
    color: #999;
    user-select: none;
    box-sizing: border-box;
    z-index: 2;
    &::-webkit-scrollbar {
      width: 8px;
      height: 8px;
    }
    &::-webkit-scrollbar-track {
      background: transparent;
    }
    &::-webkit-scrollbar-thumb {
      border: none;
      border-radius: 1em;
    }
    &::-webkit-scrollbar-corner {
      background-color: transparent;
    }
  }

  .selecto-selection {
    background-color: rgba(68, 170, 255, 0.1);
  }
`;

export const CentFootStyled = styled.div`
  position: relative;
  z-index: 4; // 标尺是3
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 32px;
  box-shadow: -1px 0px 5px rgba(34, 34, 34, 0.25);
  padding: 0 5px;
  .right {
    display: flex;
    align-items: center;
    transform: scale(0.88);
    transform-origin: right center;
  }
  .icons {
    .btn {
      margin: 0 3px;
    }
  }
  .action-input {
    margin-left: 15px;
    width: 100px;
    .bp3-control-group {
      transform: none; /** 解决inputNumber上部分被切断1px问题 */
    }
  }
  input {
    padding: 5px 10px;
  }
  .slider {
    width: 260px;
    margin-left: 15px;
  }
`;

// 画布单个组件样式
export const CompStyled = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  background-color: transparent;
  user-select: none;

  &:after {
    content: '';
    position: absolute;
    display: none;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    cursor: default;
  }

  &.--hided {
    display: none;
  }

  &.--hover,
  &.--selected,
  &.--snap {
    &:after {
      display: block;
      background-color: rgba(255, 255, 255, 0.2);
    }
  }

  &.--locked {
    &:after {
      cursor: not-allowed;
      user-select: none;
    }
  }

  &.--none {
    pointer-events: none;
  }
`;

// 画布分组组件样式
export const GroupCompStyled = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  background-color: transparent;
  user-select: none;

  &:after {
    content: '';
    position: absolute;
    display: none;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    cursor: default;
  }

  &.--hided {
    display: none;
  }

  &.--groupHover,
  &.--selected {
    &:after {
      display: block;
      background-color: rgba(255, 255, 255, 0.15);
    }
  }

  &.--groupHover {
    &:after {
      background-color: rgba(255, 255, 255, 0);
      display: block;
      border: 1px solid #1776b1;
    }
  }

  &.--locked {
    &:after {
      cursor: not-allowed;
      user-select: none;
    }
  }

  &.--selected {
    z-index: 10000;
  }
`;
