/**
 * 组件属性
 */

import { xAxis, yAxis } from './common_axis';
import grid from './common_grid';
import { barSeries } from './common_series';
import tooltip from './common_tooltip';

// let now = Date.now();
const baseBarConfig = {
  title: '基础柱状图',
  config: {
    option: {
      echarts: {
        notMerge: false,
        backgroundColor: '',
        grid,
        tooltip,
        legend: {
          show: false,
        },
        toolbox: {},
        xAxis: [xAxis()],
        yAxis: [yAxis()],
        series: [barSeries()],
      },
    },
  },
};

export default baseBarConfig;
