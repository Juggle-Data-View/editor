const pieConfig = {
  title: '环状饼图',
  attr: {
    left: 0,
    top: 0,
    width: 500,
    height: 300,
  },
  config: {
    option: {
      echarts: {
        // legend: {
        // orient: 'vertical',
        // left: 'left'
        // data: ['市场', '销售', '管理', '视频广告', '搜索引擎']
        // },
        notMerge: false,
        backgroundColor: '',
        grid: {
          containLabel: true,
          top: '50',
          bottom: '10',
          left: '10',
          right: '10',
        },
        tooltip: {
          show: true,
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
            name: 'name',
            FieldName: 'name',
            type: 'pie',
            radius: [70, 55],
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
                    color: '#718eff',
                  },
                ],
              },
              {
                colorStops: [
                  {
                    offset: 1,
                    color: '#12a8fe',
                  },
                ],
              },
            ],
            label: {
              show: true,
              rotate: 0,
              color: '#D8D8D8',
              fontSize: 12,
              fontFamily: 'FZLTTHJW',
              fontWeight: 'bold',
              formatter: '{b}\n{d}%',
            },
            labelLine: {
              show: true,
              length: 55,
              length2: 25,
              smooth: true,
              // lineStyle:{

              // }
            },
            itemStyle: {
              emphasis: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)',
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
};

export const staticData = [
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
    order: 60,
    stock: 40,
    procurement: 50,
  },
  {
    brand: '光明',
    order: 70,
    stock: 50,
    procurement: 60,
  },
  {
    brand: '蒙牛',
    order: 80,
    stock: 60,
    procurement: 10,
  },
];

export default pieConfig;
