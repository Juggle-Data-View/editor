import { useDispatch } from 'react-redux';
import setupWatch from '@store/watcher';
import { EditorGlobalStyle } from 'assets/style';
import fetchAppConfig from 'helpers/fetchAppConfig';
import { appAction } from '@store/features/appSlice';
import Header from '@page/editor/Header';
import LeftPannle from '@page/editor/LeftPanel';
import CenterPannle from '@page/canvas';
import RightPannle from '@page/editor/RightPanel';
import GlobalHotKeys from '@components/common/GlobalHotKeys';
import { CANVAS_ID, COPY_KEY } from '@configurableComponents/const';
import notice from '@utils/notice';
import { transContent } from 'helpers/importHelper';
import DB from '@store/DB';
import { qs } from 'utils';
import { useEffect } from 'react';
import ThemeConfig from '@configurableComponents/theme';
import { Route, Switch, useHistory, useParams } from 'react-router-dom';
import User from './User';
import { User as UserInstance } from 'parse';

const Editor = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const { userPage } = useParams<RouterParams>();

  const { page } = useParams<{
    page: 'canvas' | 'user';
  }>();

  const handleAutoAuth = () => {
    const currentUser = UserInstance.current();

    if (userPage !== 'auth') {
      return;
    }

    if (currentUser) {
      history.push('/editor/canvas');
    } else {
      history.push('/editor/user/auth');
    }
  };

  const getConfigFromIndexedDB = async () => {
    try {
      const app = await DB.getConfigByAPPID(Number(qs.query.id));
      dispatch(appAction.init({ app }));
    } catch (error) {
      console.log(error);
      const app = await DB.getDefaultConfig();
      dispatch(appAction.init({ app }));
    }
  };

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

  const initApp = async () => {
    //TODO: Not request when app info is same
    if (!window.navigator.onLine) {
      await getConfigFromIndexedDB();
    }
    try {
      const app = await fetchAppConfig();
      const isInit = await DB.needInitDB(app);
      if (isInit) {
        dispatch(appAction.init({ app }));
        await DB.initDB(app);
      } else {
        await getConfigFromIndexedDB();
      }
    } catch (error) {
      notice.alert('On offline mode');
      await getConfigFromIndexedDB();
    }

    setupWatch();
  };

  useEffect(() => {
    if (page === 'canvas') {
      document.removeEventListener('paste', handlePaste);
      initApp();
      document.addEventListener('paste', handlePaste);
    } else {
      handleAutoAuth();
    }
  }, [page]); // eslint-disable-line

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
