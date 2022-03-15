/**
 * 组件属性
 */

import { xAxis, yAxis } from './common_axis';
import legend from './common_legend';
import { barSeries } from './common_series';
import title from './common_title';
import tooltip from './common_tooltip';

// let now = Date.now();
const multiBarConfig = {
  title: '多系列柱状图',
  dataConfig: {
    fieldMap: [
      {
        compFieldName: 'x',
        sourceFieldName: 'brand',
      },
      {
        compFieldName: 'y1',
        sourceFieldName: 'stock',
      },
      {
        compFieldName: 'y2',
        sourceFieldName: 'order',
      },
    ],
  },
  // echartsType: '',
  attr: {
    left: 0,
    top: 0,
    width: 500,
    height: 300,
  },
  config: {
    option: {
      echarts: {
        notMerge: false,
        backgroundColor: '',
        grid: {
          containLabel: true,
          top: '80',
          bottom: '10',
          left: '10',
          right: '30',
        },
        title,
        tooltip,
        legend,
        toolbox: {},
        xAxis: [xAxis()],
        yAxis: [yAxis()],
        series: [barSeries('y1'), barSeries('y2')],
      },
    },
  },
};

export default multiBarConfig;
