import styled from 'styled-components';

// 左侧面板样式
export const LeftPanelStyled = styled.section<{ visible: boolean }>`
  display: flex;
  flex-direction: column;
  width: 240px;
  margin-left: ${(props) => (props.visible ? 0 : '-240px')};
  height: 100%;
  transition: margin 0.2s ease;
  border-right: 1px solid ${(props) => props.theme.gray1};
  position: relative;
  z-index: 2;
  background-color: ${(props) => props.theme.gray3};

  .panel-head,
  .panel-actions {
    flex: none;
    background-color: ${(props) => props.theme.gray2};
  }

  .panel-head {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 10px;
    height: 28px;
    border-bottom: 1px solid ${(props) => props.theme.gray1};
  }

  .panel-actions {
    display: flex;
    justify-content: center;
    padding: 4px 0;
    button {
      margin: 0 1px;
    }
  }
`;

export const ItemListStyled: any = styled.div<{ isDraggingOver: boolean }>`
  position: relative; // 子元素的offsetTop需要根据父元素计算，必须加上相对定位
  height: 100%;
  overflow-y: auto;
  background: ${(props) => (props.isDraggingOver ? props.theme.gray4 : 'transparent')};
`;

interface IItemWrapProps {
  isDragging: boolean;
  isSelected: boolean;
  isGhosting: boolean;
}

// 组件列表每项的样式
export const ItemStyled = styled.div<IItemWrapProps>`
  position: relative;
  opacity: ${(props) => (props.isGhosting ? 0.5 : 1)};
  border-bottom: 1px solid ${(props) => props.theme.gray2};
  box-sizing: border-box;

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
      border: 1px solid ${(props) => props.theme.gray1};
      background-color: ${(props) => props.theme.gray5};
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
    transform: translate(30%, -30%);
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
    background-color: ${(props) => props.theme.gray5};
  }

  &.--hided,
  &.--locked {
    opacity: 0.75;
  }

  &.--selected {
    background-color: ${(props) => props.theme.primary};
    color: #fff;
  }
`;

export const GroupItem = styled.div<{
  isSelect: boolean;
}>`
  box-sizing: border-box;
  .groupHeader {
    display: flex;
    widht: 100%;
    height: 32px;
    background-color: ${({ theme, isSelect }) => (isSelect ? theme.primary : '')};
    border-bottom: 1px solid #222e36;
    .groupIcon {
      flex: 1;
      padding: 0px 5px;
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
    background-color: ${(props) => props.theme.gray5};
  }
`;

export const CollapseList = styled.div<{
  indent: number;
}>`
  padding-left: 5px;
  margin-left: ${({ indent }) => indent * 5}px;
  border-left: 1px solid #222e36;
`;
