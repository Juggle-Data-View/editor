import * as React from 'react';
import styled from 'styled-components';
import { INodeConfig } from 'components/recursion/types';
import DropDown, { IDropDown } from 'components/common/DropDown';
import { IBorderStyleItem, borderStyle as items } from 'config/style';

const Container = styled.div`
  .item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 8px 30px 8px 8px;
    i {
      border: 2px solid #fff;
      border-width: 1px 0 0 0;
      height: 0;
      width: 80px;
      display: block;
    }
    &.--active,
    &:hover {
    }
  }
`;

type IItem = IBorderStyleItem;

interface IBorderStyleDropDown {
  value: IItem['value'];
  onChange: IDropDown<IItem>['onItemSelect'];
}

export const BorderStyleDropDown = ({ value, onChange }: IBorderStyleDropDown) => {
  const active = items.find((option) => option.value === value);
  return (
    <Container>
      <DropDown<IItem>
        items={items}
        onItemSelect={onChange}
        itemRenderer={({ item, handleClick }) => {
          const cls = ['item', active?.value === item.value ? '--active' : ''].join(' ');
          return (
            <div key={item.value} className={cls} onClick={handleClick}>
              <span>{item.label}</span>
              <i style={{ borderStyle: item.value }} />
            </div>
          );
        }}
      >
        <div className="item">
          <span>{active?.label}</span>
          <i style={{ borderStyle: active?.value }} />
        </div>
      </DropDown>
    </Container>
  );
};

export const borderStyle: INodeConfig = {
  type: 'component',
  name: 'borderStyle',
  label: '边框样式',
  props: ({ name, value, setValue }) => {
    return {
      render: <BorderStyleDropDown value={value} onChange={(item) => setValue(name, item.value)} />,
    };
  },
};
