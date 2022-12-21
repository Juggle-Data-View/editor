import React, { useCallback, useEffect, useRef, useState } from 'react';
import ReactEcharts, { ReactEchartsPropsTypes } from 'echarts-for-react';
import { createNextState as produce } from '@reduxjs/toolkit';
import { IIndex } from './type';
import universalAxis from './helper/universalAxis';
import universalSeries from './helper/universalSeries';
import generalTooltip from './helper/generalTooltip';
import universalGrid from './helper/universalGrid';
import getAxisData from './helper/getAxisData';
import { getMarkPoints, MarkPointType } from './helper/markpoint';
import { cloneDeep } from 'lodash';

const REcharts = ReactEcharts as unknown as React.FC<ReactEchartsPropsTypes & { ref: any }>;

/**
 * 处理补充零值的逻辑
 * @param axis 轴数组
 * @param sourceData 数据
 */
const getFormatSourceData = (axis: any[], sourceData: any[]) => {
  if (!axis || !axis[0]) {
    return sourceData;
  }
  if (!axis[0].needZeroPoint) {
    return sourceData;
  }
  const firstData = { ...sourceData[0] };
  for (const key in firstData) {
    if (key !== 'x' && key !== 'type') {
      firstData[key] = 0;
    }
  }
  return [firstData, ...sourceData];
};

const Index: React.FC<IIndex> = ({ compData, sourceData }) => {
  const { attr, config } = compData;
  //兼容新老echarts版本
  const compConifg = (config as any).option ? (config as any).option.echarts : config;
  const echartsRef = useRef<any>(null);
  const [markPoints, setMarkPoints] = useState<(JSX.Element | null)[]>();
  const echartsReducer = useCallback((): any => {
    const result: any = produce(compConifg, (draftState: any) => {
      const axis = draftState.xAxis && draftState.xAxis[0].type !== 'value' ? draftState.xAxis : draftState.yAxis;
      const axisData = getAxisData(sourceData as any[], axis);
      const formatData = getFormatSourceData(draftState.xAxis, sourceData as any[]);
      draftState.series = universalSeries(draftState.series, formatData, draftState, axisData);
      draftState.grid = universalGrid(draftState.grid, draftState);
      if (draftState.xAxis) {
        draftState.xAxis = universalAxis(draftState.xAxis, axisData, draftState);
      }
      if (draftState.yAxis) {
        const axisData = getAxisData(formatData, draftState.yAxis);
        draftState.yAxis = universalAxis(draftState.yAxis, axisData, draftState);
      }
      if (draftState.tooltip) {
        generalTooltip(draftState.tooltip);
      }
    });

    if (echartsRef.current) {
      if (result.notMerge) {
        echartsRef.current.getEchartsInstance().clear();
      }
      echartsRef.current.getEchartsInstance().setOption(result);
      setMarkPoints(
        renderMarkPoint(
          getMarkPoints(cloneDeep(result.series), sourceData as any[], echartsRef.current.getEchartsInstance())
        )
      );
    }
  }, [compConifg, sourceData]);
  useEffect(() => {
    echartsReducer();
  }, [compConifg, sourceData]); //eslint-disable-line

  const renderMarkPoint = (markPoints: MarkPointType[]) => {
    return markPoints.map((item, index) => {
      const { rect, label, content, isShow } = item;

      return isShow ? (
        <div style={rect} key={index + '' + content}>
          <div style={label} dangerouslySetInnerHTML={{ __html: content }} />
        </div>
      ) : null;
    });
  };

  return (
    <>
      <REcharts
        style={{
          height: attr.height,
          width: attr.width,
        }}
        option={{}}
        ref={echartsRef}
        lazyUpdate={false}
        notMerge={false}
      />
      {markPoints}
    </>
  );
};

export default Index;
