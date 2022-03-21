import radar from './configs/templates/radar';
import { AutoDV } from 'auto-dv-type';
import radarConfig from './temps/radar';

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
    config: radarConfig.config,
    dataConfig: {
      fieldMap: [
        {
          compFieldName: 'y1',
          sourceFieldName: 'order',
        },
      ],
    },
  },
  forms: {
    type: 'fragment',
    name: 'config.option.echarts',
    children: [...radar, { name: 'notMerge', type: 'switch', label: '重绘' }],
  },
};

export default componentConfig;
