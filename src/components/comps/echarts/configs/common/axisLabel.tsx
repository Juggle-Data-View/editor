import * as font from 'config/form/font';
import { INodeConfig } from 'auto-dv-type/src/form';

const axisLabel: INodeConfig[] = [
  {
    name: 'show',
    label: '显示文本',
    type: 'switch',
  },
  {
    name: 'margin',
    label: '距文本距离',
    type: 'number',
  },
  {
    name: 'inside',
    label: '朝内',
    type: 'switch',
  },
  //top / left / right / bottom / inside / insideLeft / insideRight / insideTop / insideBottom / insideTopLeft / insideBottomLeft / insideTopRight / insideBottomRight
  {
    name: 'position',
    label: '文本位置',
    type: 'select',
    props: {
      options: [
        {
          value: 'top',
          label: '顶部',
        },
        {
          value: 'inside',
          label: '内部',
        },
        {
          value: 'bottom',
          label: '底部',
        },
        {
          value: 'left',
          label: '左侧',
        },
        {
          value: 'right',
          label: '右侧',
        },

        {
          value: 'insideLeft',
          label: '内部居左',
        },
        {
          value: 'insideRight',
          label: '内部居右',
        },
        {
          value: 'insideTop',
          label: '内部居上',
        },
        {
          value: 'insideBottom',
          label: '内部居下',
        },
        {
          value: 'insideTopLeft',
          label: '内部左上',
        },
        {
          value: 'insideBottomLeft',
          label: '内部左下',
        },
        {
          value: 'insideTopRight',
          label: '内部右上',
        },
        {
          value: 'insideBottomRight',
          label: '内部右下',
        },
      ],
    },
  },

  {
    name: 'rotate',
    label: '旋转角度',
    type: 'number',
    props: {
      muiProps: {
        max: 180,
      },
    },
  },

  font.fontSize,
  font.lineHeight,
  font.color,
  font.fontFamily,
  font.fontWeight,
  font.textShadow,
  font.writingMode,
  { name: 'ellipsis', type: 'switch', label: '超出省略' },
  {
    type: 'collapse',
    name: '',
    props: {
      label: '文字阴影',
    },
    children: [
      { type: 'color', name: 'textShadowColor', label: '颜色' },
      { type: 'number', name: 'textShadowBlur', label: '长度' },
      { type: 'number', name: 'textShadowOffsetX', label: 'X偏移' },
      { type: 'number', name: 'textShadowOffsetY', label: 'Y偏移' },
    ],
  },
  {
    name: 'formatter',
    type: 'formatter',
    label: '格式化函数',
    labelProps: {
      vertical: true,
    },
    show: ({ name, getValue }) => {
      const seriesData = getValue(name, '../../');
      if (seriesData.type === 'pie') {
        return false;
      } else {
        return true;
      }
    },
    props: {
      codeType: 'javascript',
    },
  },
];

export default axisLabel;
