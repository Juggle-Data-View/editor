import { useDispatch } from 'react-redux';
import setupWatch from 'store/watcher';
import { EditorGlobalStyle } from 'assets/style';
import fetchAppConfig from 'helpers/fetchAppConfig';
import { appAction } from 'store/features/appSlice';
import Header from 'components/views/header';
import LeftPannle from 'components/views/leftPanel';
import CenterPannle from 'components/views/center';
import RightPannle from 'components/views/rightPanel';
import GlobalHotKeys from 'components/common/GlobalHotKeys';
import { CANVAS_ID, COPY_KEY } from 'config/const';
import notice from 'utils/notice';
import { transContent } from 'helpers/importHelper';
import DB from 'store/DB';
import { qs } from 'utils';
import { useEffect } from 'react';

const Editor = () => {
  const dispatch = useDispatch();

  const getConfigFromIndexedDB = async () => {
    const app = await DB.getConfigByAPPID(Number(qs.query.id));
    dispatch(appAction.init({ app }));
  };

  const initApp = async () => {
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
      notice.toast({ message: 'On offline mode' });
      await getConfigFromIndexedDB();
    }

    setupWatch();
  };

  useEffect(() => {
    initApp();
    document.addEventListener('paste', (event: any) => {
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
    });
  }, []); // eslint-disable-line

  return (
    <>
      <Header />
      <section className="autoDV-main">
        <LeftPannle />
        <CenterPannle />
        <RightPannle />
      </section>
      <GlobalHotKeys />
      <EditorGlobalStyle />
    </>
  );
};

// export default withTheme(Editor);
export default Editor;
