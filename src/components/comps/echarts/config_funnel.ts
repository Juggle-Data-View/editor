import funnel from './configs/templates/funnel';

const componentConfig: AutoDV.CompConfig = {
  version: '1.0.0',
  tab: {
    config: true,
    dataset: true,
  },
  template: {
    title: '漏斗图',
    attr: {
      left: 0,
      top: 0,
      width: 500,
      height: 300,
    },
    config: {
      option: {
        echarts: {
          backgroundColor: '',
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
            formatter: `function(params) {
  return params.seriesName;
}`,
          },
          legend: {
            orient: 'vertical',
            show: false,
            left: 0,
            top: 0,
            textStyle: {
              color: '#D8D8D8',
              fontSize: 16,
              fontFamily: 'FZLTTHJW',
              fontWeight: 'bold',
              textAlign: 'center',
            },
          },
          calculable: true,
          color: [
            {
              colorStops: [
                {
                  offset: 1,
                  color: '#215ae6',
                },
              ],
            },
            {
              colorStops: [
                {
                  offset: 1,
                  color: '#441afb',
                },
              ],
            },
            {
              colorStops: [
                {
                  offset: 1,
                  color: '#73c6f5',
                },
              ],
            },
            {
              colorStops: [
                {
                  offset: 1,
                  color: '#ea8326',
                },
              ],
            },
            {
              colorStops: [
                {
                  offset: 1,
                  color: '#259d26',
                },
              ],
            },
          ],
          series: [
            {
              name: 'name',
              FieldName: 'value',
              type: 'funnel',
              left: '10%',
              top: 60,
              bottom: 60,
              width: '80%',
              minSize: '0%',
              maxSize: '100%',
              sort: 'descending',
              gap: 2,
              label: {
                show: true,
                rotate: 0,
                position: 'inside',
                color: '#D8D8D8',
                fontSize: 16,
                fontFamily: 'FZLTTHJW',
                fontWeight: 'bold',
                formatter: 'function(data){ return data.value }',
              },
              labelLine: {
                length: 10,
                lineStyle: {
                  width: 1,
                  type: 'solid',
                },
              },
              color: [
                {
                  colorStops: [
                    {
                      offset: 1,
                      color: '#215ae6',
                    },
                  ],
                },
                {
                  colorStops: [
                    {
                      offset: 1,
                      color: '#441afb',
                    },
                  ],
                },
                {
                  colorStops: [
                    {
                      offset: 1,
                      color: '#73c6f5',
                    },
                  ],
                },
                {
                  colorStops: [
                    {
                      offset: 1,
                      color: '#ea8326',
                    },
                  ],
                },
                {
                  colorStops: [
                    {
                      offset: 1,
                      color: '#259d26',
                    },
                  ],
                },
              ],
              itemStyle: {
                borderColor: '#fff',
                borderWidth: 1,
              },
              emphasis: {
                label: {
                  show: true,
                  rotate: 0,
                  color: '#D8D8D8',
                  fontSize: 12,
                  fontFamily: 'FZLTTHJW',
                  fontWeight: 'bold',
                },
              },
            },
          ],
        },
      },
    },
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
    children: [...funnel, { name: 'notMerge', type: 'switch', label: '重绘' }],
  },
  staticData: [
    {
      brand: '海天',
      order: 40,
    },
    {
      brand: '王老吉',
      order: 50,
    },
    {
      brand: '恒源祥',
      order: 60,
    },
    {
      brand: '光明',
      order: 70,
    },
    {
      brand: '蒙牛',
      order: 80,
    },
  ],
};

export default componentConfig;
