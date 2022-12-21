import pie from './configs/templates/pie';
import { JuggleDV } from '@juggle-data-view/types';
import pieConfig from './temps/pie';

const componentConfig: JuggleDV.CompConfig = {
  version: '1.0.0',
  tab: {
    config: true,
    dataset: true,
  },
  template: {
    title: '圆环图',
    attr: {
      left: 0,
      top: 0,
      width: 500,
      height: 300,
    },
    config: pieConfig.config,
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
  },
  forms: {
    type: 'fragment',
    name: 'config.option.echarts',
    children: [...pie, { name: 'notMerge', type: 'switch', label: '重绘' }],
  },
};

export default componentConfig;
