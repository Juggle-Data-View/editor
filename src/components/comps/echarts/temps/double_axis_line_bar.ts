/**
 * 组件属性
 */
// let now = Date.now();
const doubleAxisLineBar = {
  title: '双轴折线柱图',
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
          show: false,
          text: '我是图表标题',
          backgroundColor: 'rgba(255,255,255,1)',
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
          borderColor: 'red',
        },
        toolbox: {},
        xAxis: [
          {
            show: true,
            name: 'x',
            fieldName: 'x',
            type: 'category',
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
            type: 'value',
            name: 'Y1',
            fieldName: 'Y1',
            nameTextStyle: {
              color: '#fff',
              fontWeight: 'normal',
              fontFamily: 'FZLTTHJW',
              fontSize: 12,
            },
            nameRotate: 0,
            boundaryGap: false,
            splitNumber: 5,
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
          {
            show: true,
            type: 'value',
            name: 'Y2',
            fieldName: 'Y2',
            nameTextStyle: {
              color: '#fff',
              fontWeight: 'normal',
              fontFamily: 'FZLTTHJW',
              fontSize: 12,
            },
            nameRotate: 0,
            boundaryGap: false,
            splitNumber: 5,
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
            type: 'bar',
            FieldName: 'y1',
            itemStyle: {
              color: '#21D9FF',
              borderColor: '#00000000',
              borderWidth: 2,
              barBorderRadius: [10, 10, 10, 10],
            },
            showBackground: false,
            backgroundStyle: {
              color: 'rgba(180, 180, 180, 0.2)',
            },
            yAxisIndex: 0,
            barWidth: '20',
            barGap: '30%',
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
            name: 'y2',
            yAxisIndex: 1,
            FieldName: 'y2',
            type: 'line',
            symbol: 'circle',
            symbolSize: 4,
            showSymbol: true,
            smooth: false,
            lineStyle: {
              color: '#009DFF',
              width: 2,
              type: 'solid',
            },
            itemStyle: {
              color: '#21D9FF',
              // barBorderRadius: 10
            },
            areaStyle: {
              color: 'rgba(0,0,0,0)',
              opacity: 1,
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
        sourceFieldName: 'brand',
      },
      {
        compFieldName: 'y1',
        sourceFieldName: 'order',
      },
      {
        compFieldName: 'y2',
        sourceFieldName: 'stock',
      },
    ],
  },
};

export default doubleAxisLineBar;
