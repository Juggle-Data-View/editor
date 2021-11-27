/**
 * 高阶组件
 * 会向包裹的组件传递 sourceData
 * @author longchan
 */

import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { useInterval, useUnmount } from 'ahooks';
import { useSelector, useDispatch } from 'react-redux';
import { fetchDataInEditor, fetchDataInView } from 'helpers/fetchData';
import dataTranslate, { translateFromAux, decorateData2array } from 'utils/dataTranslate';
import { getJsonMap } from 'utils';
import getDecoration from 'utils/getDecoration';
import useDynamicParams from './useDynamicParams';
import { DataSourceType } from 'config/const';
import { RootState } from 'store/index';
import { cacheOriginData } from 'store/features/dataSlice';
import emitter, { eventName } from 'utils/events';
import global from 'utils/global';

// 取 数据源组件 的数据
const datasourceSelector = (dataConfig: AutoDV.DataConfig | undefined) => {
  return (state: RootState) => {
    const { originDatas } = state.data;
    if (dataConfig && dataConfig.dataSourceType === DataSourceType.DataSource) {
      // 数据源类型的数据，取绑定的数据源组件数据
      const { sourceCode } = getJsonMap(dataConfig);
      return sourceCode ? originDatas[sourceCode] : undefined;
    }
    return undefined;
  };
};

export interface HOCProps {
  comps?: AutoDV.Comp[];
  isSubComp?: boolean;
  parentCode?: string;
  dispatch?: (code: string, sourceData: any) => void;
}

const withSourceData = (WrappedComponent: React.ComponentType<AutoDV.CompIndex>) => {
  return (props: Omit<AutoDV.CompIndex, 'sourceData'> & HOCProps) => {
    const { comps, isSubComp, parentCode = '', ...rest } = props;
    const { compData, isInEditor, reciver } = rest; // 包裹组件需要用到的props
    const { code, dataConfig } = compData;
    const { io } = global;
    const [origin, setOrigin] = useState<unknown>();
    const datasourceData = useSelector(datasourceSelector(dataConfig));
    const dispatch = useDispatch();

    /**
     * 是否缓存组件的服务端数据到系统中。
     * 在编排中，数据需要在右侧数据面板中做预览展示，所以需要全部缓存。
     * 在预览中，为了性能考虑，只缓存需要共享数据的组件，如：数据源类型组件。
     */
    const shouldCacheOriginData = useMemo(() => {
      const { compCode, dataConfig } = compData;
      // 如果组件没有数据配置项，不缓存数据
      if (!dataConfig) return false;
      const isDatasourceComp = compCode === 'datasource';
      if (isInEditor || isDatasourceComp) {
        return true;
      }
      return false;
    }, [compData, isInEditor]);

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
       * 1. 没有dataConfig
       * 2. 有io（说明是websocket）
       * 3. 在编排系统中
       * 4. 关闭定时更新配置
       */
      if (!dataConfig || io || isInEditor || !dataConfig.autoRefresh) {
        return null;
      }
      return dataConfig.frequency * 1000;
    }, [dataConfig, io, isInEditor]);

    const getOriginData = useCallback(
      async (code: string, dataConfig: AutoDV.DataConfig, dynamicParams: AutoDV.DataParam[]) => {
        try {
          switch (dataConfig.dataSourceType) {
            case DataSourceType.Static: {
              return dataConfig.mockData;
            }
            case DataSourceType.DataSource: {
              if (datasourceData) {
                const { sourceCode, auxFieldMap } = getJsonMap(dataConfig);
                return sourceCode ? translateFromAux(auxFieldMap, datasourceData) : undefined;
              }
              break;
            }
            default: {
              if (isInEditor) {
                dispatch(cacheOriginData({ code, data: { id: code, status: 'pendding' } }));
                return await fetchDataInEditor(code, dataConfig);
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
      [datasourceData, isInEditor, isSubComp, parentCode, dispatch]
    );

    // 接口动态参数
    const dynamicParams = useDynamicParams(decoratorObj, getOriginData, reciver);

    // 当依赖项：dataConfig、dynamicParams发生变化时触发请求，重新dispatch数据
    // 因为code、isInEditor、dispatch不会变化，所以无须放入依赖
    const setLocalData = useCallback(async () => {
      let data;
      try {
        if (!dataConfig) return;
        data = await getOriginData(code, dataConfig, dynamicParams);
      } catch (error) {
        console.log('setLocalData error', error);
      } finally {
        wsInitRef.current = true;
        setOrigin(data);
      }
    }, [dataConfig, getOriginData, code, dynamicParams]);

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

    // websocket定时取数
    useEffect(() => {
      if (dataConfig?.dataSourceType === DataSourceType.DataSource || !io || isInEditor) return;
      io.on(code, (data: unknown) => {
        if (!wsInitRef.current) return;
        setOrigin(data);
      });
    }, [io, isInEditor]); // eslint-disable-line

    const sourceData = useMemo<any[]>(() => {
      try {
        if (!origin || (origin as AutoDV.CustomOriginData).id === code) {
          return [];
        }
        // 这么写的原因是在ws中，时间器组件没有dataConfig配置，但是仍然需要做转换
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
    }, [dataConfig, origin, decoratorObj, reciver, code]);

    return <WrappedComponent {...rest} sourceData={sourceData} updateData={setLocalData} />;
  };
};

export default withSourceData;
