import React from 'react';
import { useDispatch } from 'react-redux';
import setupWatch from 'store/watcher';
import { EditorGlobalStyle } from 'assets/style';
import fetchAppConfig from 'helpers/fetchAppConfig';
import withTheme from 'components/base/withTheme';
import { appAction } from 'store/features/appSlice';
import { useRequest, useMount } from 'ahooks';
import Header from 'components/views/header';
import LeftPannle from 'components/views/leftPanel';
import CenterPannle from 'components/views/center';
import RightPannle from 'components/views/rightPanel';
import GlobalHotKeys from 'components/common/GlobalHotKeys';
import { CANVAS_ID, COPY_KEY } from 'config/const';
import notice from 'utils/notice';
import { transContent } from 'helpers/importHelper';

const Editor = () => {
  const dispatch = useDispatch();
  useRequest(fetchAppConfig, {
    onSuccess(app) {
      dispatch(appAction.init({ app }));
      setupWatch(); // 监听数据变化
    },
    onError(err) {
      notice.error(`fetchApp Error:`, err);
    },
  });

  useMount(() => {
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
        notice.error(error.message);
      }
    });
  });

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

export default withTheme(Editor);
