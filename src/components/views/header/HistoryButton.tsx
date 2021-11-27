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
        <Tooltip disableHoverListener={!past.length} title={Language.back} placement="bottom">
          <IconButton
            aria-label="back"
            disabled={!past.length}
            onClick={() => {
              dispatch(ActionCreators.undo());
            }}
          >
            <FastForwardIcon />
          </IconButton>
        </Tooltip>
        <Tooltip disableHoverListener={!future.length} title="前进" placement="bottom">
          <IconButton
            aria-label="undo"
            disabled={!future.length}
            onClick={() => {
              dispatch(ActionCreators.redo());
            }}
          >
            <FastRewindIcon />
          </IconButton>
        </Tooltip>
        <Tooltip title="历史记录" placement="bottom">
          <IconButton
            disabled={isActive}
            aria-label="history"
            onClick={() => {
              dispatch(editorAction.togglePanel('history'));
              setIsActive(!isActive);
            }}
          >
            <HistoryIcon />
          </IconButton>
        </Tooltip>
      </ButtonGroup>
    </HistoryStyled>
  );
};

export default History;
