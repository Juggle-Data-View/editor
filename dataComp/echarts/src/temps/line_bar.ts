/**
 * 组件属性
 */

import { xAxis, yAxis } from './common_axis';
import grid from './common_grid';
import legend from './common_legend';
import { barSeries, lineSeries } from './common_series';
import title from './common_title';
import tooltip from './common_tooltip';

// let now = Date.now();
const lineBarConfig = {
  title: '折线柱状图',
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
        grid,
        title,
        tooltip,
        legend,
        xAxis: [xAxis()],
        yAxis: [yAxis()],
        series: [barSeries('y1'), barSeries('y2'), lineSeries('y3')],
      },
    },
  },
  dataConfig: {
    fieldMap: [
      {
        compFieldName: 'x',
        sourceFieldName: 'brand',
      },
      {
        compFieldName: 'y1',
        sourceFieldName: 'order',
      },
      {
        compFieldName: 'y2',
        sourceFieldName: 'stock',
      },
      {
        compFieldName: 'y3',
        sourceFieldName: 'procurement',
      },
    ],
  },
};

export default lineBarConfig;
