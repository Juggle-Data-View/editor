import pieHandle from "./seriesHandles/pie";
import funnelHandle from "./seriesHandles/funnel";
import radarHandle from "./seriesHandles/radar";
import generalHandle from "./seriesHandles/general";
import treemap from "./seriesHandles/treemap";
import { cloneDeep } from "lodash";
import { handleSeriesMarkPoint } from "./markpoint";
import getFormatter from "./getFormatter";

const Angle2Matrix = (angle: number): { x: number; y: number; x2: number; y2: number } => {
	const radin = ((360 - angle) * Math.PI) / 180; //顺时针方向
	const xComponent = Math.sin(radin);
	const yComponent = Math.cos(radin);
	const xSComponent = -xComponent;
	const ySComponent = -yComponent;
	const cellMatrix = [
		[0.5 * (1 + xComponent), 0.5 * (1 + yComponent)],
		[0.5 * (1 + xSComponent), 0.5 * (1 + ySComponent)],
	]; // 单位矩阵 * 0.5
	return {
		x: cellMatrix[0][0],
		y: cellMatrix[0][1],
		x2: cellMatrix[1][0],
		y2: cellMatrix[1][1],
	};
};

const isHandleFunctionString = (fnString: string) => {
	return fnString.includes("function");
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
		if (seriesItem.type === "pie") {
			pieHandle(seriesItem, sourceData);
		} else if (seriesItem.type === "funnel") {
			handleSeriesLabel(seriesItem.label);
			funnelHandle(seriesItem, sourceData);
		} else if (seriesItem.type === "radar") {
			radarHandle(seriesItem, sourceData, echartOption);
		} else if (seriesItem.type === "treemap") {
			treemap(seriesItem, sourceData);
		} else {
			handleSeriesLabel(seriesItem.label);
			generalHandle(seriesItem, sourceData, axisData);
			seriesItem = handleSeriesItemStyle(seriesItem);
			handleSeriesMarkPoint(seriesItem, sourceData);
		}

		return seriesItem;
	});
	if (echartOption.yAxis && echartOption.yAxis[0].showWay === "split") {
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
