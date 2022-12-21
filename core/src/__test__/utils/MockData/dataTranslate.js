export const state = {
  mockData: [
    {
      labels: '北京,新疆',
      from: [116.404844, 39.91405],
      to: [84.9023, 42.148],
      size: 10,
      tooltip: '我是tooltip',
    },
    {
      labels: '北京,西藏',
      from: [116.404844, 39.91405],
      to: [87.8695, 31.6846],
      size: 15,
      tooltip: '我是西藏',
    },
    {
      labels: '北京,内蒙古',
      from: [116.404844, 39.914],
      to: [112.5977, 41.3408],
      size: 20,
      tooltip: '我是内蒙古',
    },
    {
      labels: '北京,四川',
      from: [116.404844, 39.91405],
      to: [101.9199, 30.1904],
      size: 15,
      tooltip: '我是四川',
    },
    {
      labels: '北京,黑龙江',
      from: [116.404844, 39.91405],
      to: [126.1445, 48.7156],
      size: 10,
      tooltip: '我是黑龙江',
    },
  ],
  fieldMap: [
    {
      compFieldName: 'to',
      sourceFieldName: 'to',
    },
    {
      compFieldName: 'from',
      sourceFieldName: 'from',
    },
    {
      compFieldName: 'text',
      sourceFieldName: 'province',
    },
  ],
  wrongFormateFieldMap: [
    {
      compFieldName: 'to',
    },
    {
      compFieldName: 'from',
    },
  ],
};
