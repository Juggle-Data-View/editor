import { useDispatch, useSelector } from 'react-redux';
import { HistoryPanelStyled } from './style';
import { ActionCreators } from 'assets/lib/redux-undo';
import { selectUndo, selectEditorPanel } from 'store/selectors';

const DEFAULT_ACTION = 'DEFAULT_ACTION';

const HistoryList: React.FC = () => {
  const { past, future, _latestUnfiltered } = useSelector(selectUndo);
  const panel = useSelector(selectEditorPanel);
  const dispatch = useDispatch();

  return (
    <HistoryPanelStyled visible={panel.history}>
      <div className="panel-head">
        <div className="common-title">历史记录</div>
      </div>
      <div className="panel-body">
        <div style={{ background: 'transparent' }}>
          {past.map((step: AutoDV.State, index: number) => {
            return (
              <div
                className="undo-past"
                onClick={() => {
                  dispatch(ActionCreators.jumpToPast(index));
                }}
                key={index}
              >
                {step.actionAlias || DEFAULT_ACTION}
              </div>
            );
          })}
          {_latestUnfiltered ? (
            <div key="undo-present" className="undo-present">
              {_latestUnfiltered.actionAlias || DEFAULT_ACTION}
            </div>
          ) : null}
          {future.map((step: AutoDV.State, index: number) => {
            return (
              <div
                className="undo-future"
                key={index}
                onClick={() => {
                  dispatch(ActionCreators.jumpToFuture(index));
                }}
              >
                {step.actionAlias}
              </div>
            );
          })}
        </div>
      </div>
    </HistoryPanelStyled>
  );
};

export default HistoryList;
