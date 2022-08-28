import React, { useState, useEffect } from 'react';
import { JuggleDV } from '@juggle-data-view/types';
import { useSelector } from 'react-redux';
import global from '@utils/global';
import { selectEditor } from '@store/selectors';

// 根据缩放方式设置样式
const getZoomStyle = (canvas: JuggleDV.Canvas) => {
  const { zoomType } = canvas;
  const { clientWidth, clientHeight } = document.documentElement;
  const scaleX = clientWidth / canvas.width;
  const scaleY = clientHeight / canvas.height;
  const root = document.getElementById('root');

  if (!root) return {};

  let zoomStyle: React.CSSProperties = {};

  if (zoomType === 1) {
    zoomStyle = {
      transform: `scale(${scaleX})`,
      transformOrigin: 'left top',
    };
  }

  if (zoomType === 2) {
    zoomStyle = {
      transform: `scale(${scaleY})`,
      transformOrigin: 'left top',
    };
  }

  if (zoomType === 3) {
    return {
      transform: `scale(${scaleX}, ${scaleY})`,
      transformOrigin: 'left top',
    };
  }

  if (zoomType === 4 || zoomType === 5) {
    root.style.display = 'flex';
    root.style.justifyContent = 'center';
    root.style.alignItems = 'center';
    zoomStyle = {
      flex: 'none', // 去除子元素的弹性设置
    };
  }

  if (zoomType === 4) {
    if (clientHeight < canvas.height * scaleX) {
      root.style.height = canvas.height * scaleX + 'px';
    }
    zoomStyle.transform = `scale(${scaleX})`;
  }

  if (zoomType === 5) {
    if (clientWidth < canvas.width * scaleY) {
      root.style.width = canvas.width * scaleY + 'px';
    }
    zoomStyle.transform = `scale(${scaleY})`;
  }

  return zoomStyle;
};

const useCanvasStyle = (canvas: JuggleDV.Canvas, isInEditor: boolean) => {
  const [zoom, setZoom] = useState<React.CSSProperties>({});
  const { canvasRatio } = useSelector(selectEditor);

  const style: React.CSSProperties = {
    width: canvas.width,
    height: canvas.height,
    backgroundColor: canvas.backgroundColor || '#0c2a42',
  };

  if (canvas.backgroundImg) {
    style.backgroundImage = `url(${canvas.backgroundImg})`;
    style.backgroundRepeat = 'no-repeat';
  }

  if (isInEditor) {
    style.boxShadow = `rgba(0, 0, 0, 0.5) 0 0 20px 0`;
    style.transform = `scale(${canvasRatio})`;
    style.transformOrigin = 'left top';
  }

  useEffect(() => {
    if (isInEditor) return; // 编排系统中不触发画布的resize
    function resize() {
      const zs = getZoomStyle(canvas);
      setZoom(zs);
      global.zoomStyle = zs;
    }
    resize();
    window.addEventListener('resize', resize);
    return () => window.removeEventListener('resize', resize);
  }, [canvas, isInEditor]);

  return {
    ...style,
    ...zoom,
  };
};

export default useCanvasStyle;
