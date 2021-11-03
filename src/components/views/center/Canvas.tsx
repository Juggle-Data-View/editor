import React, { useEffect, useRef } from 'react';
import useCanvasStyle from './useCanvasStyle';
import EnhancedComp from './Comp';
import useRecivers from 'components/base/useRecivers';
import { createIO, SocketLinkType } from 'utils/webscoketGateway';
import global from 'utils/global';
import { getViewStatus } from 'utils/index';
import CompWrapper from './CompWrapper';
import { CANVAS_ID } from 'config/const';

interface ICanvas {
  isInEditor: boolean;
  comps: AutoDV.Comp[];
  canvas: AutoDV.Canvas;
  selectedCompCodes?: string[];
}

const Canvas = ({ isInEditor, comps, canvas, selectedCompCodes }: ICanvas) => {
  const canvasStyle = useCanvasStyle(canvas, isInEditor);
  const recivers = useRecivers();
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (global.wssType !== 1) return;
    const type: SocketLinkType = getViewStatus().isPreview ? 'edit' : 'online';
    global.io = createIO({ appId: global.appId, type });
  }, []);

  return (
    <div ref={ref} id={CANVAS_ID} className="autoDV-canvas" style={canvasStyle}>
      {comps.map((comp, index) => {
        const { code } = comp;
        const isSelected = selectedCompCodes ? selectedCompCodes.includes(code) : false;
        return (
          <CompWrapper key={code} isInEditor={isInEditor} isSelected={isSelected} compData={comp} index={index}>
            <EnhancedComp
              compData={comp}
              isSelected={isSelected}
              isInEditor={isInEditor}
              reciver={recivers[code]}
              comps={comps}
            />
          </CompWrapper>
        );
      })}
    </div>
  );
};

export default Canvas;
