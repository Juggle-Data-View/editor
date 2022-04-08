import multiBarForm from './configs/templates/multiBarForm';
import { JuggleDV } from '@juggle-data-view/types';
import multiBarConfig from './temps/multi_bar';

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
    config: multiBarConfig.config,
    dataConfig: {
      fieldMap: [
        {
          compFieldName: 'x',
          sourceFieldName: 'brand',
        },
        {
          compFieldName: 'y1',
          sourceFieldName: 'procurement',
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
    children: [...multiBarForm, { name: 'notMerge', type: 'switch', label: '重绘' }],
  },
};

export default componentConfig;
