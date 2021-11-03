import { INodeConfig } from 'components/recursion';
import * as font from 'config/form/font';

const legend: INodeConfig = {
  name: 'legend',
  type: 'collapse',
  props: {
    label: '图例配置',
  },
  children: [
    {
      name: 'show',
      type: 'switch',
      label: '显示图例',
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

export default legend;
