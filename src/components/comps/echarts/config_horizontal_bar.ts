/**
 * 组件配置信息
 */
// import * as font from 'config/form/font';
// import Tabs from 'components/recursion/widget/Tabs';
// import lineBarTemplate from './configs/templates/lineBarForm';
import multiBarForm from './configs/templates/multiBarForm';
import horizontalBar from './temps/horizontal_bar';
// import { Config } from './type';

const componentConfig: AutoDV.CompConfig = {
  version: '1.0.0',
  tab: {
    config: true,
    dataset: true,
  },
  template: {
    title: '条形图',
    dataConfig: {
      fieldMap: [
        {
          compFieldName: 'y',
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
    // echartsType: '',
    attr: {
      left: 0,
      top: 0,
      width: 500,
      height: 300,
    },
    config: horizontalBar.config,
  },
  forms: {
    type: 'fragment',
    name: 'config.option.echarts',
    children: [...multiBarForm, { name: 'notMerge', type: 'switch', label: '重绘' }],
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
