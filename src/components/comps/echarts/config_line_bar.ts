/**
 * 组件配置信息
 */
// import * as font from 'config/form/font';
// import Tabs from '@components/recursion/widget/Tabs';
import { JuggleDV } from '@juggle-data-view/types';
import lineBarTemplate from './configs/templates/lineBarForm';
import lineBarConfig from './temps/line_bar';
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
    config: lineBarConfig.config,
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
  },
  forms: {
    type: 'fragment',
    name: 'config.option.echarts',
    children: [...lineBarTemplate, { name: 'notMerge', type: 'switch', label: '重绘' }],
  },
};

export default componentConfig;
