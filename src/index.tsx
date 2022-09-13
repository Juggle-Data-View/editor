import { lazy, Suspense } from 'react';
import { createRoot } from 'react-dom/client';
import { Switch, Route, BrowserRouter } from 'react-router-dom';
import { injectCDNScript } from '@components/common/JuggleDVIcon';
import PageLoading from '@components/common/PageLoading';
import Providers from '@components/base/Providers';
import '@service/initialize';
import '@assets/style/index.scss';

injectCDNScript();

//Disable MUI error .'Cause MUI debug source map was losed
const oldError = console.error;

console.error =
  process.env.NODE_ENV === 'development'
    ? (message, ...optionalParams) => {
        if (message.includes && message.includes('MUI')) {
          return;
        } else {
          oldError(message, ...optionalParams);
        }
      }
    : oldError;

const Index = () => {
  return (
    <Providers>
      <BrowserRouter>
        <Suspense fallback={<PageLoading />}>
          <Switch>
            <Route exact path="/editor/:page" component={lazy(() => import('@page/editor'))} />
            <Route path="/view" component={lazy(() => import('@page/view'))} />
            <Route path="/authoriz" component={lazy(() => import('@page/Authoriz'))} />
            <Route path="/loading" component={lazy(() => import('@components/common/PageLoading'))} />
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
