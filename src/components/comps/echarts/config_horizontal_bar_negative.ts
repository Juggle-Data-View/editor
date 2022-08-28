/**
 * 组件配置信息
 */
// import * as font from 'config/form/font';
// import Tabs from '@components/recursion/widget/Tabs';
// import lineBarTemplate from './configs/templates/lineBarForm';
import { JuggleDV } from '@juggle-data-view/types';
import multiBarForm from './configs/templates/multiBarForm';
import horizontalBarNegative from './temps/horizontal_bar_negative';
// import { Config } from './type';

const componentConfig: JuggleDV.CompConfig = {
  version: '1.0.0',
  tab: {
    config: true,
    dataset: true,
  },
  template: {
    title: '双向条形图',
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
    config: horizontalBarNegative.config,
  },
  forms: {
    type: 'fragment',
    name: 'config.option.echarts',
    children: [...multiBarForm, { name: 'notMerge', type: 'switch', label: '重绘' }],
  },
};

export default componentConfig;
