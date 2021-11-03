import { cloneDeep } from 'lodash';
// import { timeAxisHandle } from './timeLine';
import day from 'dayjs';
import numeral from 'numeral';
import notice from 'utils/notice';

const getFormatter = (formatter: string) => {
  try {
    const formatterFunc = new Function(`return ${formatter}`)(); //eslint-disable-line
    if (typeof formatterFunc !== 'function') {
      return formatter;
    }
    return (data: any) => formatterFunc(data, { day, numeral });
  } catch (error) {
    notice.error(error.message);
  }
};

const universalAxis = (axis: any, axisData: any[], echarts: any) => {
  axis = axis.map((axisItem: any, index: number) => {
    const getResult = (data: any) => {
      // console.log(data);
      return {
        ...axisItem,
        data: data,
        axisLabel: {
          ...axisItem.axisLabel,
          formatter: getFormatter(axisItem.axisLabel.formatter),
        },
      };
    };

    return getResult(axisData[index]);
  });
  if (echarts.yAxis[0].showWay && echarts.yAxis[0].showWay !== 'sigle') {
    const value = axis[0];
    axis = [cloneDeep(value), cloneDeep(value), cloneDeep(value)].map((item, index) => {
      item.name = item.name + index;

      if (index > 0) {
        item.gridIndex = index;
        if (item.type !== 'category') {
          return item;
        }
        if (index === 1) {
          item.axisLabel.show = false;
          item.position = 'center';
        }
        if (index === 2) {
          // item.axisLabel.show = true;
          item.position = 'right';
        }
      } else {
        if (item.type !== 'category') {
          return item;
        }
        item.axisLabel.show = false;
        item.position = 'left';
      }
      return item;
    });
  }
  return axis;
};

export default universalAxis;
