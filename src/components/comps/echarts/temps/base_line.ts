/**
 * 组件属性
 */

import { xAxis, yAxis } from './common_axis';
import grid from './common_grid';
import legend from './common_legend';
import { lineSeries } from './common_series';
import tooltip from './common_tooltip';

// import data from '../../material/data';

// let now = Date.now();
const baseLineConfig = {
  title: '基础折线图',
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
        legend,
        grid,
        tooltip,
        xAxis: [xAxis()],
        yAxis: [yAxis()],
        series: [lineSeries()],
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
        compFieldName: 'y',
        sourceFieldName: 'stock',
      },
    ],
  },
};

export default baseLineConfig;
