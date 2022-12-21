export const lineSeries = (name = 'y') => {
  return {
    name: name,
    FieldName: name,
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
      color: '#222',
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
  };
};

export const barSeries = (name = 'y') => {
  return {
    name: name,
    FieldName: name,
    type: 'bar',
    itemStyle: {
      color: '#5470c6',
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
      color: '#222',
      fontSize: 12,
      fontFamily: 'FZLTTHJW',
      fontWeight: 'bold',
      position: 'top',
      formatter: `function(data) {
return data.value;
}`,
    },
  };
};

export const pieSeries = {
  name: 'name',
  FieldName: 'name',
  type: 'pie',
  radius: [70, 55],
  color: [
    {
      colorStops: [
        {
          offset: 1,
          color: '#ee6666',
        },
      ],
    },
    {
      colorStops: [
        {
          offset: 1,
          color: '#5470c6',
        },
      ],
    },
    {
      colorStops: [
        {
          offset: 1,
          color: '#91cc75',
        },
      ],
    },
    {
      colorStops: [
        {
          offset: 1,
          color: '#fac858',
        },
      ],
    },
  ],
  label: {
    show: true,
    rotate: 0,
    color: '#222',
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
};
