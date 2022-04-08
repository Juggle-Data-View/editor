// import { INodeConfig } from '@juggle-data-view/types/src/form';

import baseLineForm from './configs/templates/baseLineForm';
import baseLineConfig from './temps/base_line';
import { JuggleDV } from '@juggle-data-view/types';

const componentConfig: JuggleDV.CompConfig = {
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
    children: [...baseLineForm, { name: 'notMerge', type: 'switch', label: '重绘' }],
  },
};

export default componentConfig;
