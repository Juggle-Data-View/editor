import { INodeConfig } from '@juggle-data-view/types/src/form';

import axisLabel from './axisLabel';

const tooltip: INodeConfig[] = [
  {
    name: 'tooltip',
    props: {
      label: '悬浮提示框',
    },
    type: 'collapse',
    children: [
      {
        name: 'show',
        type: 'switch',
        label: '显示提示框',
      },
      {
        name: '',
        type: 'collapse',
        props: {
          label: '边框设置',
        },
        children: [
          {
            name: 'borderColor',
            type: 'color',
            label: '边框颜色',
          },
          {
            name: 'borderWidth',
            type: 'number',
            label: '边框宽度',
            props: {
              muiProps: {
                min: 0,
              },
            },
          },
          {
            name: 'padding',
            type: 'number',
            label: '内边距',
            props: {
              muiProps: {
                min: 0,
              },
            },
          },
          {
            name: 'backgroundColor',
            type: 'color',
            label: '背景颜色',
          },
        ],
      },
      {
        name: 'textStyle',
        type: 'collapse',
        props: {
          label: '文本设置',
        },
        children: axisLabel,
      },
      {
        name: 'formatter',
        type: 'formatter',
        label: '文本格式化',
        labelProps: {
          vertical: true,
        },
        props: {
          codeType: 'javascript',
        },
      },
    ],
  },
];

export default tooltip;
