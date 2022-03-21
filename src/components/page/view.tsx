import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import Canvas from 'components/views/center/Canvas';
import fetchAppConfig from 'helpers/fetchAppConfig';
import PageLoading from 'components/common/PageLoading';
import { AutoDV } from 'auto-dv-type';
import { appAction } from 'store/features/appSlice';

/**
 * ----------------------------
 * View
 * ----------------------------
 */

const View = (props: { url?: string }) => {
  const { url } = props;
  const [canvas, setCanvas] = useState<AutoDV.AppConfig['canvas']>();
  const dispatch = useDispatch();

  const setApp = async () => {
    try {
      // 判断是编排系统还是内嵌iframe
      const app = await fetchAppConfig(url);
      dispatch(appAction.init({ app }));
      // 如果是iframe，则跟需要根据app.name去取fakeIFrameVars里边的参数
      setCanvas(app.canvas);
    } catch (error) {
      throw error;
    }
  };

  useEffect(() => {
    setApp();
  }, []); // eslint-disable-line

  return (
    <>
      {canvas && canvas.compInsts ? (
        <Canvas canvas={canvas} comps={canvas.compInsts} isInEditor={false} />
      ) : (
        <PageLoading />
      )}
    </>
  );
};

export default View;
