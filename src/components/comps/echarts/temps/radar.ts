const radarConfig = {
  title: '雷达图',
  attr: {
    left: 0,
    top: 0,
    width: 500,
    height: 300,
  },
  dataConfig: {
    fieldMap: [
      {
        compFieldName: 'y1',
        sourceFieldName: 'order',
      },
    ],
  },
  config: {
    option: {
      echarts: {
        notMerge: false,
        backgroundColor: '',
        legend: {
          show: false,
          textStyle: {
            fontSize: 12,
            color: '#fff',
            fontFamily: 'FZLTTHJW',
            fontWeight: 'bold',
            textAlign: 'center',
            lineHeight: 1.5,
          },
          top: '20',
          left: '330',
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
        radar: {
          name: {
            textStyle: {
              color: '#D8D8D8',
              fontSize: 12,
              fontFamily: 'FZLTTHJW',
              fontWeight: 'bold',
            },
          },
          indicator: [{ name: '销售' }, { name: '管理' }, { name: '信息技术' }, { name: '客服' }, { name: '研发' }],
          shape: 'circle',
          startAngle: 90,
          splitNumber: 5,
          radius: ['0%', '75%'],
          center: ['50%', '50%'],
          max: 70,
          min: 0,
          textStyle: {
            color: '#D8D8D8',
            fontSize: 12,
            fontFamily: 'FZLTTHJW',
            fontWeight: 'bold',
          },

          splitLine: {
            lineStyle: {
              color: 'rgba(238, 197, 102, 1)',
              width: 1,
              type: 'solid',
            },
          },
          axisLabel: {
            show: false,
            rotate: 0,
            color: '#D8D8D8',
            fontSize: 12,
            fontFamily: 'FZLTTHJW',
            fontWeight: 'bold',
          },
          splitArea: {
            show: false,
          },
          axisLine: {
            lineStyle: {
              color: 'rgba(238, 197, 102,1)',
              width: 1,
              type: 'solid',
            },
          },
        },
        series: [
          {
            type: 'radar',
            name: 'y1',
            FieldName: 'y1',
            lineStyle: {
              color: 'rgba(238, 197, 102,1)',
              width: 1,
              type: 'solid',
            },
            itemStyle: {
              color: '#21D9FF',
              barBorderRadius: [10, 10, 10, 10],
            },
            symbol: 'circle',
            symbolSize: 1,
            areaStyle: {
              color: 'rgba(238, 197, 102,0.2)',
            },
            label: {
              show: false,
              rotate: 0,
              color: '#D8D8D8',
              fontSize: 12,
              fontFamily: 'FZLTTHJW',
              fontWeight: 'bold',
            },
          },
        ],
      },
    },
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
];

export default radarConfig;
