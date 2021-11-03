import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Button, ButtonGroup, Tooltip, Position } from '@blueprintjs/core';
import { HistoryStyled } from './style';
import { editorAction } from 'store/features/editorSlice';
import { ActionCreators } from 'assets/lib/redux-undo';
import { selectUndo } from 'store/selectors';

const History: React.FC = () => {
  // TODO: any -> RootState
  const { past, future } = useSelector(selectUndo);
  const [isActive, setIsActive] = useState<boolean>(false);
  const dispatch = useDispatch();
  return (
    <HistoryStyled>
      <ButtonGroup>
        <Tooltip disabled={!past.length} content="后退" position={Position.BOTTOM}>
          <Button
            icon="undo"
            disabled={!past.length}
            onClick={() => {
              dispatch(ActionCreators.undo());
            }}
          />
        </Tooltip>
        <Tooltip disabled={!future.length} content="前进" position={Position.BOTTOM}>
          <Button
            icon="undo"
            disabled={!future.length}
            style={{ transform: 'scale(-1, 1)' }}
            onClick={() => {
              dispatch(ActionCreators.redo());
            }}
          />
        </Tooltip>
        <Tooltip content="历史记录" position={Position.BOTTOM}>
          <Button
            intent={isActive ? 'primary' : 'none'}
            icon="history"
            onClick={() => {
              dispatch(editorAction.togglePanel('history'));
              setIsActive(!isActive);
            }}
          />
        </Tooltip>
      </ButtonGroup>
    </HistoryStyled>
  );
};

export default History;
