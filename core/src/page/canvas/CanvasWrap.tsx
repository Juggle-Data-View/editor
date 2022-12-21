import React, { useRef, useEffect, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Canvas from './Canvas';
import { CircularProgress } from '@mui/material';
import { CanvasWrapStyled } from './style';
import MoveAble from './MoveAble';
import { showContextMenu } from 'helpers/contextMenu';
import { CANVAS_ID } from '@configurableComponents/const';
import { editorAction } from '@store/features/editorSlice';
import { appAction } from '@store/features/appSlice';
import { selectEditor, selectJuggleDV } from '@store/selectors';
import MyRuler from './Ruler';
import useResize from '@components/base/useResize';
import { JuggleDV } from '@juggle-data-view/types';

const CanvasWrap: React.FC = () => {
  const { canvasRatio, canvasPadding: padding } = useSelector(selectEditor);
  const { app, canvas, selectedCompCodes, compDatas, compCodes } = useSelector(selectJuggleDV);
  const { id } = app;
  const comps = useMemo(() => compCodes.map((code) => compDatas[code]), [compCodes, compDatas]);
  const isAppLoaded = !!id;
  const screenRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLDivElement>(null);
  const thick = 16;
  const dispatch = useDispatch();

  const handleScreenClick = () => {
    if (selectedCompCodes.length) {
      // 拖拽选中组件后，如果鼠标抬起位置在画布之外，会触发取消选中
      // 所以记录鼠标点击和抬起的元素，将取消选中的范围缩小到点击触发
      dispatch(appAction.unSelectComp());
    }
  };

  // 获取canvas自适应比例
  const getAdaptiveScale = (canvas: JuggleDV.Canvas) => {
    if (!screenRef.current) return 1;
    const screen = screenRef.current.getBoundingClientRect();
    const screenInner = {
      width: screen.width - padding * 2 - thick,
      height: screen.height - padding * 2 - thick,
    };
    const screenRatio = screenInner.width / screenInner.height;
    const canvasRatio = canvas.width / canvas.height;
    let scale = 1;
    if (screenRatio <= canvasRatio) {
      // 以宽度为标准, 否则以高
      scale = screenInner.width / canvas.width;
    } else {
      scale = screenInner.height / canvas.height;
    }
    return scale;
  };

  useResize(
    () => {
      const scale = getAdaptiveScale(canvas);
      dispatch(editorAction.setAdaptiveScale(scale));
    },
    { target: screenRef, wait: 300 },
    [canvas]
  );

  useEffect(() => {
    const scale = getAdaptiveScale(canvas);
    dispatch(editorAction.zoomCanvas(scale));
  }, [canvas]); // eslint-disable-line

  // 选中元素发生变化时清空 hoverIndex
  useEffect(() => {
    dispatch(editorAction.compHover([]));
  }, [selectedCompCodes, dispatch]);

  return (
    <CanvasWrapStyled>
      <MyRuler container={screenRef} />
      <div ref={screenRef} className="screen" onClick={handleScreenClick}>
        {isAppLoaded ? (
          <div
            className="screen-child"
            style={{
              width: canvas.width * canvasRatio,
              height: canvas.height * canvasRatio,
              padding,
              paddingTop: padding + thick,
              paddingLeft: padding + thick,
              boxSizing: 'content-box',
              position: 'relative',
            }}
          >
            <div
              ref={canvasRef}
              style={{ height: '100%', position: 'relative', zIndex: 1 }}
              onContextMenu={(e) => {
                const isCanvas = (e.target as HTMLElement).id === CANVAS_ID;
                if (selectedCompCodes.length && !isCanvas) {
                  showContextMenu(e);
                }
              }}
            >
              <Canvas comps={comps} canvas={canvas} isInEditor={true} selectedCompCodes={selectedCompCodes} />
              {screenRef.current && <MoveAble scrollContainer={screenRef.current} />}
            </div>
          </div>
        ) : (
          <div style={{ position: 'absolute', left: '50%', top: 200, transform: 'translate(-50%,0)' }}>
            <CircularProgress />
          </div>
        )}
      </div>
    </CanvasWrapStyled>
  );
};

export default CanvasWrap;
