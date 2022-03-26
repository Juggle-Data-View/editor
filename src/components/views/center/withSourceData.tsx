/**
 * 高阶组件
 * 会向包裹的组件传递 sourceData
 * @author longchan
 */

import React, { useState, useEffect, useMemo, useCallback } from 'react';

import { AutoDV } from 'auto-dv-type';
import { fetchAPIData, fetchCSVData } from 'helpers/fetchData';
import dataTranslate, { decorateData2array } from 'utils/dataTranslate';

import { DataSourceType } from 'config/const';

export interface HOCProps {
  comps?: AutoDV.Comp[];
  isSubComp?: boolean;
  parentCode?: string;
  dispatch?: (code: string, sourceData: any) => void;
  datasource?: AutoDV.MixinDatasource;
}

const withSourceData = (WrappedComponent: React.ComponentType<AutoDV.CompIndex>) => {
  return (props: Omit<AutoDV.CompIndex, 'sourceData'> & HOCProps) => {
    const { comps, isSubComp, datasource, ...rest } = props;
    const { compData } = rest; // 包裹组件需要用到的props
    const { code, dataConfig } = compData;

    const [originData, setOriginData] = useState<any[]>([]);

    const getOriginData = useCallback(async (): Promise<any[]> => {
      switch (datasource?.dataSourceType) {
        case DataSourceType.Static:
          return datasource.body;
        case DataSourceType.API: {
          if (!dataConfig) {
            throw new Error('API datasource configuration error');
          }
          return await fetchAPIData(code, dataConfig);
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

    useEffect(() => {
      getOriginData().then((data) => {
        setOriginData(data);
      });
    }, [getOriginData]);

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
