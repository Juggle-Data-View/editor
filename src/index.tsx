import { lazy, Suspense } from 'react';
import { createRoot } from 'react-dom/client';
import { Switch, Route, BrowserRouter, Redirect } from 'react-router-dom';
import { injectCDNScript } from '@components/common/JuggleDVIcon';
import PageLoading from '@components/common/PageLoading';
import Providers from '@components/base/Providers';
import '@assets/style/index.scss';
import Parse from 'parse';
import { PARSE_ID, PARSE_KEY, PARSE_MASTER_KET, PARSE_SERVER_URL } from '@service/constant';

Parse.initialize(PARSE_ID, PARSE_KEY, PARSE_MASTER_KET);
Parse.enableLocalDatastore();
(Parse as any).serverURL = PARSE_SERVER_URL;

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
