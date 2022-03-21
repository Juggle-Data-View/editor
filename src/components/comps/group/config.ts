import { AutoDV } from 'auto-dv-type';
const config: AutoDV.CompConfig<any> = {
  version: '1.0.0',
  tab: {
    config: true,
    dataset: false,
  },
  template: {
    title: '分组',
    attr: {
      left: 0,
      top: 0,
      width: 800,
      height: 400,
      angle: 0,
      scale: [1, 1],
    },
    config: {},
    dataConfig: {
      fieldMap: [
        {
          compFieldName: 'url',
          sourceFieldName: '',
        },
      ],
    },
  },
  forms: {
    name: 'config',
    type: 'fragment',
  },

  staticData: [
    {
      url: '',
    },
  ],
};

export default config;
