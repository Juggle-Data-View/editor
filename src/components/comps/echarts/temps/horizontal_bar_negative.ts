/**
 * 组件属性
 */
// let now = Date.now();
const horizontalBarNegative = {
  title: '双向条形图',
  dataConfig: {
    fieldMap: [
      {
        compFieldName: 'y',
        sourceFieldName: 'name',
      },
      {
        compFieldName: 'y1',
        sourceFieldName: 'svalue1',
      },
      {
        compFieldName: 'y2',
        sourceFieldName: 'svalue2',
      },
    ],
  },
  // echartsType: '',
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
          top: '80',
          bottom: '10',
          left: '10',
          right: '30',
        },
        title: {
          text: '我是图表标题',
          backgroundColor: '',
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
          left: '10',
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
        toolbox: {},
        xAxis: [
          {
            show: true,
            name: 'x',
            fieldName: 'x',
            type: 'value',
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
            name: 'Y',
            fieldName: 'y',
            type: 'category',
            showWay: 'sigle',
            inverse: false,
            axisTick: {
              show: false,
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
            nameRotate: 0,
            axisLine: {
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
            name: '右侧系列',
            type: 'bar',
            FieldName: 'y1',
            itemStyle: {
              color: '#50e3c1',
              borderColor: '#00000000',
              borderWidth: 2,
              barBorderRadius: [0, 10, 10, 0],
              // barBorderRadius: 10
            },
            barWidth: '8',
            barGap: '-100%',
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
          {
            name: '左侧系列',
            type: 'bar',
            FieldName: 'y2',
            itemStyle: {
              color: '#71a1ff',
              borderColor: '#00000000',
              borderWidth: 2,
              barBorderRadius: [10, 0, 0, 10],
            },
            barWidth: '8',
            barGap: '-100%',
            showBackground: false,
            backgroundStyle: {
              color: 'rgba(180, 180, 180, 0.2)',
            },
            label: {
              show: false,
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
};

export const staticData = [
  { name: '周一', svalue1: 80, svalue2: -60, svalue3: 40 },
  { name: '周二', svalue1: 60, svalue2: -30, svalue3: 50 },
  { name: '周三', svalue1: 40, svalue2: -60, svalue3: 30 },
  { name: '周四', svalue1: 70, svalue2: -50, svalue3: 50 },
  { name: '周五', svalue1: 30, svalue2: -60, svalue3: 70 },
  { name: '周六', svalue1: 25, svalue2: -50, svalue3: 60 },
];

export default horizontalBarNegative;
