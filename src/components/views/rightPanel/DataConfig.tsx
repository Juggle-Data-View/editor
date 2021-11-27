/**
 * 数据源组件.
 */
import React, { useState, useCallback, useMemo, memo } from 'react';
import { useSelector } from 'react-redux';
import { Button, NonIdealState, Classes, Tooltip, Callout } from '@blueprintjs/core';
import DataSourceSelect from 'components/views/rightPanel/DataSourceSelect';
import dataTranslate, { decorateData2array } from 'utils/dataTranslate';
import notice from 'utils/notice';
import * as Api from 'utils/api';
import FieldMapTable from './FieldMapTable';
import { BaseParams, ApiParams } from './DataSourceParams';
import DataSourceCreator from './DataSourceCreator';
import DataScript from './DataScript';
import { Control, Field, FieldLabel } from 'components/form/index';
import { DataConfigStyled } from './style';
import { DataSourceAlias, DataSourceType } from 'config/const';
import { useFormikContext } from 'formik';
import DataGroup from './DataGroup';
import { RootState } from 'store/index';
import emitter, { eventName } from 'utils/events';
import { LoadingIcon } from 'components/common/AutoDVIcon';
import { JSONEditor } from 'components/common/CodeEditor';

interface IDataConfig {
  /** 组件实例id */
  code: string;
  dataConfig: AutoDV.DataConfig;
  name: string;
  compCode: string;
}

/**
 * 1. 外层包裹了一层对`dataConfig`的判断
 * 2. 传入props只传入`dataConfig`
 */
const DataConfig: React.FC<IDataConfig> = ({ code, dataConfig, name }) => {
  const { fieldMap, mockData, dataSourceId, dataSourceType, dataParams, scriptId, specScript } = dataConfig;
  const hasSubComponents = name !== `dataConfig`;
  const originData = useSelector((state: RootState) => state.data.originDatas[code]);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const { setFieldValue } = useFormikContext();
  const getName = (key: keyof AutoDV.DataConfig) => [name, key].join('.');

  const setDataConfig = useCallback(
    (config: Partial<AutoDV.DataConfig>) => {
      const newDataConfig = {
        ...dataConfig,
        ...config,
      };
      setFieldValue(name, newDataConfig);
    },
    [dataConfig, name, setFieldValue]
  );

  const changeStaticData = useCallback(
    async (value: string) => {
      try {
        const data = JSON.parse(value);
        if (data.length > 2000) {
          throw new Error('超过2000个字符');
        }
        const newData = decorateData2array(data);
        setDataConfig({
          mockData: newData,
        });
        if (!hasSubComponents) {
          const payload: CompInstEditReqData[] = [
            {
              code,
              key: 'staticData',
              value: data || '',
            },
          ];
          await Api.updateComp(payload);
        }
      } catch (error: any) {
        notice.error(`修改静态数据失败: ${error.message}`);
      }
    },
    [code, hasSubComponents, setDataConfig]
  );

  /**
   * 获取 mockData 和 originData 合并后的数据
   */
  const getMergeData = useCallback(() => {
    if (!originData || !Array.isArray(originData)) return [];
    const sourceData = dataTranslate(originData, fieldMap);
    return originData.map((data: any, index: number) => {
      // 如果key重复，数据源数据会覆盖掉`sourceData`的数据
      return {
        ...sourceData[index],
        ...data,
      };
    });
  }, [fieldMap, originData]);

  const customOriginData = useMemo(() => {
    const body: AutoDV.CustomOriginData | undefined = Array.isArray(originData) && originData[0];
    if (body && body.id === code) {
      return body;
    }
    return null;
  }, [originData, code]);

  return (
    <DataConfigStyled>
      <FieldMapTable name={name} fieldMap={fieldMap} originData={customOriginData ? [] : originData || []} />
      <div className="step">
        <div className="block">数据源（{DataSourceAlias[dataSourceType]}）</div>
        <div className="gap block">
          <Button icon="cog" onClick={() => setIsOpen(true)} text="修改数据源" />
        </div>
        <div className="block">数据响应结果（只读）</div>
        <div className="block" style={{ height: 350 }}>
          <JSONEditor
            value={JSON.stringify(dataTranslate(originData, fieldMap), null, 2)}
            options={{ readOnly: true }}
          />
        </div>
      </div>

      <Field.Switch label="数据更新频率" name={getName('autoRefresh')} />

      <div style={{ width: 140, marginLeft: 10 }}>
        <Control.InputNumber
          name={getName('frequency')}
          bp={{ min: 1, fill: true, disabled: !dataConfig.autoRefresh, stepSize: 1 }}
          unit="秒"
        />
      </div>

      {/* 修改数据源抽屉 */}
      <div className={['drawer-container', isOpen ? '--show' : ''].join(' ')}>
        <div className="head">
          <span className="title">修改数据源</span>
          <Button small={true} minimal={true} onClick={() => setIsOpen(false)} icon="cross" />
        </div>
        <div className={Classes.DRAWER_BODY} style={{ paddingBottom: 40 }}>
          <Field.Select
            label="数据源类型"
            name={[name, 'dataSourceType'].join('.')}
            popoverProps={{ position: 'bottom-left', minimal: true }}
            onChange={(value) => {
              // 如果切换了数据源，才会重置部分配置
              if (value !== dataSourceType) {
                setDataConfig({
                  dataSourceType: value, // Field.Select 内部已经修改值了，但是在这里被覆盖了，所以需要重新set
                  dataSourceId: null,
                  dataParams: [],
                });
              }
            }}
          >
            {(Object.keys(DataSourceAlias) as []).map((index) => {
              return (
                <option key={index} value={Number(index)}>
                  {DataSourceAlias[index]}
                </option>
              );
            })}
          </Field.Select>

          {dataSourceType === DataSourceType.Static ? (
            <div className="block" style={{ height: 350 }}>
              <JSONEditor value={JSON.stringify(mockData, null, 2)} onSubmit={changeStaticData} />
            </div>
          ) : (
            <>
              <FieldLabel label="选择数据源">
                <div style={{ display: 'flex' }}>
                  {/* width: 1  防止按钮内文字过长撑开flex布局 */}
                  <div style={{ flex: 1, width: 1 }}>
                    <DataSourceSelect
                      dataSourceId={
                        dataSourceType === DataSourceType.DataSource
                          ? dataConfig.jsonMap?.sourceCode || ''
                          : dataSourceId
                      }
                      dataSourceType={dataSourceType}
                      onItemSelect={(item) => {
                        // 更新dataSourceId
                        const config: Partial<AutoDV.DataConfig> = {
                          dataSourceId: item.value,
                        };
                        if (dataSourceType === DataSourceType.MySQL) {
                          // 切换数据源时，如果数据源类型是MySQL，就重置 键入sql 和 sql代码片段id
                          config.specScript = '';
                          config.scriptId = null;
                        }

                        if (dataSourceType === DataSourceType.DataSource) {
                          config.dataSourceId = null;
                          config.jsonMap = {
                            sourceCode: item.value as string,
                            auxFieldMap: [],
                          };
                        }

                        if (dataParams.length) {
                          // 切换数据源下拉项时重置`dataParams`的值
                          config.dataParams = [];
                        }
                        setDataConfig(config);
                      }}
                    />
                  </div>
                  {dataSourceType !== DataSourceType.DataSource && (
                    <DataSourceCreator title={DataSourceAlias[dataSourceType]} dataSourceType={dataSourceType} />
                  )}
                </div>
              </FieldLabel>
              {dataSourceType === DataSourceType.API || dataSourceType === DataSourceType.EZD ? (
                <ApiParams dataSourceId={dataSourceId}>
                  {(names) => {
                    return (
                      <BaseParams paramNames={names} dataParams={dataParams} dataParamsName={getName('dataParams')} />
                    );
                  }}
                </ApiParams>
              ) : null}
              {dataSourceType === DataSourceType.MySQL ? (
                <DataScript
                  specScript={specScript}
                  dataSourceId={dataSourceId}
                  scriptId={scriptId}
                  onChange={({ value }) => setDataConfig({ scriptId: value as any })}
                  onBlur={async (value) => {
                    // 解析 value 中的参数，放入 dataParams 中
                    const reg = /\[:(\w+)\]/g;
                    const matches = [];
                    let myArray: any;
                    while ((myArray = reg.exec(value)) !== null) {
                      matches.push(myArray[1]);
                    }
                    setDataConfig({
                      dataParams: matches.map((name) => ({
                        name,
                        value: `:${name}`,
                      })),
                      specScript: value,
                    });
                  }}
                >
                  {(names) => {
                    return (
                      <BaseParams paramNames={names} dataParams={dataParams} dataParamsName={getName('dataParams')} />
                    );
                  }}
                </DataScript>
              ) : null}
              {dataSourceType === DataSourceType.DataSource && dataConfig.jsonMap ? (
                <DataGroup dataSourceId={dataConfig.jsonMap.sourceCode} />
              ) : null}
            </>
          )}

          <FieldMapTable name={name} readonly={true} fieldMap={fieldMap} originData={originData || []} />

          <div className="block">
            数据响应结果（只读）
            <Tooltip content="更新组件数据" position="right">
              <Button
                icon={<LoadingIcon duration={Boolean(customOriginData?.status === 'pendding') ? 3 : 0} size={14} />}
                small={true}
                minimal={true}
                onClick={() => emitter.emit(eventName.updateOriginData, code)}
              />
            </Tooltip>
          </div>
          {customOriginData?.status === 'error' && (
            <div className="block">
              <Callout intent="warning" icon="issue" title="获取数据异常">
                {customOriginData.message}({customOriginData.code})
              </Callout>
            </div>
          )}
          <div className="block" style={{ height: 350 }}>
            <JSONEditor
              value={JSON.stringify(customOriginData ? [] : getMergeData(), null, 2)}
              options={{ readOnly: true }}
            />
          </div>
        </div>
      </div>
    </DataConfigStyled>
  );
};

const DataConfigWrap: React.FC<AutoDV.PropsCompProps> = ({ compData }) => {
  const { code, dataConfig, compCode } = compData;

  if (!dataConfig) {
    const desc = (
      <div style={{ lineHeight: 1.5 }}>
        <p>当前组件没有配置数据源</p>
        <p>
          请检查组件配置项中是否包含 <code>dataConfig</code> 字段
        </p>
      </div>
    );
    return <NonIdealState icon="warning-sign" description={desc} />;
  }

  return <DataConfig name={'dataConfig'} compCode={compCode} code={code} dataConfig={dataConfig} />;
};

export default memo(DataConfigWrap);
