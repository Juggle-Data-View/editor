import pieHandle from './seriesHandles/pie';
import funnelHandle from './seriesHandles/funnel';
import radarHandle from './seriesHandles/radar';
import generalHandle from './seriesHandles/general';
import treemap from './seriesHandles/treemap';
import { cloneDeep } from 'lodash';
import { Angle2Matrix } from 'utils';

import { handleSeriesMarkPoint } from './markpoint';
import getFormatter from './getFormatter';

const isHandleFunctionString = (fnString: string) => {
  return fnString.includes('function');
};

const handleSeriesLabel = (label: any) => {
  if (label && label.formatter && isHandleFunctionString(label.formatter)) {
    label.formatter = getFormatter(label.formatter); //eslint-disable-line
  }
};

// const formatColor = (style:any) =>{
// if (style) {
//   if (style.color) {
//     if (style.color.type) {
//       style.color = {
//         ...style.color,
//         ...Angle2Matrix(style.color.angle),
//       };
//     }
//   }
// }
// }

const handleSeriesItemStyle = (seriesItem: any) => {
  const { itemStyle, lineStyle, areaStyle } = seriesItem;
  if (itemStyle) {
    if (itemStyle.color) {
      if (itemStyle.color.type) {
        seriesItem.itemStyle.color = {
          ...itemStyle.color,
          ...Angle2Matrix(itemStyle.color.angle),
        };
      }
    }
  }
  if (lineStyle) {
    if (lineStyle.color.type) {
      seriesItem.lineStyle.color = {
        ...lineStyle.color,
        ...Angle2Matrix(lineStyle.color.angle),
      };
    }
  }
  if (areaStyle) {
    if (areaStyle.color.type) {
      seriesItem.areaStyle.color = {
        ...areaStyle.color,
        ...Angle2Matrix(areaStyle.color.angle),
      };
    }
  }
  return seriesItem;
};

const universalSeries = (series: any, sourceData: any[], echartOption: any, axisData: any[][]) => {
  series = series.map((seriesItem: any) => {
    if (seriesItem.type === 'pie') {
      pieHandle(seriesItem, sourceData);
    } else if (seriesItem.type === 'funnel') {
      handleSeriesLabel(seriesItem.label);
      funnelHandle(seriesItem, sourceData);
    } else if (seriesItem.type === 'radar') {
      radarHandle(seriesItem, sourceData, echartOption);
    } else if (seriesItem.type === 'treemap') {
      treemap(seriesItem, sourceData);
    } else {
      handleSeriesLabel(seriesItem.label);
      generalHandle(seriesItem, sourceData, axisData);
      seriesItem = handleSeriesItemStyle(seriesItem);
      handleSeriesMarkPoint(seriesItem, sourceData);
    }

    return seriesItem;
  });
  if (echartOption.yAxis && echartOption.yAxis[0].showWay === 'split') {
    return [...series, cloneDeep(series[1])].map((item, index) => {
      item.name = item.name + index;
      if (index > 0) {
        item.xAxisIndex = index;
        item.yAxisIndex = index;
      }
      return item;
    });
  } else {
    return series;
  }
};

export default universalSeries;
