/**
 * 组件属性
 */

import { xAxis, yAxis } from './common_axis';
import grid from './common_grid';
import legend from './common_legend';
import { lineSeries } from './common_series';
import title from './common_title';
import tooltip from './common_tooltip';

// let now = Date.now();
const multiLineConfig = {
  title: '多系列折线图',
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
        grid,
        title,
        tooltip,
        legend,
        xAxis: [xAxis()],
        yAxis: [yAxis()],
        series: [lineSeries('y1'), lineSeries('y2')],
      },
    },
  },
};

export default multiLineConfig;
