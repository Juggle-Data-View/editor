import { INodeConfig } from 'components/recursion/types';
import * as style from 'config/style';
import global from 'utils/global';

export const type: INodeConfig = {
  type: 'select',
  name: 'type',
  label: '时间类型',
  props: {
    options: [
      { label: '本地时间', value: 'local' },
      { label: '服务器时间', value: 'server', disabled: global.wssType !== 1 },
    ],
  },
};

export const animation: INodeConfig = {
  type: 'select',
  name: 'animation',
  label: '动画效果',
  props: { options: style.animation },
};

export const textAnimation: INodeConfig = {
  type: 'select',
  name: 'textAnimation',
  label: '文本动画',
  props: { options: style.textAnimation },
};

export const backgroundTypes: INodeConfig = {
  type: 'select',
  name: 'backgroundTypes',
  label: '背景类型',
  props: { options: style.backgroundTypes },
};
