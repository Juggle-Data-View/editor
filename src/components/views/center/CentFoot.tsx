import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import AutoDVIcon from 'components/common/AutoDVIcon';
import { Slider, Tooltip, Position, NumericInput, Tag, Button } from '@blueprintjs/core';
import { MIN_CANVAS_RATIO, MAX_CANVAS_RATIO } from 'config/const';
import { CentFootStyled } from './style';
import numeral from 'numeral';
import { editorAction } from 'store/features/editorSlice';
import { selectEditor } from 'store/selectors';

const RatioInput = ({ ratio }: { ratio: number }) => {
  const [error, setError] = useState<boolean>(false);
  const dispatch = useDispatch();

  return (
    <Tooltip
      isOpen={error}
      content={`超出限定范围: (${MIN_CANVAS_RATIO * 100} - ${MAX_CANVAS_RATIO * 100})%`}
      position={Position.TOP}
      intent="danger"
    >
      <NumericInput
        fill={true}
        asyncControl={true}
        intent={error ? 'danger' : 'none'}
        value={Math.round(ratio * 100)}
        min={MIN_CANVAS_RATIO * 100}
        max={MAX_CANVAS_RATIO * 100}
        rightElement={<Tag minimal={true}>%</Tag>}
        stepSize={1}
        onValueChange={(value: number) => {
          const val = +numeral(value / 100).format('0.[00]');
          if (val < MIN_CANVAS_RATIO || val > MAX_CANVAS_RATIO) {
            setError(true);
          } else {
            dispatch(editorAction.zoomCanvas(1));
            setError(false);
          }
        }}
        onBlur={(e: React.SyntheticEvent<HTMLInputElement>) => {
          const value = +e.currentTarget.value;
          if (!error) {
            dispatch(editorAction.zoomCanvas(value / 100));
          }
        }}
      />
    </Tooltip>
  );
};

const CentFoot: React.FC = () => {
  const { canvasRatio } = useSelector(selectEditor);
  const dispatch = useDispatch();

  useEffect(() => {
    const sliderHandle = document.querySelector('.foot-slider .bp3-slider-handle');
    if (sliderHandle) {
      // 移除焦点，解决方向键与移动组件的功能冲突
      sliderHandle.removeAttribute('tabIndex');
    }
  }, []);

  return (
    <CentFootStyled>
      <div className="left" />
      <div className="right">
        <div className="icons">
          <Tooltip targetClassName="btn" position={Position.TOP} content="实际大小">
            <Button
              minimal={true}
              small={true}
              icon={<AutoDVIcon icon="autoDV-normal" size={18} />}
              onClick={() => dispatch(editorAction.zoomCanvas(1))}
            />
          </Tooltip>
          <Tooltip targetClassName="btn" position={Position.TOP} content="自适应">
            <Button
              minimal={true}
              small={true}
              icon={<AutoDVIcon icon="autoDV-scale" size={18} />}
              onClick={() => dispatch(editorAction.zoomCanvas('auto'))}
            />
          </Tooltip>
        </div>
        <div className="slider">
          <Slider
            className="foot-slider"
            labelRenderer={false}
            showTrackFill={true}
            value={canvasRatio}
            min={MIN_CANVAS_RATIO}
            max={MAX_CANVAS_RATIO}
            stepSize={0.01}
            onChange={(val) => dispatch(editorAction.zoomCanvas(val))}
          />
        </div>
        <div className="action-input">
          <RatioInput ratio={canvasRatio} />
        </div>
      </div>
    </CentFootStyled>
  );
};

export default CentFoot;
