import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import styled from 'styled-components';
import CompPropsAttr from 'components/views/rightPanel/CompPropsAttr';
import { sleep } from 'utils';
import { asyncLoadCompConfig } from 'helpers/asyncLoad';
import notice from 'utils/notice';
import { Generator } from 'components/recursion';
import { getDiffPayload } from 'helpers/diff';
import CompErrorBoundary, { mergeCompData } from 'components/base/CompErrorBoundary';
import { appAction } from 'store/features/appSlice';
import { Tooltip, IconButton, Tab } from '@mui/material';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import CircularProgress from '@mui/material/CircularProgress';
import RefreshIcon from '@mui/icons-material/Refresh';
import DataPanel from './DataPanel';
import { JuggleDV } from '@juggle-data-view/types';

const LoaderContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding-top: 50%;
`;

const Loader = () => (
  <LoaderContainer>
    <CircularProgress />
  </LoaderContainer>
);

const CompProps: React.FC<JuggleDV.PropsCompProps> = (props) => {
  const { compData, noNeedPropsCommon } = props;
  const { code, compCode, version, alias, dataConfig } = compData;
  const [config, setConfig] = useState<JuggleDV.CompConfig | null>(null);
  const [refresh, setRefresh] = useState(false);
  const [activeTabIndex, setActiveTabIndex] = useState('config');
  const dispatch = useDispatch();

  const loadConfig = async () => {
    try {
      const config = await asyncLoadCompConfig(compCode, version);
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

  const { tab, template, extraTab } = config;

  return (
    <CompErrorBoundary compData={compData} isInEditor={true}>
      <Generator
        values={compData}
        config={config.forms}
        defaultValues={template}
        onSubmit={(values) => {
          const diffs = getDiffPayload(compData, values);
          if (diffs) {
            dispatch(appAction.updateComp({ code, comp: values }));
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
                    <Tooltip title="更新组件版本" placement="right">
                      <IconButton
                        style={{ marginLeft: 5 }}
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
                      >
                        <RefreshIcon />
                      </IconButton>
                    </Tooltip>
                  </div>
                  {refresh ? <Loader /> : <CompPropsAttr {...props} />}
                </>
              ) : null}
              {!refresh ? render() : null}
            </>
          );

          return (
            <TabContext value={activeTabIndex}>
              <TabList sx={{ height: '34px' }} onChange={(event, newValue) => setActiveTabIndex(newValue)}>
                {tab.config && <Tab sx={{ height: '34px' }} label="配置" value="config" />}
                {tab.dataset && <Tab sx={{ height: '34px' }} label="数据" value="dataset" />}
                {extraTab
                  ? extraTab.map(({ title, component: C }) => {
                      return <Tab key={title} value={title} />;
                    })
                  : null}
              </TabList>
              {tab.config && (
                <TabPanel id="config" value="config">
                  {ConfigPanel}
                </TabPanel>
              )}
              {tab.dataset && dataConfig && (
                <TabPanel id="dataset" value="dataset">
                  <DataPanel {...dataConfig} />
                </TabPanel>
              )}
              {extraTab
                ? extraTab.map(({ title, component: C }: any) => {
                    return (
                      <TabPanel key={title} value={title} id={title}>
                        <C {...props} />
                      </TabPanel>
                    );
                  })
                : null}
            </TabContext>
          );
        }}
      </Generator>
    </CompErrorBoundary>
  );
};

export default CompProps;
