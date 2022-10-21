import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import Canvas from '@page/canvas/Canvas';
import PageLoading from '@components/common/PageLoading';
import { JuggleDV } from '@juggle-data-view/types';
import { appAction } from '@store/features/appSlice';
import { getConfigFromIndexedDB } from 'utils';

/**
 * ----------------------------
 * View
 * ----------------------------
 */

const View = () => {
  const [canvas, setCanvas] = useState<JuggleDV.AppConfig['canvas']>();
  const dispatch = useDispatch();

  const setApp = async () => {
    try {
      const app = await getConfigFromIndexedDB(false);
      if (!app) {
        //Get empty app config
        return;
      }
      dispatch(appAction.init({ app }));
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
