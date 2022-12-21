/**
 * 组件配置信息
 */
// import * as font from 'config/form/font';
// import Tabs from '@components/recursion/widget/Tabs';
import doubleAxisLineBarForm from './configs/templates/doubleAxisLineBarForm';
import doubleAxisLineBar from './temps/double_axis_line_bar';
import { JuggleDV } from '@juggle-data-view/types';
// import { Config } from './type';

const componentConfig: JuggleDV.CompConfig = {
  version: '1.0.0',
  tab: {
    config: true,
    dataset: true,
  },
  template: {
    title: '折线柱状图',
    attr: {
      left: 0,
      top: 0,
      width: 400,
      height: 300,
      angle: 0,
      scale: [1, 1],
    },
    config: doubleAxisLineBar.config,
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
  },
  forms: {
    type: 'fragment',
    name: 'config.option.echarts',
    children: [...doubleAxisLineBarForm, { name: 'notMerge', type: 'switch', label: '重绘' }],
  },
};

export default componentConfig;
