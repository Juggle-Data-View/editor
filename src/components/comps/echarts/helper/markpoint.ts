import { EChartOption } from 'echarts';
import { CSSProperties } from 'styled-components';
import getFormatter from './getFormatter';

export const handleSeriesMarkPoint = (
  seriesItem: EChartOption.SeriesLines & {
    isShowMarkPoint?: boolean;
    markPointMirror?: any;
  },
  sourceData: any[]
) => {
  const { markPoint, data, isShowMarkPoint } = seriesItem;
  if (!isShowMarkPoint) {
    delete seriesItem.markPoint;
    return seriesItem;
  }
  if (!markPoint) {
    return seriesItem;
  }
  if (!data) {
    return seriesItem;
  }
  // seriesItemmar.symbol = `image://${seriesItem.symbol}`;

  const markPointData = sourceData
    .map((item, index) => {
      if (!('type' in item)) {
        return null;
      } else {
        if (item['type'] === 'key') {
          return {
            name: item.x,
            value: (markPoint as any).markPointContent,
            xAxis: index,
            yAxis: (data[index] as any).value,
          };
        } else {
          return null;
        }
      }
    })
    .filter((item) => item !== null);
  const oldData: any[] = (markPoint.data as any) || [];
  if (markPoint.label) {
    markPoint.label.formatter = getFormatter(markPoint.label.formatter as string);
  }
  const markPointConfig = {
    ...markPoint,
    data: [...oldData, ...(markPointData as any)] as any,
    symbol: !markPoint.symbol?.includes('http') ? markPoint.symbol : `image://${markPoint.symbol}`,
  };
  if ((markPoint as any).type === 'canvas') {
    seriesItem.markPoint = markPointConfig;
  } else {
    seriesItem.markPointMirror = markPointConfig;
  }
};

export interface MarkPointType {
  label: CSSProperties;
  rect: CSSProperties;
  content: string;
  isShow: boolean;
}

export const getMarkPoints = (series: any[], sourceData: any[], echartsIns: any) => {
  const result: MarkPointType[] = [];
  const markPointXCoords = sourceData.reduce<number[]>(
    (prev, curr, index) => (curr.type === 'key' ? [...prev, index] : [...prev]),
    []
  );
  series.forEach((seriesItem, index) => {
    // const markPointYCoords = item.data[]
    if (!('markPoint' in seriesItem)) {
      return;
    }
    markPointXCoords.forEach((xcoords) => {
      if (!seriesItem.data[xcoords].name) {
        //数据时间筛选兼容
        return;
      }
      const seriesData = seriesItem.data[xcoords].name.value;
      const { label, symbolSize: size, symbol, symbolOffset, type } = seriesItem.markPoint;
      const formatter = getFormatter(label.formatter);
      if (!formatter) {
        return;
      }
      if (typeof formatter === 'string') {
        return formatter;
      }

      const content = formatter({ name: seriesData, value: seriesItem.data[xcoords].value });
      // console.log(content);

      // delete label.formatter;
      // console.log(xcoords, seriesData);

      const position: number[] = echartsIns.convertToPixel(
        {
          // xAxisIndex: 0,
          // yAxisIndex,
          seriesIndex: index,
        },
        [seriesData + '', seriesItem.data[xcoords].value]
      );

      const rect: CSSProperties = {
        position: 'absolute',
        left: `${Math.floor(position[0] + symbolOffset[0] - size / 2)}px`,
        top: `${Math.floor(position[1] + symbolOffset[1] - size / 2)}px`,
        height: `${size}px`,
        width: `${size}px`,
        backgroundImage: `url(${symbol.replace('image://', '')})`,
        backgroundRepeat: 'no-repeat',
        backgroundSize: 'auto 100%',
        justifyContent: 'center',
        alignItems: 'center',
      };
      const labelCSS: CSSProperties = {
        display: label.show ? 'block' : 'none',
      };

      result.push({
        rect,
        label: labelCSS,
        content,
        isShow: type !== 'canvas',
      });
    });
  });

  return result;
};
