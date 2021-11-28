import { useDispatch, useSelector } from 'react-redux';
import { Menu, MenuItem } from '@blueprintjs/core';
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
        <Menu style={{ background: 'transparent' }}>
          {/* 历史操作 */}
          {past.map((step: AutoDV.State, index: number) => {
            return (
              <MenuItem
                className="undo-past"
                shouldDismissPopover={false}
                key={index}
                text={step.actionAlias || DEFAULT_ACTION}
                onClick={() => {
                  dispatch(ActionCreators.jumpToPast(index));
                }}
              />
            );
          })}
          {/* 当前操作 */}
          {_latestUnfiltered ? (
            <MenuItem
              className="undo-present"
              active={true}
              shouldDismissPopover={false}
              text={_latestUnfiltered.actionAlias || DEFAULT_ACTION}
            />
          ) : null}
          {/* 将来操作 */}
          {future.map((step: AutoDV.State, index: number) => {
            return (
              <MenuItem
                className="undo-future"
                shouldDismissPopover={false}
                key={index}
                text={step.actionAlias}
                onClick={() => {
                  dispatch(ActionCreators.jumpToFuture(index));
                }}
              />
            );
          })}
        </Menu>
      </div>
    </HistoryPanelStyled>
  );
};

export default HistoryList;
