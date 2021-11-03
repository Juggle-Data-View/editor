/**
 * 组件配置信息
 */
// import * as font from 'config/form/font';
// import Tabs from 'components/recursion/widget/Tabs';
import doubleAxisLineBarForm from './configs/templates/doubleAxisLineBarForm';
import doubleAxisLineBar from './temps/double_axis_line_bar';
// import { Config } from './type';

const componentConfig: AutoDV.CompConfig = {
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
  staticData: [
    {
      brand: '海天',
      order: 40,
      stock: 120,
      procurement: 90,
    },
    {
      brand: '王老吉',
      order: 50,
      stock: 100,
      procurement: 20,
    },
    {
      brand: '恒源祥',
      order: 50,
      stock: 40,
      procurement: 50,
    },
    {
      brand: '光明',
      order: 60,
      stock: 50,
      procurement: 60,
    },
    {
      brand: '蒙牛',
      order: 70,
      stock: 60,
      procurement: 10,
    },
  ],
};

export default componentConfig;
