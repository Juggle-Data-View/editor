import React, { useState } from 'react';
import styled from 'styled-components';
import TextTip from 'components/common/TextTip';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import { Collapse as MuiCollapse, CollapseProps } from '@mui/material';
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
    position: relative;
    padding-left: 5px;
    > * {
      margin: 0 0 10px 0;
      &:last-child {
        margin: 0;
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
  collapseProps?: CollapseProps;
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
          <ArrowForwardIosIcon
            fontSize="small"
            className="arrow"
            style={{ transform: `rotate(${isOpen ? 90 : 0}deg)` }}
          />
        </div>
      </div>
      <MuiCollapse className="fc-body" in={isOpen} mountOnEnter={true} unmountOnExit={true} {...collapseProps}>
        {props.children}
      </MuiCollapse>
    </Container>
  );
};
