import { xAxis, yAxis } from './common_axis';
import grid from './common_grid';
import legend from './common_legend';
import { barSeries } from './common_series';
import title from './common_title';
import tooltip from './common_tooltip';

// let now = Date.now();
const horizontalBarNegative = {
  title: '双向条形图',
  dataConfig: {
    fieldMap: [
      {
        compFieldName: 'y',
        sourceFieldName: 'name',
      },
      {
        compFieldName: 'y1',
        sourceFieldName: 'svalue1',
      },
      {
        compFieldName: 'y2',
        sourceFieldName: 'svalue2',
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
        xAxis: [{ ...xAxis(), type: 'value' }],
        yAxis: [{ ...yAxis(), type: 'category' }],
        series: [barSeries('y1'), { ...barSeries('y2'), barGap: '-100%' }],
      },
    },
  },
};

export default horizontalBarNegative;
