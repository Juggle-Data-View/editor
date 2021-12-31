/**
 * 业务异常组件。
 * 捕获业务组件异常并尝试更新业务组件配置
 * 出现场景：当业务组件升级后，旧配置项与新业务逻辑不同步导致的组件报错。
 * 解决方法：捕获异常，将旧配置与业务组件默认模板配置进行合并，补全配置（多余配置项未做删减）
 */

import React, { ErrorInfo } from 'react';
import styled from 'styled-components';
import merge from 'lodash/merge';
import { asyncLoadCompConfig } from 'helpers/asyncLoad';
import { defaultCompData } from 'config/defaults';
import store from 'store/index';
import { appAction } from 'store/features/appSlice';

/**
 * TODO: 重写一些合并组件配置的规则
 * 处理组件配置信息。
 * 使用模板配置补全服务端配置。防止组件因为业务升级，某个属性找不到时出现报错。
 */
export const mergeCompData = async (compData: AutoDV.Comp) => {
  try {
    const { code, compCode, compTempCode } = compData;
    const { template } = await asyncLoadCompConfig(compCode, compTempCode);
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

interface IState {
  hasError: boolean;
  error?: Error;
  errorInfo?: ErrorInfo;
}

interface IProps {
  compData: AutoDV.Comp;
  isInEditor?: boolean;
}

export default class ErrorCatcher extends React.Component<IProps, IState> {
  state = {
    hasError: false,
  };

  static getDerivedStateFromError() {
    // 更新 state 使下一次渲染能够显示降级后的 UI
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // 你同样可以将错误日志上报给服务器
    console.log(error, errorInfo);
    mergeCompData(this.props.compData);
  }

  render() {
    if (this.state.hasError && this.props.isInEditor) {
      // 你可以自定义降级后的 UI 并渲染
      return <ErrorMessage>⚠️ 组件配置异常，请刷新页面重试。</ErrorMessage>;
    }

    return this.props.children;
  }
}
