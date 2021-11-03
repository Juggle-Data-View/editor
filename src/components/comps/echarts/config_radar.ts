import radar from './configs/templates/radar';
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
