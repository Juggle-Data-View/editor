/**
 * 组件属性
 */

// import data from '../../material/data';

// let now = Date.now();
const baseLineConfig = {
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
        notMerge: false,
        backgroundColor: '',
        legend: {
          show: false,
        },
        grid: {
          containLabel: true,
          top: '50',
          bottom: '10',
          left: '10',
          right: '30',
        },
        tooltip: {
          show: true,
          trigger: 'axis',
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
        xAxis: [
          {
            show: true,
            name: 'x',
            fieldName: 'x',
            type: 'category',
            nameTextStyle: {
              color: '#fff',
              fontWeight: 'normal',
              fontFamily: 'FZLTTHJW',
              fontSize: 12,
            },
            nameRotate: 0,
            axisLine: {
              lineStyle: {
                width: 1,
                color: '#979797',
              },
            },
            axisTick: {
              show: true,
              inside: false,
              length: 5,
              lineStyle: {
                color: '',
                width: 1,
              },
            },
            axisLabel: {
              show: true,
              rotate: 0,
              color: '#D8D8D8',
              fontSize: 12,
              fontFamily: 'FZLTTHJW',
              fontWeight: 'bold',
              formatter: `function(data) {
  return data;
}`,
            },
            splitLine: {
              show: false,
              lineStyle: {
                width: 1,
                color: '#fff',
                type: 'solid',
              },
            },
          },
        ],
        yAxis: [
          {
            show: true,
            type: 'value',
            name: 'Y',
            fieldName: 'Y',
            splitNumber: 5,
            axisLine: {
              lineStyle: {
                width: 1,
                color: '#979797',
              },
            },
            nameTextStyle: {
              color: '#fff',
              fontWeight: 'normal',
              fontFamily: 'FZLTTHJW',
              fontSize: 12,
            },
            nameRotate: 0,
            axisLabel: {
              show: true,
              rotate: 0,
              formatter: `function(data) {
  return data;
}`,
              fontSize: 12,
              fontFamily: 'FZLTTHJW',
              fontWeight: 'bold',
            },
            axisTick: {
              show: true,
              inside: false,
              length: 5,
              lineStyle: {
                color: '',
                width: 1,
              },
            },
            splitLine: {
              show: false,
              lineStyle: {
                width: 1,
                color: '#fff',
                type: 'solid',
              },
            },
          },
        ],
        series: [
          {
            name: 'y',
            FieldName: 'y',
            type: 'line',
            stack: '总量',
            areaStyle: {
              color: 'rgba(0,157,255,0.2)',
              opacity: 1,
            },
            lineStyle: {
              color: '#009DFF',
              width: 2,
              type: 'solid',
            },
            label: {
              show: true,
              rotate: 0,
              color: '#D8D8D8',
              fontSize: 12,
              fontFamily: 'FZLTTHJW',
              fontWeight: 'bold',
              formatter: `function(data) {
                return data.value;
}`,
            },
            itemStyle: {
              color: '#21D9FF',
              barBorderRadius: [10, 10, 10, 10],
            },
            showSymbol: true,
            symbol: 'circle',
            symbolSize: 8,
            smooth: true,
            formatter: `function(data) {
                return data.value;
}`,
          },
        ],
      },
    },
  },
  dataConfig: {
    fieldMap: [
      {
        compFieldName: 'x',
        sourceFieldName: 'date',
      },
      {
        compFieldName: 'y',
        sourceFieldName: 'value',
      },
    ],
  },
};

export const staticData = [
  {
    date: '周一',
    value: 50,
  },

  {
    date: '周二',
    value: 60,
  },

  {
    date: '周三',
    value: 50,
  },

  {
    date: '周四',
    value: 90,
  },

  {
    date: '周五',
    value: 70,
  },

  {
    date: '周六',
    value: 60,
  },
];

export default baseLineConfig;
