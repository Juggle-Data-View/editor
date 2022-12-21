/**
 * 组件属性
 */

import legend from './common_legend';
import tooltip from './common_tooltip';
import { xAxis, yAxis } from './common_axis';
import grid from './common_grid';
import { lineSeries } from './common_series';
import title from './common_title';

// let now = Date.now();
const doubleAxisLineBar = {
  title: '双轴折线柱图',
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
        grid: grid,
        title: title,
        tooltip: tooltip,
        legend: legend,
        toolbox: {},
        xAxis: [xAxis('x')],
        yAxis: [yAxis('y1'), yAxis('y2')],
        series: [
          { ...lineSeries('y1'), yAxisIndex: 0 },
          { ...lineSeries('y2'), yAxisIndex: 1 },
        ],
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
    ],
  },
};

export default doubleAxisLineBar;
