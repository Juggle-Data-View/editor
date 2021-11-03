/**
 * 组件属性
 */
// let now = Date.now();
const multiLineConfig = {
  title: '多系列折线图',
  dataConfig: {
    fieldMap: [
      {
        compFieldName: 'x',
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
          show: false,
          backgroundColor: '',
          textStyle: {
            fontSize: 12,
            color: '#fff',
            fontFamily: 'FZLTTHJW',
            fontWeight: 'bold',
            textAlign: 'center',
            lineHeight: 1.5,
          },
          top: 20,
          left: 10,
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
          // formatter: `function(params) {
          //   return params.seriesName;
          // }`,
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
          left: '330',
          top: '10',
        },
        toolbox: {},
        xAxis: [
          {
            show: true,
            name: 'x',
            fieldName: 'x',
            boundaryGap: false,
            nameTextStyle: {
              color: '#fff',
              fontWeight: 'normal',
              fontFamily: 'FZLTTHJW',
              fontSize: 12,
            },
            nameRotate: 0,
            type: 'category',
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
            boundaryGap: false,
            splitNumber: 5,
            nameTextStyle: {
              color: '#fff',
              fontWeight: 'normal',
              fontFamily: 'FZLTTHJW',
              fontSize: 12,
            },
            nameRotate: 0,
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
            name: 'y1',
            type: 'line',
            FieldName: 'y1',
            areaStyle: {
              color: 'rgba(0,157,255,0)',
              opacity: 1,
            },
            lineStyle: {
              color: '#84f0f5',
              width: 2,
              type: 'solid',
            },
            label: {
              show: false,
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
              color: '#84f0f5',
              // barBorderRadius: 10
            },
            showSymbol: true,
            symbol: 'circle',
            symbolSize: 8,
            smooth: false,
          },
          {
            name: 'y2',
            FieldName: 'y2',
            type: 'line',
            areaStyle: {
              color: 'rgba(0,157,255,0)',
              opacity: 1,
            },
            lineStyle: {
              color: '#57abf7',
              width: 2,
              type: 'solid',
            },
            label: {
              show: false,
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
              color: '#57abf7',
              // barBorderRadius: 10
            },
            showSymbol: true,
            symbol: 'circle',
            symbolSize: 8,
            smooth: false,
          },
        ],
      },
    },
  },
};

export const staticData = [
  { name: '周一', svalue1: 80, svalue2: 60, svalue3: 40 },
  { name: '周二', svalue1: 60, svalue2: 30, svalue3: 50 },
  { name: '周三', svalue1: 40, svalue2: 60, svalue3: 30 },
  { name: '周四', svalue1: 70, svalue2: 50, svalue3: 50 },
  { name: '周五', svalue1: 30, svalue2: 60, svalue3: 70 },
  { name: '周六', svalue1: 25, svalue2: 50, svalue3: 60 },
];

export default multiLineConfig;
