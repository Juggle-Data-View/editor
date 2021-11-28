import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
// import { Button, ButtonGroup, Tooltip, Position } from '@blueprintjs/core';
import { ButtonGroup, Tooltip, IconButton } from '@mui/material';
import FastForwardIcon from '@mui/icons-material/FastForward';
import FastRewindIcon from '@mui/icons-material/FastRewind';
import HistoryIcon from '@mui/icons-material/History';
import { HistoryStyled } from './style';
import { editorAction } from 'store/features/editorSlice';
import { ActionCreators } from 'assets/lib/redux-undo';
import { selectUndo } from 'store/selectors';
import Language from 'constant/content';

const History: React.FC = () => {
  // TODO: any -> RootState
  const { past, future } = useSelector(selectUndo);
  const [isActive, setIsActive] = useState<boolean>(false);
  const dispatch = useDispatch();
  return (
    <HistoryStyled>
      <ButtonGroup>
        <Tooltip title={Language.back} placement="bottom" arrow>
          <IconButton
            aria-label="back"
            disabled={!past.length}
            onClick={() => {
              dispatch(ActionCreators.undo());
            }}
          >
            <FastRewindIcon fontSize="large" />
          </IconButton>
        </Tooltip>
        <Tooltip title="前进" placement="bottom-start" arrow>
          <IconButton
            aria-label="undo"
            disabled={!future.length}
            onClick={() => {
              dispatch(ActionCreators.redo());
            }}
          >
            <FastForwardIcon fontSize="large" />
          </IconButton>
        </Tooltip>
        <Tooltip title="历史记录" placement="bottom" arrow>
          <IconButton
            aria-label="history"
            onClick={() => {
              dispatch(editorAction.togglePanel('history'));
              setIsActive(!isActive);
            }}
          >
            <HistoryIcon fontSize="large" />
          </IconButton>
        </Tooltip>
      </ButtonGroup>
    </HistoryStyled>
  );
};

export default History;
