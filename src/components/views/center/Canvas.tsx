import { useEffect, useRef } from 'react';
import useCanvasStyle from './useCanvasStyle';
import EnhancedComp from './Comp';
import { createIO, SocketLinkType } from 'utils/webscoketGateway';
import global from 'utils/global';
import { getViewStatus } from 'utils/index';
import CompWrapper from './CompWrapper';
import { CANVAS_ID } from 'config/const';
import { useSelector } from 'react-redux';
import { selectDatasources } from 'store/selectors';
import { AutoDV } from 'auto-dv-type';

interface ICanvas {
  isInEditor: boolean;
  comps: AutoDV.Comp[];
  canvas: AutoDV.Canvas;
  selectedCompCodes?: string[];
}

const Canvas = ({ isInEditor, comps, canvas, selectedCompCodes }: ICanvas) => {
  const canvasStyle = useCanvasStyle(canvas, isInEditor);
  const ref = useRef<HTMLDivElement>(null);
  const datasources = useSelector(selectDatasources);

  useEffect(() => {
    if (global.wssType !== 1) return;
    const type: SocketLinkType = getViewStatus().isPreview ? 'edit' : 'online';
    global.io = createIO({ appId: global.appId, type });
  }, []);

  return (
    <div ref={ref} id={CANVAS_ID} className="autoDV-canvas" style={canvasStyle}>
      {comps.map((comp, index) => {
        const { code, dataConfig } = comp;
        const isSelected = selectedCompCodes ? selectedCompCodes.includes(code) : false;
        const datasource = dataConfig ? datasources[dataConfig.dataSourceId] : undefined;
        return (
          <CompWrapper key={code} isInEditor={isInEditor} isSelected={isSelected} compData={comp} index={index}>
            <EnhancedComp
              compData={comp}
              isSelected={isSelected}
              isInEditor={isInEditor}
              comps={comps}
              datasource={datasource}
            />
          </CompWrapper>
        );
      })}
    </div>
  );
};

export default Canvas;
