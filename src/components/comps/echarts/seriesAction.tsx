import { Menu, MenuItem, Position, Button } from '@blueprintjs/core';
import { Popover2 } from '@blueprintjs/popover2';
import { ArrayHelpers } from 'formik';

import notice from 'utils/notice';
// import { layer } from '../map/type';

interface SeriesItem {
  type: 'line' | 'bar';
  name: string;
}

const SeriesList: SeriesItem[] = [
  {
    type: 'line',
    name: '添加折线系列',
  },
  {
    type: 'bar',
    name: '添加柱形系列',
  },
];

const SeriesAction: React.FC<{
  defaultValue: any;
  push: ArrayHelpers['push'];
  fieldMapOption: {
    fieldMapPath: string;
    fieldMap: AutoDV.DataConfig['fieldMap'];
    fieldName: string;
  };
  setValue: (field: string, value: any, shouldValidate?: boolean | undefined) => void;
}> = (props) => {
  const { defaultValue, push, fieldMapOption, setValue } = props;

  const getDefaultVal = (defaultValue: any[], type: SeriesItem['type']) => {
    const result = defaultValue.find((item) => item.type === type);
    if (!result) {
      notice.error(`${type}系列未在基础配置中找到，请检查基础配置文件`);
      return new Error('添加系列出错,将添加可用系列');
    }
    return result || defaultValue[0];
  };

  const handleClick = (type: SeriesItem['type']) => {
    const { fieldMap, fieldName, fieldMapPath } = fieldMapOption;
    const data = {
      ...getDefaultVal(defaultValue, type),
      name: fieldName,
      FieldName: fieldName,
    };
    const result: any[] = fieldMap.concat([
      {
        sourceFieldName: '',
        compFieldName: fieldName,
      },
    ]);
    setValue(fieldMapPath, result);
    push(data);
  };

  return (
    <Popover2
      position={Position.BOTTOM_RIGHT}
      content={
        <Menu className="" style={{ maxHeight: 240, overflow: 'auto' }}>
          {SeriesList.map((item, index) => (
            <MenuItem key={index} text={item.name} onClick={() => handleClick(item.type)} />
          ))}
        </Menu>
      }
    >
      <Button alignText="left" rightIcon="double-caret-vertical" icon="add" />
    </Popover2>
  );
};

export default SeriesAction;
