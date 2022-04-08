import { INodeConfig } from '@juggle-data-view/types/src/form';
import * as style from 'config/style';

export const fontSize: INodeConfig = {
  type: 'number',
  name: 'fontSize',
  label: '字号',
  props: {
    unit: 'px',
    muiProps: { min: 0 },
  },
};

export const lineHeight: INodeConfig = {
  type: 'number',
  name: 'lineHeight',
  label: '行高',
  labelProps: {
    help: '字号的倍数，不是px单位。',
  },
  props: {
    muiProps: { stepsize: 0.1, min: 0 },
  },
};

export const color: INodeConfig = {
  type: 'color',
  name: 'color',
  label: '字体颜色',
};

export const fontFamily: INodeConfig = {
  type: 'select',
  name: 'fontFamily',
  label: '字体',
  props: { options: style.fontFamily },
};

export const fontWeight: INodeConfig = {
  type: 'select',
  name: 'fontWeight',
  label: '字体粗细',
  props: { options: style.fontWeight },
};

export const textShadow: INodeConfig = {
  type: 'textarea',
  name: 'textShadow',
  label: '文字阴影',
  labelProps: {
    help: '可以为文字与text-decorations添加多个阴影，阴影值之间用逗号隔开。每个阴影值（如：10px 10px 20px #f00）由元素在X和Y方向的偏移量、模糊半径和颜色值组成。',
  },
};

export const writingMode: INodeConfig = {
  type: 'select',
  name: 'writingMode',
  label: '排列方式',
  props: { options: style.writingMode },
};

export const textAlign: INodeConfig = {
  type: 'select',
  name: 'textAlign',
  label: '对齐方式',
  props: { options: style.textAlign },
};
