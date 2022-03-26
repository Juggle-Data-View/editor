import { AutoDV } from 'auto-dv-type';
import React, { ErrorInfo } from 'react';
import styled from 'styled-components';
import merge from 'lodash/merge';
import { asyncLoadCompConfig } from 'helpers/asyncLoad';
import { defaultCompData } from 'config/defaults';
import store from 'store/index';
import { appAction } from 'store/features/appSlice';

export const mergeCompData = async (compData: AutoDV.Comp) => {
  try {
    const { code, compCode, version } = compData;
    const { template } = await asyncLoadCompConfig(compCode, version);
    const newCompData: AutoDV.Comp = {
      ...compData,
      attr: merge({}, defaultCompData.attr, template.attr, compData.attr),
      config: merge({}, template.config, compData.config),
    };
    if (compData.dataConfig) {
      newCompData.dataConfig = merge({}, template.dataConfig, compData.dataConfig);
    }
    store.dispatch(appAction.updateComp({ code, comp: newCompData }));
  } catch (error) {
    console.log(error);
  }
};

const ErrorMessage = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  height: 100%;
  font-size: 14px;
`;

interface IProps {
  compData: AutoDV.Comp;
  isInEditor?: boolean;
}

export type HandleCatch = (error: Error, info: ErrorInfo) => void;

export class CommonErrorBoundy extends React.Component<{
  handleCatch: HandleCatch;
  LowerComponent?: () => JSX.Element;
  message?: string;
}> {
  state = {
    hasError: false,
  };

  static getDerivedStateFromError() {
    // 更新 state 使下一次渲染能够显示降级后的 UI
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    return this.props.handleCatch(error, info);
  }

  render(): React.ReactNode {
    const ErrorComp = (this.props.LowerComponent as any) || React.Fragment;
    if (this.state.hasError) {
      // 你可以自定义降级后的 UI 并渲染
      return <ErrorComp />;
    }

    return this.props.children;
  }
}

const ErrorCatcher: React.FC<IProps> = ({ compData, children }) => {
  const handleCatch: HandleCatch = (err, info) => {
    console.log(err, info);
    mergeCompData(compData);
  };

  return (
    <CommonErrorBoundy
      handleCatch={handleCatch}
      LowerComponent={() => <ErrorMessage>⚠️ 组件配置异常，请刷新页面重试。 </ErrorMessage>}
    >
      {children}
    </CommonErrorBoundy>
  );
};

export default ErrorCatcher;
