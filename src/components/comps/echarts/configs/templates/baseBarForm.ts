import { INodeConfig } from '@juggle-data-view/types/src/form';

import axis from '../common/axis';
import toolip from '../common/tooltip';
import axisLabel from '../common/axisLabel';
import chartTitle from '../common/chartTitle';
import containLabel from '../common/containLabel';
import legend from '../common/legend';
// import lineSeriesCommin from '../common/linesSeriesCommon';
import multiBarSeries from '../multiBarSeries';

function getMultiBarSeries() {
  const result: INodeConfig = {
    ...multiBarSeries,
    children: [
      ...(multiBarSeries.children as INodeConfig[]),
      {
        name: 'itemStyle.color',
        type: 'color',
        props: {
          useGradient: true,
        },
        // label: 'COLOR',
        label: ({ getValue, name }) => {
          const seriesItem = getValue(name, '../../');
          if (seriesItem.type === 'line') {
            return '数据点颜色';
          } else {
            return '柱条颜色';
          }
        },
      },
      {
        name: 'showBackground',
        type: 'switch',
        label: '柱形背景',
      },
      {
        name: 'backgroundStyle.color',
        type: 'color',
        label: '柱形背景颜色',
      },
      {
        name: 'label',
        type: 'collapse',
        props: {
          label: '值标签',
        },
        children: axisLabel,
      },
    ],
  };
  return result;
}

const baseBarForm: INodeConfig[] = [
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
      getMultiBarSeries(),
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

export default baseBarForm;
