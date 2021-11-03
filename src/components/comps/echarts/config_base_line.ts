// import { INodeConfig } from 'components/recursion';

import baseLineForm from './configs/templates/baseLineForm';
import baseLineConfig from './temps/base_line';

const componentConfig: AutoDV.CompConfig = {
  version: '1.0.0',
  tab: {
    config: true,
    dataset: true,
  },
  template: {
    title: '基础折线图',
    attr: {
      left: 0,
      top: 0,
      width: 500,
      height: 300,
    },
    config: baseLineConfig.config,
    dataConfig: {
      fieldMap: [
        {
          compFieldName: 'x',
          sourceFieldName: 'date',
        },
        {
          compFieldName: 'y',
          sourceFieldName: 'value',
        },
      ],
    },
  },
  forms: {
    type: 'fragment',
    name: 'config.option.echarts',
    children: [...baseLineForm, { name: 'notMerge', type: 'switch', label: '重绘' }],
  },
  staticData: [
    {
      date: '周一',
      value: 50,
    },

    {
      date: '周二',
      value: 60,
    },

    {
      date: '周三',
      value: 50,
    },

    {
      date: '周四',
      value: 90,
    },

    {
      date: '周五',
      value: 70,
    },

    {
      date: '周六',
      value: 60,
    },
  ],
};

export default componentConfig;
