// import { INodeConfig } from 'components/recursion';

import baseBarForm from './configs/templates/baseBarForm';
import baseBarConfig from './temps/base_bar';

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
    config: baseBarConfig.config,
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
  },
  forms: {
    type: 'fragment',
    name: 'config.option.echarts',
    children: [...baseBarForm, { name: 'notMerge', type: 'switch', label: '重绘' }],
  },
};

export default componentConfig;
