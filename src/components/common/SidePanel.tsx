/**
 * 侧边栏显示隐藏组件
 */

import React from 'react';
import styled from 'styled-components';

export interface IProps {
  /**
   * 面板宽度
   */
  width: number;
  visible: boolean;
  direction: 'left' | 'right';
  children?: React.ReactNode;
}

const Container = styled.section<IProps>`
  display: flex;
  flex-direction: column;
  position: relative;
  box-sizing: border-box;
  transition: width 200ms ease;
  width: ${(props) => (props.visible ? props.width + 'px' : 0)};
  height: 100%;

  .animate-polyfill {
    display: flex;
    flex-direction: column;
    height: 100%;
    width: ${(props) => props.width + 'px'};
    height: 100%;
    position: relative;
    background-color: ${(props) => props.theme.gray3};
    ${(props) =>
      props.direction === 'left'
        ? `border-right: 1px solid ${props.theme.gray1}`
        : `border-left: 1px solid ${props.theme.gray1}`};
  }

  .panel-head,
  .panel-foot {
    background-color: ${(props) => props.theme.gray2};
  }

  // 面板顶部
  .panel-head {
    .common-title {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 10px;
      height: 28px;
      border-bottom: 1px solid ${(props) => props.theme.gray1};
    }
  }

  // 面板中间部分，可滚动
  .panel-body {
    flex: 1;
    height: 1px;
  }

  // 面板底部
  .panel-foot {
  }
`;

const SidePanel: React.FC<IProps> = (props) => {
  return (
    <Container {...props}>
      <div className="animate-polyfill">{props.children}</div>
    </Container>
  );
};

export default SidePanel;
