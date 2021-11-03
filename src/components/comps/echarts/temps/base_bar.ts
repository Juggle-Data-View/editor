/**
 * 组件属性
 */
// let now = Date.now();
const baseBarConfig = {
  title: '基础柱状图',
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
          appendToBody: true,
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
        legend: {
          show: false,
        },
        toolbox: {},
        xAxis: [
          {
            show: true,
            name: 'x',
            fieldName: 'x',
            nameRotate: 0,
            type: 'category',
            scale: true,
            axisLine: {
              show: true,
              lineStyle: {
                width: 1,
                color: '#979797',
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
            axisTick: {
              show: true,
              inside: false,
              length: 5,
              lineStyle: {
                color: '',
                width: 1,
              },
            },
            nameTextStyle: {
              color: '#fff',
              fontWeight: 'normal',
              fontFamily: 'FZLTTHJW',
              fontSize: 12,
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
            nameTextStyle: {
              color: '#fff',
              fontWeight: 'normal',
              fontFamily: 'FZLTTHJW',
              fontSize: 12,
            },
            nameRotate: 0,
            boundaryGap: false,
            splitNumber: 5,
            scale: false,
            axisLine: {
              show: true,
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
        series: [
          {
            name: 'y',
            FieldName: 'y',
            type: 'bar',
            itemStyle: {
              color: '#21D9FF',
              borderColor: '#00000000',
              borderWidth: 2,
              barBorderRadius: [10, 10, 0, 0],
            },
            barWidth: '20',
            barCategoryGap: '30%',
            showBackground: false,
            backgroundStyle: {
              color: 'rgba(180, 180, 180, 0.2)',
            },
            label: {
              show: true,
              rotate: 0,
              color: '#D8D8D8',
              fontSize: 12,
              fontFamily: 'FZLTTHJW',
              fontWeight: 'bold',
              position: 'top',
              formatter: `function(data) {
  return data.value;
}`,
            },
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
    value: 80,
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
    value: 60,
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
export default baseBarConfig;
