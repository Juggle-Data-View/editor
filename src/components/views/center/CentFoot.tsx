import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import AutoDVIcon from 'components/common/AutoDVIcon';
import { Button, Slider, Tooltip, TextField, InputAdornment } from '@mui/material';
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
      open={error}
      title={`超出限定范围: (${MIN_CANVAS_RATIO * 100} - ${MAX_CANVAS_RATIO * 100})%`}
      placement="top"
      disableInteractive={false}
    >
      <TextField
        type="number"
        size="small"
        value={numeral(ratio * 100).format('0')}
        InputProps={{
          endAdornment: <InputAdornment position="end">%</InputAdornment>,
        }}
        onChange={(e) => {
          const value = Number(e.target.value);
          const val = +numeral(value / 100).format('0.[00]');
          if (val < MIN_CANVAS_RATIO || val > MAX_CANVAS_RATIO) {
            setError(true);
          } else {
            dispatch(editorAction.zoomCanvas(val));
            setError(false);
          }
        }}
      />
    </Tooltip>
  );
};

const CentFoot: React.FC = () => {
  const { canvasRatio } = useSelector(selectEditor);
  const dispatch = useDispatch();

  return (
    <CentFootStyled>
      <div className="left" />
      <div className="right">
        <div className="icons">
          <Button onClick={() => dispatch(editorAction.zoomCanvas(1))}>
            <Tooltip placement="top" title="实际大小">
              <AutoDVIcon icon="autoDV-native" size={18} />
            </Tooltip>
          </Button>
          <Button onClick={() => dispatch(editorAction.zoomCanvas('auto'))}>
            <Tooltip placement="top" title="自适应">
              <AutoDVIcon icon="autoDV-suitable" size={18} />
            </Tooltip>
          </Button>
        </div>
        <div className="slider">
          <Slider
            value={canvasRatio}
            min={MIN_CANVAS_RATIO}
            max={MAX_CANVAS_RATIO}
            step={0.01}
            onChange={(event, val) => {
              if (!Array.isArray(val)) dispatch(editorAction.zoomCanvas(val));
            }}
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
