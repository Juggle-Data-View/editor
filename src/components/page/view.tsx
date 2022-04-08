import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import Canvas from 'components/views/center/Canvas';
import PageLoading from 'components/common/PageLoading';
import { JuggleDV } from '@juggle-data-view/types';
import { appAction } from 'store/features/appSlice';
import { qs } from 'utils';

/**
 * ----------------------------
 * View
 * ----------------------------
 */

const View = () => {
  const [canvas, setCanvas] = useState<JuggleDV.AppConfig['canvas']>();
  const dispatch = useDispatch();

  const getConfigFromIndexedDB = async () => {
    //It has error if import on file top
    const DB = (await import('store/DB')).default;
    try {
      return await DB.getConfigByAPPID(Number(qs.query.id));
    } catch (error) {
      console.log(error);
      return await DB.getDefaultConfig();
    }
  };

  const setApp = async () => {
    try {
      const app = await getConfigFromIndexedDB();
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
