import React, { lazy, Suspense } from 'react';
import ReactDOM from 'react-dom';
import { Router } from 'react-router';
import { Switch, Route } from 'react-router-dom';
import { FocusStyleManager } from '@blueprintjs/core';
import history from 'helpers/history';
import { injectCDNScript } from 'components/common/AutoDVIcon';
import PageLoading from 'components/common/PageLoading';
import Providers from 'components/base/Providers';
import 'assets/style/index.scss';

injectCDNScript();

// 只在按下tab时启动focus样式
FocusStyleManager.onlyShowFocusOnTabs();

const Index = () => {
  return (
    <Providers>
      <Router history={history}>
        <Suspense fallback={<PageLoading />}>
          <Switch>
            <Route exact path="/" component={lazy(() => import('components/page/editor'))} />
            <Route path="/view" component={lazy(() => import('components/page/view'))} />
            <Route path="/authoriz" component={lazy(() => import('components/page/Authoriz'))} />
            <Route path="/loading" component={lazy(() => import('components/common/PageLoading'))} />
            <Route component={lazy(() => import('components/page/404'))} />
          </Switch>
        </Suspense>
      </Router>
    </Providers>
  );
};

ReactDOM.render(<Index />, document.getElementById('root'));
