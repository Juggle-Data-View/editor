import React, { ReactNode } from 'react';
import { useField, ArrayHelpers } from 'formik';
import { Button, ButtonGroup, Tooltip } from '@blueprintjs/core';
import { get } from 'lodash';
import { withNode } from '../fields';
import { Collapse } from 'components/form/Collapse';

interface ItemProps {
  item: any;
  actions: ReactNode;
  //子项索引
  index: number;
  /** 使用此对象内部的方法时，不会触发 `onAdd`、`onDelete`、`onSwap` 等方法 */
  helpers: ArrayHelpers;
  child: ReactNode;
}

type ArrayAction = 'copy' | 'add';

interface ICustomTabs {
  label?: React.ReactNode;
  itemTitle?: React.ReactNode | ((item: any, index: number) => React.ReactNode);
  headExtra?: (defaultValue: any, push: ArrayHelpers['push']) => React.ReactNode;
  onBeforeAdd?: (oldItem: any, type: ArrayAction) => any;
  onAdd?: (item: any) => void;
  onDelete?: (item: any, index: number) => void;
  onSwap?: (sourceIndex: number, targetIndex: number) => void;
  actions?: ('copy' | 'up' | 'down' | 'delete')[];
  renderItem?: (itemProps: ItemProps) => React.ReactNode;
  disableDelete?: (item: any, index: number) => boolean;
  limit?: number;
}

const CustomTabs = withNode<ICustomTabs>((node) => {
  const { name, onDelete, headExtra, onBeforeAdd, onAdd, onSwap, renderItem, itemTitle, limit, disableDelete } = node;
  const [field] = useField(name);
  const fieldValue = field.value || [];
  const helpers = node.arrayHelpers as ArrayHelpers;
  const { push, insert, swap, remove } = helpers;
  const arrValue = get(node.defaultValues, name);
  const actions = node.actions || ['copy', 'up', 'down', 'delete'];
  const getItem = (old: any, type: ArrayAction) => (onBeforeAdd ? onBeforeAdd(old, type) : old);
  const limitLen = React.Children.toArray(node.children).length;

  /**
   * 删除按钮是否删除
   * @param item 当前操作项
   * @param index 当前项下标
   * @returns 返回true禁用
   */
  const needDisableDelete = (item: any, index: number) => {
    const numCondition = field.value.length <= 1;
    if (disableDelete) {
      return disableDelete(item, index) || numCondition;
    } else {
      return numCondition;
    }
  };

  return (
    <Collapse
      label={node.label}
      extra={
        headExtra ? (
          headExtra(arrValue, push)
        ) : (
          <Button
            minimal
            icon="add"
            disabled={limit !== undefined && !isNaN(limit) && limit <= limitLen}
            onClick={() => {
              const item = getItem(arrValue[0], 'add');
              push(item);
              onAdd && onAdd(item);
            }}
          />
        )
      }
    >
      {React.Children.map(node.children, (child, index) => {
        const item = fieldValue[index];
        const actionNode = (
          <ButtonGroup minimal style={{ textAlign: 'right' }}>
            {actions.includes('copy') && (
              <Tooltip content="复制" position="bottom">
                <Button
                  icon="duplicate"
                  disabled={limit !== undefined && !isNaN(limit) && limit <= limitLen}
                  onClick={() => {
                    const _item = getItem(item, 'copy');
                    insert(index + 1, _item);
                    onAdd && onAdd(_item);
                  }}
                />
              </Tooltip>
            )}
            {actions.includes('up') && (
              <Tooltip content="上移" position="bottom" disabled={index === 0}>
                <Button
                  icon="arrow-up"
                  disabled={index === 0}
                  onClick={() => {
                    swap(index, index - 1);
                    onSwap && onSwap(index, index - 1);
                  }}
                />
              </Tooltip>
            )}
            {actions.includes('down') && (
              <Tooltip content="下移" position="bottom" disabled={index === field.value.length - 1}>
                <Button
                  icon="arrow-down"
                  disabled={index === field.value.length - 1}
                  onClick={() => {
                    swap(index + 1, index);
                    onSwap && onSwap(index + 1, index);
                  }}
                />
              </Tooltip>
            )}
            {actions.includes('delete') && (
              <Tooltip content="删除" position="bottom">
                <Button
                  icon="trash"
                  disabled={needDisableDelete(item, index)}
                  onClick={() => {
                    remove(index);
                    onDelete && onDelete(item, index);
                  }}
                />
              </Tooltip>
            )}
          </ButtonGroup>
        );
        return !renderItem ? (
          <Collapse
            key={index}
            label={typeof itemTitle === 'function' ? itemTitle(item, index) : itemTitle}
            extra={actionNode}
          >
            {child}
          </Collapse>
        ) : (
          renderItem({
            item,
            index,
            actions: actionNode,
            child,
            helpers,
          })
        );
      })}
    </Collapse>
  );
});

export default CustomTabs;
