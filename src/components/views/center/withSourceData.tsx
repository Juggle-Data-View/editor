/**
 * 高阶组件
 * 会向包裹的组件传递 sourceData
 * @author longchan
 */

import React, { useState, useMemo, useCallback } from 'react';

import { JuggleDV } from '@juggle-data-view/types';
import { fetchAPIData, fetchCSVData } from 'helpers/fetchData';
import dataTranslate, { decorateData2array } from 'utils/dataTranslate';

import { DataSourceType } from 'config/const';

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
    const { code, dataConfig } = compData;

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

    const getOriginData = useCallback(async (): Promise<any[]> => {
      switch (datasource?.dataSourceType) {
        case DataSourceType.Static:
          return datasource.body;
        case DataSourceType.API: {
          if (!dataConfig) {
            throw new Error('API datasource configuration error');
          }
          return await fetchAPIData(dataConfig, datasource);
        }
        case DataSourceType.CSV: {
          if (!dataConfig) {
            throw new Error('CSV datasource configuration error');
          }
          return await fetchCSVData(code, dataConfig);
        }
        default:
          throw new Error('Datasource bound error');
      }
    }, [datasource, code, dataConfig]);

    // useEffect(() => {
    //   getOriginData().then((data) => {
    //     setOriginData(data);
    //   });
    // }, [getOriginData]);

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
        getOriginData().then((data) => setOriginData(data));
        return NaN;
      }
      if (timer) {
        clearInterval(timer);
      }
      return setInterval(() => getOriginData().then((data) => setOriginData(data)), updateFreq);
    }, [getOriginData, updateFreq, isAutoFresh]);

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
