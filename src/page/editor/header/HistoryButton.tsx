import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { ButtonGroup, Tooltip, IconButton } from '@mui/material';
import FastForwardIcon from '@mui/icons-material/FastForward';
import FastRewindIcon from '@mui/icons-material/FastRewind';
import HistoryIcon from '@mui/icons-material/History';
import { HistoryStyled } from './style';
import { editorAction } from '@store/features/editorSlice';
import { ActionCreators } from 'assets/lib/redux-undo';
import { selectUndo } from '@store/selectors';
import useLang from '@components/base/useLang';

const History: React.FC = () => {
  // TODO: any -> RootState
  const { past, future } = useSelector(selectUndo);
  const [isActive, setIsActive] = useState<boolean>(false);
  const dispatch = useDispatch();
  const Language = useLang();
  return (
    <HistoryStyled>
      <ButtonGroup>
        <IconButton
          aria-label="back"
          disabled={!past.length}
          onClick={() => {
            dispatch(ActionCreators.undo());
          }}
        >
          <Tooltip title={Language.undo} placement="bottom" arrow>
            <FastRewindIcon fontSize="large" />
          </Tooltip>
        </IconButton>
        <IconButton
          aria-label="undo"
          disabled={!future.length}
          onClick={() => {
            dispatch(ActionCreators.redo());
          }}
        >
          <Tooltip title="前进" placement="bottom-start" arrow>
            <FastForwardIcon fontSize="large" />
          </Tooltip>
        </IconButton>
        <IconButton
          aria-label="history"
          onClick={() => {
            dispatch(editorAction.togglePanel('history'));
            setIsActive(!isActive);
          }}
        >
          <Tooltip title="历史记录" placement="bottom" arrow>
            <HistoryIcon fontSize="large" />
          </Tooltip>
        </IconButton>
      </ButtonGroup>
    </HistoryStyled>
  );
};

export default History;
