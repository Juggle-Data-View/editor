/**
 * 组件配置信息
 */
import { IConfig } from './type';

const config: IConfig = {
  version: '1.0.0',
  tab: {
    config: true,
    dataset: true,
  },
  template: {
    title: '数据源组',
    attr: {
      left: 0,
      top: 0,
      width: 200,
      height: 200,
      angle: 0,
      scale: [1, 1],
    },
    config: {
      placeholder: {
        size: 40,
        color: '#fff',
      },
    },
    dataConfig: {
      fieldMap: [
        {
          compFieldName: 'value',
          sourceFieldName: '',
        },
      ],
    },
  },
  forms: {
    type: 'fragment',
    name: 'config',
    children: [
      {
        type: 'collapse',
        name: 'placeholder',
        props: { label: '占位块设置', isOpen: true },
        children: [
          {
            type: 'number',
            name: 'size',
            label: '大小',
            props: {
              muiProps: {
                min: 0,
              },
            },
          },
          { type: 'color', name: 'color', label: '颜色' },
        ],
      },
    ],
  },
};

export default config;
