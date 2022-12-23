import { useDispatch } from 'react-redux';
import setupWatch from '@store/watcher';
import { EditorGlobalStyle } from 'assets/style';
import { appAction } from '@store/features/appSlice';
import Header from '@page/editor/Header';
import LeftPannle from '@page/editor/LeftPanel';
import CenterPannle from '@page/canvas';
import RightPannle from '@page/editor/RightPanel';
import GlobalHotKeys from '@components/common/GlobalHotKeys';
import { CANVAS_ID, COPY_KEY } from '@configurableComponents/const';
import notice from '@utils/notice';
import { transContent } from 'helpers/importHelper';
import { getConfigFromIndexedDB, getConfigFromServer } from 'utils';
import { useEffect } from 'react';
import ThemeConfig from '../../common/theme';
import { Route, Switch, useParams } from 'react-router-dom';
import User from './User';
import store from '@store/index';
import { isEmpty } from 'lodash';
import { JuggleDV } from '@juggle-data-view/types';
import { getStaticData } from '@components/base/BaseActions';

const Editor = () => {
  const dispatch = useDispatch();

  const { page } = useParams<{
    page: 'canvas' | 'user';
  }>();

  const handlePaste = (event: ClipboardEvent) => {
    try {
      if (!document.getElementById(CANVAS_ID)) {
        throw new Error('没有找到画布元素');
      }
      const paste: string = (event.clipboardData || (window as any).clipboardData).getData('text');

      if (typeof paste === 'string' && paste.indexOf(COPY_KEY) === 0) {
        event.preventDefault();
        const str = paste.substr(COPY_KEY.length);
        try {
          const content = transContent(JSON.parse(str), { offset: 20 });
          dispatch(appAction.addComp({ comps: content.components }));
        } catch (error) {
          throw error;
        }
      }
    } catch (error) {
      if (error instanceof Error) notice.error(error.message);
    }
  };

  const preloadComponentsStaticData = async (app: JuggleDV.AppConfig) => {
    const { compInsts } = app.canvas;
    if (!compInsts) {
      return;
    }
    const state = store.getState();
    const { datasources } = state.autoDV.present.app;
    const result = {} as JuggleDV.MixinDatasource;
    for await (const { compCode, dataConfig } of compInsts) {
      if (compCode in datasources) {
        continue;
      }
      result[compCode as keyof JuggleDV.MixinDatasource] = {
        ...dataConfig,
        body: await getStaticData(compCode, datasources),
      };
    }
    return result;
  };

  const initApp = async () => {
    //TODO: Not request when app info is same
    try {
      const app = await getConfigFromServer();
      dispatch(
        appAction.init({
          app: {
            ...app,
            datasources: await preloadComponentsStaticData(app),
          },
        })
      );
    } catch (error) {
      error instanceof Error && console.log(error.message);
      const app = await getConfigFromIndexedDB(true);

      dispatch(
        appAction.init({
          app: {
            ...app,
            datasources: app && (await preloadComponentsStaticData(app)),
          },
        })
      );
    } finally {
      setupWatch();
    }
  };

  const handleInit = () => {
    if (page === 'canvas') {
      const state = store.getState();
      document.removeEventListener('paste', handlePaste);
      const isInitApp =
        isEmpty(state.autoDV.past) && isEmpty(state.autoDV.future) && isEmpty(state.autoDV.present.compDatas);

      isInitApp && initApp();

      document.addEventListener('paste', handlePaste);
    }
  };

  useEffect(() => {
    handleInit();
  }, []); // eslint-disable-line

  return (
    <ThemeConfig>
      <section className="main">
        <LeftPannle />
        <div style={{ flex: 1, display: 'flex' }}>
          <Switch>
            <Route path="/editor/canvas/">
              <>
                <div style={{ width: '100%' }}>
                  <Header />
                  <CenterPannle />
                </div>
                <RightPannle />
              </>
            </Route>
            <Route path="/editor/user/:userPage">
              <User />
            </Route>
          </Switch>
        </div>
      </section>
      <GlobalHotKeys />
      <EditorGlobalStyle />
    </ThemeConfig>
  );
};

export default Editor;
