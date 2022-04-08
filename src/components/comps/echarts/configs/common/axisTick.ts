import { INodeConfig } from '@juggle-data-view/types/src/form';
import lineStyle from './lineStyle';

const axisTick: INodeConfig[] = [
  {
    name: 'show',
    label: '显示轴刻度',
    type: 'switch',
  },
  {
    name: 'alignWithLabel',
    label: '对齐刻度',
    type: 'switch',
  },
  {
    name: 'inside',
    label: '朝内',
    type: 'switch',
  },
  {
    name: 'length',
    label: '长度',
    type: 'number',
  },
  {
    type: 'collapse',
    name: 'lineStyle',
    props: {
      label: '刻度线样式',
    },
    children: [...lineStyle],
  },
];

export default axisTick;
