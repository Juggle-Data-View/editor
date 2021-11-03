import { INodeConfig } from 'components/recursion';
import axis from '../common/axis';
import toolip from '../common/tooltip';
import chartTitle from '../common/chartTitle';
import containLabel from '../common/containLabel';
import legend from '../common/legend';
import lineSeriesCommin from '../common/linesSeriesCommon';

const baseLineForm: INodeConfig[] = [
  ...toolip,
  {
    name: '',
    type: 'collapse',
    props: {
      label: '图表',
    },
    children: [
      {
        name: 'backgroundColor',
        type: 'color',
        label: '背景色',
      },
      containLabel, // 图表溢出控制
      chartTitle, // 图表标题
      legend, // 图例配置
      {
        name: 'series[]',
        props: {
          label: '折线样式',
        },
        type: 'collapse',
        children: lineSeriesCommin,
      },
    ],
  },
  {
    name: '',
    type: 'collapse',
    props: {
      label: '坐标轴',
    },
    children: [
      {
        name: 'xAxis[]',
        type: 'collapse',
        props: {
          label: 'X轴样式',
        },
        children: axis,
      },
      {
        name: 'yAxis[]',
        type: 'collapse',
        props: {
          label: 'Y轴样式',
        },
        children: axis,
      },
    ],
  },
];

export default baseLineForm;
