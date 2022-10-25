import { useDispatch, useSelector } from 'react-redux';
import { HistoryItem, HistoryPanelStyled } from './style';
import { ActionCreators } from 'assets/lib/redux-undo';
import { selectUndo, selectEditorPanel } from '@store/selectors';
import { Divider, IconButton } from '@mui/material';
import { Close } from '@mui/icons-material';
import { editorAction } from '@store/features/editorSlice';
import { JuggleDV } from '@juggle-data-view/types';

const DEFAULT_ACTION = 'DEFAULT_ACTION';

const HistoryList: React.FC = () => {
  const { past, future, _latestUnfiltered } = useSelector(selectUndo);
  const panel = useSelector(selectEditorPanel);
  const dispatch = useDispatch();

  return (
    <HistoryPanelStyled visible={panel.history}>
      <div className="panel-head">
        <div className="common-title">历史记录</div>
        <IconButton onClick={() => dispatch(editorAction.togglePanel('history'))}>
          <Close />
        </IconButton>
      </div>
      <Divider />
      <div className="panel-body">
        <div style={{ background: 'transparent' }}>
          {past.map((step: JuggleDV.State, index: number) => {
            return (
              <HistoryItem
                isPast
                className="undo-past"
                onClick={() => {
                  dispatch(ActionCreators.jumpToPast(index));
                }}
                key={index}
                color="secondary"
              >
                {step.actionAlias || DEFAULT_ACTION}
              </HistoryItem>
            );
          })}
          {_latestUnfiltered ? (
            <HistoryItem select key="undo-present" className="present-item" style={{ color: '#fff' }}>
              {_latestUnfiltered.actionAlias || DEFAULT_ACTION}
            </HistoryItem>
          ) : null}
          {future.map((step: JuggleDV.State, index: number) => {
            return (
              <HistoryItem
                className="undo-future"
                key={index}
                onClick={() => {
                  dispatch(ActionCreators.jumpToFuture(index));
                }}
              >
                {step.actionAlias}
              </HistoryItem>
            );
          })}
        </div>
      </div>
    </HistoryPanelStyled>
  );
};

export default HistoryList;
