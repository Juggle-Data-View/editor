import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import classNames from 'classnames';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';

const Container = styled.div`
  position: relative;
  z-index: 10;
  > .dd-item {
    border: 1px solid transparent;
    cursor: pointer;
    > .item > i {
      border-color: #222;
      color: #222;
    }
    &:hover,
    &.--active {
      background-color: #eee;
    }
    > .arrow {
      position: absolute;
      top: 50%;
      right: 5px;
      transform: translateY(-50%);
    }
  }
  > .dd-list {
    position: absolute;
    top: 100%;
    left: 0;
    width: 100%;
    transition: height 0.3s ease;
    overflow-y: auto;
    background-color: #eee;
    > .inner {
      .item > i {
        border-color: #222;
        color: #222;
        &:hover,
        &.--active {
          background-color: #ccc;
        }
      }
    }
    &.--over {
      bottom: 100%;
      top: auto;
    }
  }
`;

export interface ItemRendererParams<T> {
  item: T;
  index: number;
  handleClick: React.MouseEventHandler<HTMLElement>;
  itemListRef: React.RefObject<HTMLDivElement>;
}

export interface IDropDown<T> {
  items: T[];
  itemRenderer?: (params: ItemRendererParams<T>) => JSX.Element | null;
  itemListRendered?: (items: T[], itemListRef: React.RefObject<HTMLDivElement>) => React.ReactNode | null;
  onItemSelect: (item: T, index: number, event?: React.SyntheticEvent<HTMLElement>) => void;
  children: React.ReactNode;
  listMaxHeight?: number;
  itemClassName?: string;
  listClassName?: string;
}

export default function DropDown<T>(props: IDropDown<T>) {
  const { items, itemRenderer, onItemSelect, itemListRendered, itemClassName, listClassName, listMaxHeight } = props;
  const [isOpen, setIsOpen] = useState(false);
  const itemListRef = useRef<HTMLDivElement>(null);
  const [isOverBottom, setIsOverBottom] = useState(false);

  useEffect(() => {
    const { offsetHeight } = document.documentElement;
    if (!itemListRef.current) return;
    const rect = itemListRef.current.getBoundingClientRect();
    setIsOverBottom(rect.height + rect.top > offsetHeight);
  }, [isOpen]);

  const handleHide = () => {
    setIsOpen(false);
  };

  useEffect(() => {
    window.addEventListener('click', handleHide);
    return () => window.removeEventListener('click', handleHide);
  }, []);

  return (
    <Container onClick={(e) => e.stopPropagation()}>
      <div className={classNames('dd-item', { '--active': isOpen }, itemClassName)} onClick={() => setIsOpen(!isOpen)}>
        {props.children}
        <ArrowForwardIosIcon className="arrow" />
      </div>
      <div
        className={classNames('dd-list', { '--active': isOpen, '--over': isOverBottom }, listClassName)}
        style={{ height: isOpen ? listMaxHeight || 'auto' : 0 }}
        ref={itemListRef}
      >
        <div className="inner">
          {itemListRendered
            ? itemListRendered(items, itemListRef)
            : itemRenderer
            ? items.map((item, index) => {
                return itemRenderer({
                  item,
                  index,
                  handleClick: (e) => {
                    onItemSelect(item, index, e);
                    setIsOpen(false);
                  },
                  itemListRef,
                });
              })
            : null}
        </div>
      </div>
    </Container>
  );
}
