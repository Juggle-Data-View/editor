import grid from './common_grid';
import { pieSeries } from './common_series';
import tooltip from './common_tooltip';

const pieConfig = {
  title: '环状饼图',
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
        tooltip: tooltip,
        series: [pieSeries],
      },
    },
  },
  dataConfig: {
    fieldMap: [
      {
        compFieldName: 'name',
        sourceFieldName: 'brand',
      },
      {
        compFieldName: 'value',
        sourceFieldName: 'order',
      },
    ],
  },
};

export default pieConfig;
