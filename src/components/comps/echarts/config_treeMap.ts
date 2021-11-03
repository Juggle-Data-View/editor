import treeMap from './configs/templates/treeMap';

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
    config: {
      option: {
        echarts: {
          backgroundColor: 'rgba(0,0,0,0)',
          color: [
            {
              colorStops: [
                {
                  offset: 1,
                  color: '#137a87',
                },
              ],
            },
            {
              colorStops: [
                {
                  offset: 1,
                  color: '#3a69a8',
                },
              ],
            },
            {
              colorStops: [
                {
                  offset: 1,
                  color: '#26685e',
                },
              ],
            },
            {
              colorStops: [
                {
                  offset: 1,
                  color: '#3f77bb',
                },
              ],
            },
            {
              colorStops: [
                {
                  offset: 1,
                  color: '#20525f',
                },
              ],
            },
            {
              colorStops: [
                {
                  offset: 1,
                  color: '#075c8f',
                },
              ],
            },
          ],
          tooltip: {
            trigger: 'item',
            backgroundColor: 'rgba(50,50,50,0.7)',
            borderColor: '#333',
            borderWidth: 1,
            padding: 5,
            textStyle: {
              color: '#D8D8D8',
              fontSize: 16,
              fontFamily: 'FZLTTHJW',
              fontWeight: 'bold',
            },
          },
          series: [
            {
              name: 'AutoDV',
              FieldName: 'value',
              type: 'treemap',
              width: '100%',
              height: '100%',
              minSize: '0%',
              maxSize: '100%',
              label: {
                show: true,
                rotate: 0,
                color: '#fff',
                fontSize: 16,
                fontFamily: 'FZLTTHJW',
                fontWeight: 'bold',
                ellipsis: true,
              },

              itemStyle: {
                borderColor: '#151630',
                borderWidth: 1,
                gapWidth: 0,
              },
              breadcrumb: {
                show: false,
              },
            },
          ],
          notMerge: false,
        },
      },
    },
    dataConfig: {
      fieldMap: [
        {
          compFieldName: 'name',
          sourceFieldName: 'type',
        },
        {
          compFieldName: 'value',
          sourceFieldName: 'svalue1',
        },
      ],
    },
  },
  forms: {
    type: 'fragment',
    name: 'config.option.echarts',
    children: [...treeMap, { name: 'notMerge', type: 'switch', label: '重绘' }],
  },
  staticData: [
    {
      name: '进口商品热搜词',
      type: '飞利浦剃须刀',
      svalue1: '136293.0',
      typelen: '18',
    },
    {
      name: '进口商品热搜词',
      type: '西门子冰箱',
      svalue1: '82602.0',
      typelen: '15',
    },
    {
      name: '进口商品热搜词',
      type: '索尼耳机',
      svalue1: '52436.0',
      typelen: '12',
    },
    {
      name: '进口商品热搜词',
      type: '平板电脑',
      svalue1: '128630.0',
      typelen: '12',
    },
    {
      name: '进口商品热搜词',
      type: '苹果耳机',
      svalue1: '100574.0',
      typelen: '12',
    },
    {
      name: '进口商品热搜词',
      type: '阿迪达斯',
      svalue1: '163543.0',
      typelen: '12',
    },
    {
      name: '进口商品热搜词',
      type: '耐克男鞋',
      svalue1: '98786.0',
      typelen: '12',
    },
    {
      name: '进口商品热搜词',
      type: 'apple watch',
      svalue1: '54273.0',
      typelen: '11',
    },
    {
      name: '进口商品热搜词',
      type: 'macbook pro',
      svalue1: '74781.0',
      typelen: '11',
    },
    {
      name: '进口商品热搜词',
      type: '洗碗机',
      svalue1: '73632.0',
      typelen: '9',
    },
    {
      name: '进口商品热搜词',
      type: '卫生巾',
      svalue1: '59364.0',
      typelen: '9',
    },
    {
      name: '进口商品热搜词',
      type: 'ipad air3',
      svalue1: '198210.0',
      typelen: '9',
    },
    {
      name: '进口商品热搜词',
      type: '防晒霜',
      svalue1: '45306.0',
      typelen: '9',
    },
    {
      name: '进口商品热搜词',
      type: '安德玛',
      svalue1: '73261.0',
      typelen: '9',
    },
    {
      name: '进口商品热搜词',
      type: '纸尿裤',
      svalue1: '58178.0',
      typelen: '9',
    },
    {
      name: '进口商品热搜词',
      type: '冰箱',
      svalue1: '190168.0',
      typelen: '6',
    },
    {
      name: '进口商品热搜词',
      type: '电视',
      svalue1: '140788.0',
      typelen: '6',
    },
    {
      name: '进口商品热搜词',
      type: '香水',
      svalue1: '55015.0',
      typelen: '6',
    },
    {
      name: '进口商品热搜词',
      type: '乐高',
      svalue1: '101577.0',
      typelen: '6',
    },
  ],
};

export default componentConfig;
