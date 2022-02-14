import { lazy, Suspense } from 'react';
import ReactDOM from 'react-dom';
import { Router } from 'react-router';
import { Switch, Route } from 'react-router-dom';
import history from 'helpers/history';
import { injectCDNScript } from 'components/common/AutoDVIcon';
import PageLoading from 'components/common/PageLoading';
import Providers from 'components/base/Providers';
import 'assets/style/index.scss';

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
