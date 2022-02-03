import { useDispatch, useSelector } from 'react-redux';
import { MenuList, MenuItem } from '@mui/material';
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
        <MenuList style={{ background: 'transparent' }}>
          {past.map((step: AutoDV.State, index: number) => {
            return (
              <MenuItem
                className="undo-past"
                key={index}
                onClick={() => {
                  dispatch(ActionCreators.jumpToPast(index));
                }}
              >
                {step.actionAlias || DEFAULT_ACTION}
              </MenuItem>
            );
          })}
          {_latestUnfiltered ? (
            <MenuItem className="undo-present">{_latestUnfiltered.actionAlias || DEFAULT_ACTION}</MenuItem>
          ) : null}
          {future.map((step: AutoDV.State, index: number) => {
            return (
              <MenuItem
                className="undo-future"
                key={index}
                onClick={() => {
                  dispatch(ActionCreators.jumpToFuture(index));
                }}
              >
                {step.actionAlias}
              </MenuItem>
            );
          })}
        </MenuList>
      </div>
    </HistoryPanelStyled>
  );
};

export default HistoryList;
