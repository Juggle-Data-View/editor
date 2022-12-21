import React, { useState, useMemo } from 'react';

import { JuggleDV } from '@juggle-data-view/types';
import dataTranslate, { decorateData2array } from '@utils/dataTranslate';

import getOriginData from '@utils/getOriginData';

export interface HOCProps {
  comps?: JuggleDV.Comp[];
  isSubComp?: boolean;
  parentCode?: string;
  dispatch?: (code: string, sourceData: any) => void;
  datasource?: JuggleDV.MixinDatasource;
}

const withSourceData = (WrappedComponent: React.FC<JuggleDV.CompIndex>) => {
  return (props: Omit<JuggleDV.CompIndex, 'sourceData'> & HOCProps) => {
    const { comps, isSubComp, datasource, ...rest } = props;
    const { compData } = rest; // 包裹组件需要用到的props
    const { dataConfig } = compData;

    const [originData, setOriginData] = useState<any[]>([]);

    const [isAutoFresh, updateFreq] = useMemo(() => {
      if (!dataConfig && !datasource) {
        return [false, -1];
      }
      if (!dataConfig && datasource) {
        return [!!datasource.frequency, datasource.frequency ? datasource.frequency : -1];
      }
      return [dataConfig?.autoRefresh, dataConfig?.frequency];
    }, [dataConfig, datasource]);

    const sourceData = useMemo<any[]>(() => {
      try {
        const origin = originData;
        // TODO: data tranlater second parameter is missing
        const data = dataConfig ? dataTranslate(origin, dataConfig.fieldMap) : decorateData2array(origin);

        return data; // sourceData的类型必须是个数组
      } catch (error) {
        console.log(error);
        return [];
      }
    }, [originData, dataConfig]);

    const timer = useMemo(() => {
      if (!isAutoFresh) {
        // clearInterval(timer);
        getOriginData(datasource, dataConfig).then((data) => setOriginData(data));
        return NaN;
      }
      if (timer) {
        clearInterval(timer);
      }
      return setInterval(() => getOriginData(datasource, dataConfig).then((data) => setOriginData(data)), updateFreq);
    }, [isAutoFresh, updateFreq, dataConfig, datasource]);

    return (
      <WrappedComponent
        {...rest}
        sourceData={sourceData}
        updateData={() => {
          console.log('try to update data');
        }}
      />
    );
  };
};

export default withSourceData;
