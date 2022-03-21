import { INodeConfig } from 'auto-dv-type/src/form';

import { withNode } from 'components/recursion/fields';
import { ArrayHelpers, FormikContextType, useField, useFormikContext } from 'formik';

import styled from 'styled-components';
import { get } from 'lodash';
import { Button, ButtonGroup } from '@mui/material';
import React from 'react';
import AddCircleOutline from '@mui/icons-material/AddCircleOutline';
import DeleteForever from '@mui/icons-material/DeleteForever';
import ContentCopy from '@mui/icons-material/ContentCopy';

type OperationValueTypes = 'add' | 'delete' | 'copy';

type Operations = {
  //操作的中文名称
  name?: string;
  //操作的key
  value: OperationValueTypes;
  //操作数据的数组索引
  refIndex?: number;
  //操作项icon
  icon?: OperationValueTypes;
};

interface DynamicMultiFieldProps {
  fieldsName?: React.ReactNode | ((item: any, index: number) => React.ReactNode) | string;
  operations?: Operations[];
  childrenOperations?: Operations[];
  // layout: 'vertical'|'herizontal';
  onBeforeAdd?: (newItem: any) => any;
  onAdded?: (form: FormikContextType<any>, name: INodeConfig['name']) => void;
  onDelete?: (index: number) => void;
}

const Container = styled.div`
  width: 100%;
  padding: 5px;
  .operations {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: flex-end;
  }
  .row {
    display: flex;
    padding: 5px 0px;
    .content {
      flex: 3;
      display: flex;
      align-items: center;
      > div {
        margin-right: 5px;
      }
    }
    .operations {
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: flex-end;
    }
  }
`;

const DynamicMultiField = withNode<DynamicMultiFieldProps>((props) => {
  const { name, operations, onBeforeAdd, onAdded, onDelete, fieldsName, childrenOperations, children } = props;
  const { push, insert, remove } = props.arrayHelpers as ArrayHelpers;
  const [field] = useField<any[]>(name);
  const form = useFormikContext();
  const fieldValue = field.value || [];

  const canDelete = fieldValue.length > 1;

  const addNewItem = (oldItem: any) => {
    return onBeforeAdd ? onBeforeAdd(oldItem) : oldItem;
  };

  const handleAdd = (refIndex: number) => {
    const defaultValue = get(props.defaultValues, name);
    push({
      ...addNewItem(defaultValue[refIndex]),
    });
    onAdded && onAdded(form, name);
  };

  const handleDelete = (refIndex: number) => {
    if (canDelete) {
      remove(refIndex);
      onDelete && onDelete(refIndex);
    }
  };

  const handleCopy = (refIndex: number) => {
    insert(refIndex + 1, addNewItem(fieldValue[refIndex]));
  };

  /**
   * 处理点击事件
   * @param item 当前操作项的数据
   * @param index 如果操作项在每一项后，传入当前项索引
   */
  const handleClick = (item: Operations, index?: number) => {
    switch (item.value) {
      case 'add':
        return handleAdd(index || item.refIndex || 0);
      case 'copy':
        return handleCopy(index || item.refIndex || 0);
      case 'delete':
        return handleDelete(index || fieldValue.length - 1);
      default:
        return () => console.log('no operation');
    }
  };

  const getIcon = (iconName?: OperationValueTypes) => {
    switch (iconName) {
      case 'add':
        return <AddCircleOutline />;
      case 'delete':
        return <DeleteForever />;
      case 'copy':
        return <ContentCopy />;
      default:
        return null;
    }
  };

  /**
   *
   * @param Operations 可操作的项
   * @param isChild 是否在每一个子项后渲染
   */
  const renderOperations = (Operations: Operations[], isChild?: boolean) => {
    return Operations.map((item, index) => {
      return !canDelete && item.value === 'delete' ? null : (
        <Button key={index} onClick={() => (isChild ? handleClick(item, index) : handleClick(item))}>
          {item.name || getIcon(item.icon || item.value)}
        </Button>
      );
    });
  };

  return (
    <Container>
      <div>{fieldsName || ''}</div>
      {operations ? (
        <ButtonGroup size="small" sx={{ marginLeft: '5px' }}>
          {renderOperations(operations)}
        </ButtonGroup>
      ) : null}
      {React.Children.map(children, (child, index) => {
        return (
          <div className="row" key={index}>
            <div className="content">{child}</div>
            {childrenOperations ? (
              <ButtonGroup size="small" sx={{ marginLeft: '5px' }}>
                {renderOperations(childrenOperations)}
              </ButtonGroup>
            ) : null}
          </div>
        );
      })}
    </Container>
  );
});

export default DynamicMultiField;
