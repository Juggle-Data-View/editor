import { useRef } from 'react';
import useCanvasStyle from './useCanvasStyle';
import EnhancedComp from './Comp';
import CompWrapper from './CompWrapper';
import { CANVAS_ID } from 'config/const';
import { useSelector } from 'react-redux';
import { selectDatasources } from 'store/selectors';
import { JuggleDV } from '@juggle-data-view/types';

interface ICanvas {
  isInEditor: boolean;
  comps: JuggleDV.Comp[];
  canvas: JuggleDV.Canvas;
  selectedCompCodes?: string[];
}

const Canvas = ({ isInEditor, comps, canvas, selectedCompCodes }: ICanvas) => {
  const canvasStyle = useCanvasStyle(canvas, isInEditor);
  const ref = useRef<HTMLDivElement>(null);
  const datasources = useSelector(selectDatasources);

  return (
    <div ref={ref} id={CANVAS_ID} className="autoDV-canvas" style={canvasStyle}>
      {comps.map((comp, index) => {
        const { code, dataConfig } = comp;
        const isSelected = selectedCompCodes ? selectedCompCodes.includes(code) : false;
        const datasource = dataConfig ? datasources[dataConfig.dataSourceId] : undefined;
        return (
          <CompWrapper key={code} isInEditor={isInEditor} isSelected={isSelected} compData={comp} index={index}>
            <EnhancedComp compData={comp} isSelected={isSelected} isInEditor={isInEditor} datasource={datasource} />
          </CompWrapper>
        );
      })}
    </div>
  );
};

export default Canvas;
