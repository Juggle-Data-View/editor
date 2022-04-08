import React from 'react';
interface IState {
  hasError: boolean;
  error?: Error;
  errorInfo?: React.ErrorInfo;
}

interface IProps {
  errorMessage?: React.ReactNode;
}

export default class ErrorBoundary extends React.Component<IProps, IState> {
  state = {
    hasError: false,
  };

  static getDerivedStateFromError() {
    // 更新 state 使下一次渲染能够显示降级后的 UI
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // 你同样可以将错误日志上报给服务器
    console.log(error, errorInfo);
  }

  render() {
    const { errorMessage } = this.props;
    if (this.state.hasError) {
      // 你可以自定义降级后的 UI 并渲染
      return <div>{errorMessage ? errorMessage : '组件发生错误'} </div>;
    }

    return <>this.props.children</>;
  }
}
