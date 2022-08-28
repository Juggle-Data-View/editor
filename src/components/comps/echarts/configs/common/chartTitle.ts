import { INodeConfig } from '@juggle-data-view/types/src/form';

import * as font from '@configurableComponents/form/font';

const chartTitle: INodeConfig = {
  name: 'title',
  type: 'collapse',
  props: {
    label: '图表标题',
  },
  children: [
    {
      name: 'show',
      type: 'switch',
      label: '显示',
    },
    {
      name: 'backgroundColor',
      type: 'color',
      label: '标题背景',
    },
    {
      label: '文本内容',
      name: 'text',
      type: 'text',
    },
    {
      name: 'textStyle',
      type: 'fragment',
      children: [
        font.fontSize,
        font.lineHeight,
        font.color,
        font.fontFamily,
        font.fontWeight,
        font.textShadow,
        font.writingMode,
      ],
    },
    {
      name: 'top',
      type: 'text',
      label: '上边距',
    },
    {
      name: 'bottom',
      type: 'text',
      label: '下边距',
    },
    {
      name: 'left',
      type: 'text',
      label: '左边距',
    },
    {
      name: 'right',
      type: 'text',
      label: '右边距',
    },
  ],
};

export default chartTitle;
