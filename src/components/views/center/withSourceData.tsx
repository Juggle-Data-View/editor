/**
 * 高阶组件
 * 会向包裹的组件传递 sourceData
 * @author longchan
 */

import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { useInterval, useUnmount } from 'ahooks';
import {
  // useSelector,
  useDispatch,
} from 'react-redux';
import { fetchDataInEditor, fetchDataInView } from 'helpers/fetchData';
import dataTranslate, { decorateData2array } from 'utils/dataTranslate';
import getDecoration from 'utils/getDecoration';
import useDynamicParams from './useDynamicParams';
import { DataSourceType } from 'config/const';
import { cacheOriginData } from 'store/features/dataSlice';
import emitter, { eventName } from 'utils/events';
import global from 'utils/global';
// import { selectDatasources } from 'store/selectors';

export interface HOCProps {
  comps?: AutoDV.Comp[];
  isSubComp?: boolean;
  parentCode?: string;
  dispatch?: (code: string, sourceData: any) => void;
  datasource?: AutoDV.MixinDatasource;
}

const withSourceData = (WrappedComponent: React.ComponentType<AutoDV.CompIndex>) => {
  return (props: Omit<AutoDV.CompIndex, 'sourceData'> & HOCProps) => {
    const { comps, isSubComp, parentCode = '', datasource, ...rest } = props;
    const { compData, isInEditor, reciver } = rest; // 包裹组件需要用到的props
    const { code, dataConfig } = compData;
    const { io } = global;
    const [origin, setOrigin] = useState<unknown>();
    // const datasourceData = useSelector(selectDatasources);
    const dispatch = useDispatch();

    /**
     * 是否缓存组件的服务端数据到系统中。
     * 在编排中，数据需要在右侧数据面板中做预览展示，所以需要全部缓存。
     * 在预览中，为了性能考虑，只缓存需要共享数据的组件，如：数据源类型组件。
     */
    const shouldCacheOriginData = useMemo(() => {
      const { compCode } = compData;
      // 如果组件没有数据配置项，不缓存数据
      if (!datasource) return false;
      const isDatasourceComp = compCode === 'datasource';
      if (isInEditor || isDatasourceComp) {
        return true;
      }
      return false;
    }, [compData, datasource, isInEditor]);

    // 装饰器信息
    const decoratorObj = useMemo(() => {
      if (!comps) {
        return null;
      }
      const decorator: any = getDecoration(comps, code);
      return {
        decorator,
        config: decorator ? comps.find((comp) => comp.code === decorator.decoratorId) : undefined,
      };
    }, [comps, code]);

    const wsInitRef = useRef(false); // ws初始状态

    // 设置定制器的执行机制，为null时不执行
    const interval = useMemo(() => {
      /**
       * 以下情况不会触发http定时取数：
       * 1. 没有datasource
       * 2. 有io（说明是websocket）
       * 3. 在编排系统中
       * 4. 关闭定时更新配置
       */
      if (!datasource || io || isInEditor) {
        return null;
      }
      //TODO: use data source frequence
      return 1000;
    }, [datasource, io, isInEditor]);

    const getOriginData = useCallback(
      async (code: string, datasource: AutoDV.MixinDatasource, dynamicParams: AutoDV.DataParam[]) => {
        try {
          switch (datasource.dataSourceType) {
            case DataSourceType.Static: {
              //TODO: get static data
              return datasource.body;
            }
            // case DataSourceType.DataSource: {
            //   if (datasourceData) {
            //     const { sourceCode, auxFieldMap } = getJsonMap(datasource);
            //     return sourceCode ? translateFromAux(auxFieldMap, datasourceData) : undefined;
            //   }
            //   break;
            // }
            case DataSourceType.API: {
              return [];
            }
            default: {
              if (isInEditor) {
                dispatch(cacheOriginData({ code, data: { id: code, status: 'pendding' } }));
                return await fetchDataInEditor(code, datasource);
              }
              const _code = isSubComp ? parentCode : code;
              const _layerCode = isSubComp ? code : undefined;
              return await fetchDataInView(_code, dynamicParams, _layerCode);
            }
          }
        } catch (error: any) {
          // code=20时该请求为挂起请求，过滤掉此请求后不会导致右侧错误提示的UI快闪
          if (error.code !== 20) {
            return {
              id: code,
              status: 'error',
              code: error.code || 400,
              message: error.message || '接口请求错误',
            } as AutoDV.CustomOriginData;
          }
        }
      },
      [isInEditor, isSubComp, parentCode, dispatch]
    );

    // 接口动态参数
    const dynamicParams = useDynamicParams(decoratorObj, getOriginData, reciver);

    // 当依赖项：datasource、dynamicParams发生变化时触发请求，重新dispatch数据
    // 因为code、isInEditor、dispatch不会变化，所以无须放入依赖
    const setLocalData = useCallback(async () => {
      let data;
      try {
        console.log(datasource);

        if (!datasource) return;
        data = await getOriginData(code, datasource, dynamicParams);
      } catch (error) {
        console.log('setLocalData error', error);
      } finally {
        wsInitRef.current = true;
        setOrigin(data);
      }
    }, [datasource, getOriginData, code, dynamicParams]);

    // 当数据变更时，缓存数据到store中
    useEffect(() => {
      if (shouldCacheOriginData && origin) {
        dispatch(cacheOriginData({ code, data: origin }));
      }
    }, [origin, code, shouldCacheOriginData]); // eslint-disable-line

    useEffect(() => {
      if (isInEditor) {
        const update = (_code: string) => {
          if (_code === code) setLocalData();
        };
        emitter.on(eventName.updateOriginData, update);
        return () => {
          emitter.off(eventName.updateOriginData, update);
        };
      }
    }, [code, isInEditor, setLocalData]);

    // 卸载时
    useUnmount(() => {
      dispatch(cacheOriginData({ code }));
    });

    useEffect(() => {
      setLocalData();
    }, [setLocalData]);

    // http定时取数
    useInterval(setLocalData, interval);

    const sourceData = useMemo<any[]>(() => {
      try {
        if (!origin || (origin as AutoDV.CustomOriginData).id === code) {
          return [];
        }
        // TODO: data tranlater second parameter is missing
        const data = dataConfig ? dataTranslate(origin, dataConfig.fieldMap) : decorateData2array(origin);
        if (decoratorObj) {
          const { decorator } = decoratorObj;
          if (decoratorObj && decorator && decorator.type === 'data') {
            return decorator.handle('data')(data, reciver || []);
          }
        }
        return data; // sourceData的类型必须是个数组
      } catch (error) {
        console.log(error);
        return [];
      }
    }, [origin, code, dataConfig, decoratorObj, reciver]);

    return <WrappedComponent {...rest} sourceData={sourceData} updateData={setLocalData} />;
  };
};

export default withSourceData;
