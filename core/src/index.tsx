import { lazy, Suspense } from 'react';
import { createRoot } from 'react-dom/client';
import { Switch, Route, BrowserRouter, Redirect } from 'react-router-dom';
import { injectCDNScript } from '@components/common/JuggleDVIcon';
import PageLoading from '@components/common/PageLoading';
import Providers from '@components/base/Providers';
import '@assets/style/index.scss';
import initialServer from '@service/initialize';
initialServer();
injectCDNScript();
(window as any).echartsUrl = 'http://localhost:3001';

const Index = () => {
  return (
    <Providers>
      <BrowserRouter>
        <Suspense fallback={<PageLoading />}>
          <Switch>
            <Route exact path="/editor/:page/:userPage?" component={lazy(() => import('@page/editor'))} />
            <Route path="/view" component={lazy(() => import('@page/view'))} />
            <Route path="/authoriz" component={lazy(() => import('@page/Authoriz'))} />
            <Route path="/loading" component={lazy(() => import('@components/common/PageLoading'))} />
            <Redirect to="/editor/canvas" />
            <Route component={lazy(() => import('@page/404'))} />
          </Switch>
        </Suspense>
      </BrowserRouter>
    </Providers>
  );
};

//`as Element` to resolve type could be null;
const root = document.getElementById('root') as Element;
const container = createRoot(root);
container.render(<Index />);
