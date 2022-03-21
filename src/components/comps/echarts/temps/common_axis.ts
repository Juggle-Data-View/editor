export const xAxis = (name = 'x') => {
  return {
    show: true,
    name: name,
    fieldName: name,
    type: 'category',
    axisLine: {
      lineStyle: {
        width: 1,
        color: '#979797',
      },
    },
    nameTextStyle: {
      color: '#222',
      fontWeight: 'normal',
      fontFamily: 'FZLTTHJW',
      fontSize: 12,
    },
    nameRotate: 0,
    axisLabel: {
      show: true,
      rotate: 0,
      color: '#222',
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
        color: '#222',
        type: 'solid',
      },
    },
  };
};

export const yAxis = (name = 'y') => {
  return {
    show: true,
    name: name,
    fieldName: name,
    type: 'value',
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
      color: '#222',
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
      color: '#222',
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
        color: '#222',
        type: 'solid',
      },
    },
  };
};
