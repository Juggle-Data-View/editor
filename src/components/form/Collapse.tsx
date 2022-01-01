import React, { useState } from 'react';
import styled from 'styled-components';
import { Icon, Collapse as BPCollapse, ICollapseProps } from '@blueprintjs/core';
import TextTip from 'components/common/TextTip';

const CLASS_NAME = 'field-collapse';

const Container = styled.div.attrs(() => {
  return {
    className: CLASS_NAME,
  };
})<{ isOpen: boolean }>`
  z-index: ${(props) => (props.isOpen ? 10000 : 0)};
  border-width: 1px 0;

  .fc-head {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 10px;
    height: 36px;
    cursor: pointer;

    > i {
      position: absolute;
      left: 10px;
      right: 10px;
      bottom: 0;
      height: 1px;
    }

    .lt {
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      flex: 1;
    }
    .rt {
      display: flex;
      align-items: center;
      .arrow {
        transition: transform 0.3s ease;
      }
      .extra {
        margin-right: 5px;
      }
    }
  }

  .fc-body {
    width: 100%;
    /* overflow: hidden;  不能设置超出隐藏，有些组件是悬浮的下拉框 */
    .bp3-collapse-body {
      position: relative;
      padding: 10px;
      > * {
        margin-bottom: 10px;
        margin: 0 0 10px 0;
        &:last-child {
          margin: 0;
        }
      }
    }
  }

  /* 相邻的下一个自身元素时，减去自身重叠的边线 */
  & + & {
    margin-top: -1px;
  }

  /* 嵌套自身 */
  & & {
    border-width: 0px;
    border-radius: 2px;
  }
  & & & {
  }
  & & & & {
  }
  & & & & & {
    background: #fff;
  }
`;

export interface ICollapse {
  label: React.ReactNode;
  help?: JSX.Element | string;
  extra?: React.ReactNode;
  isOpen?: boolean; // 是否展开
  collapseProps?: ICollapseProps;
}

export const Collapse: React.FC<ICollapse> = (props) => {
  const { help, label, extra, collapseProps } = props;
  const [isOpen, setIsOpen] = useState(props.isOpen || false);

  return (
    <Container className="field-collapse" isOpen={isOpen}>
      <div className="fc-head" onClick={() => setIsOpen(!isOpen)}>
        <i style={{ display: isOpen ? 'block' : 'none' }} />
        <div className="lt">
          {label}
          {help ? <TextTip text={help} /> : null}
        </div>
        <div className="rt">
          <div className="extra" onClick={(e) => e.stopPropagation()}>
            {extra}
          </div>
          <Icon className="arrow" icon="chevron-right" style={{ transform: `rotate(${isOpen ? 90 : 0}deg)` }} />
        </div>
      </div>
      {
        // 关于 keepChildrenMounted：
        // 当表单配置过多时，不要开启 keepChildrenMounted，否则会有严重的性能消耗。
      }
      <BPCollapse className="fc-body" isOpen={isOpen} {...collapseProps}>
        {props.children}
      </BPCollapse>
    </Container>
  );
};
