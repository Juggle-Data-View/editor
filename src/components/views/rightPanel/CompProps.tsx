import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import styled from 'styled-components';
import { Spinner, Tabs, Tab, Button, Icon, Tooltip } from '@blueprintjs/core';
import CompPropsAttr from 'components/views/rightPanel/CompPropsAttr';
import { sleep } from 'utils';
import { asyncLoadCompConfig } from 'helpers/asyncLoad';
import notice from 'utils/notice';
import { Generator } from 'components/recursion';
import { getDiffPayload } from 'helpers/diff';
import DataConfig from './DataConfig';
import CompErrorBoundary, { mergeCompData } from 'components/base/CompErrorBoundary';
import { appAction } from 'store/features/appSlice';
import CompDebug from './CompDebug';

const RightAction = styled.div`
  display: flex;
  align-items: center;
  height: 100%;
`;

const Loader = styled(Spinner)`
  display: flex;
  align-items: center;
  justify-content: center;
  padding-top: 50%;
`;

const CompProps: React.FC<AutoDV.PropsCompProps> = (props) => {
  const { compData, noNeedPropsCommon, parentCompCode, parentName, parentCode } = props;
  const { code, compCode, compTempCode, alias } = compData;
  const [config, setConfig] = useState<AutoDV.CompConfig | null>(null);
  const [refresh, setRefresh] = useState(false);
  const dispatch = useDispatch();

  const loadConfig = async () => {
    try {
      const dirPath = parentCompCode ? parentCompCode : compCode;
      const filePath = parentCompCode ? compCode : compTempCode;
      const config = await asyncLoadCompConfig(dirPath, filePath);
      setConfig(config);
    } catch (error: any) {
      notice.error(error.message || '加载组件配置文件失败');
    }
  };

  useEffect(() => {
    loadConfig();
    return () => {
      setConfig(null);
    };
  }, [code]); // eslint-disable-line

  if (!config) {
    return <Loader />;
  }

  const { version, tab, template, extraTab } = config;

  return (
    <CompErrorBoundary compData={compData}>
      <Generator
        values={compData}
        config={config.forms}
        defaultValues={template}
        parentName={parentName}
        onSubmit={(values) => {
          const diffs = getDiffPayload(compData, values);
          if (diffs) {
            if (!parentCode) {
              dispatch(appAction.updateComp({ code, comp: values }));
            } else {
              dispatch(appAction.updateSubComp({ parentCode, code, comp: values }));
            }
          }
        }}
      >
        {({ render, formik }) => {
          if (!formik.isValid) {
            console.log('表单提交失败：', JSON.stringify(formik.errors));
          }
          const ConfigPanel = (
            <>
              {!noNeedPropsCommon ? (
                <>
                  <div className="comp-info">
                    {alias} | v{version || '0.0.1'}
                    <Tooltip content="更新组件版本" position="right">
                      <Button
                        style={{ marginLeft: 5 }}
                        icon={<Icon icon="refresh" iconSize={12} />}
                        minimal
                        small
                        onClick={async () => {
                          try {
                            setRefresh(true);
                            await mergeCompData(compData);
                            await sleep(200);
                          } catch (error) {
                            console.log(error);
                          } finally {
                            setRefresh(false);
                          }
                        }}
                      />
                    </Tooltip>
                  </div>
                  {refresh ? <Loader /> : <CompPropsAttr {...props} />}
                </>
              ) : null}
              {!refresh ? render() : null}
            </>
          );

          return (
            <>
              <Tabs className="panel-tabs" id={`Tabs-${code}`} defaultSelectedTabId="config">
                {tab.config && <Tab id="config" title="配置" panel={ConfigPanel} />}
                {tab.dataset && <Tab id="dataset" title="数据" panel={<DataConfig {...props} />} />}
                {extraTab
                  ? extraTab.map(({ title, component: C }) => {
                      return <Tab key={title} id={title} title={title} panel={<C {...props} />} />;
                    })
                  : null}
                <Tabs.Expander />
                <RightAction>
                  <CompDebug formik={formik} compData={compData} />
                </RightAction>
              </Tabs>
            </>
          );
        }}
      </Generator>
    </CompErrorBoundary>
  );
};

export default CompProps;
