import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { actionStatusSelector, IActionStatus } from 'helpers/selectors';
import List from './List';
import { DELETE_COMP } from 'components/base/BaseActions';
import { Button, Tooltip, Position, Icon } from '@blueprintjs/core';
import AutoDVIcon from 'components/common/AutoDVIcon';
import { LeftPanelStyled } from './style';
import { selectEditorPanel } from 'store/selectors';
import { RootState } from 'store/index';
import { appAction } from 'store/features/appSlice';

const LeftPanel: React.FC = () => {
  const panel = useSelector(selectEditorPanel);
  const [small, setSmall] = useState(false);
  const actionStatus = useSelector<RootState, IActionStatus>((state) => actionStatusSelector(state.autoDV.present));
  const dispatch = useDispatch();
  const {
    disable_moveup,
    disable_movedown,
    disable_move2head,
    disable_move2foot,
    disable_del,
    disable_lock,
    disable_hide,
    highlight_lock,
    highlight_hide,
  } = actionStatus;

  return (
    <LeftPanelStyled visible={panel.compList}>
      <div className="panel-head">
        <span>图层</span>
        <div className="action" style={{ marginRight: -2 }}>
          <Button
            small={true}
            minimal={true}
            icon={<Icon icon="menu" iconSize={14} />}
            intent={small ? 'primary' : 'none'}
            onClick={() => setSmall(true)}
          />
          <Button
            small={true}
            minimal={true}
            icon={<Icon icon="properties" iconSize={14} />}
            intent={small ? 'none' : 'primary'}
            onClick={() => setSmall(false)}
          />
        </div>
      </div>
      <div className="panel-actions">
        <Tooltip disabled={disable_moveup} content="上移" position={Position.BOTTOM}>
          <Button
            small={true}
            minimal={true}
            disabled={disable_moveup}
            icon={<AutoDVIcon size={14} icon="autoDV-shangyi" />}
            onClick={() => dispatch(appAction.moveComp({ direction: 'UP', isEnd: false }))}
          />
        </Tooltip>
        <Tooltip disabled={disable_movedown} content="下移" position={Position.BOTTOM}>
          <Button
            small={true}
            minimal={true}
            disabled={disable_movedown}
            icon={<AutoDVIcon size={14} icon="autoDV-shangyi" flipY={true} />}
            onClick={() => dispatch(appAction.moveComp({ direction: 'DOWN', isEnd: false }))}
          />
        </Tooltip>
        <Tooltip disabled={disable_move2head} content="置顶" position={Position.BOTTOM}>
          <Button
            small={true}
            minimal={true}
            disabled={disable_move2head}
            icon={<AutoDVIcon size={14} icon="autoDV-zhiding" />}
            onClick={() => dispatch(appAction.moveComp({ direction: 'UP', isEnd: true }))}
          />
        </Tooltip>
        <Tooltip disabled={disable_move2foot} content="置底" position={Position.BOTTOM}>
          <Button
            small={true}
            minimal={true}
            disabled={disable_move2foot}
            icon={<AutoDVIcon size={14} icon="autoDV-zhiding" flipY={true} />}
            onClick={() => dispatch(appAction.moveComp({ direction: 'DOWN', isEnd: true }))}
          />
        </Tooltip>
      </div>
      <List small={small} />
      <div className="panel-actions">
        <Tooltip disabled={disable_del} content="删除" position={Position.TOP}>
          <Button
            disabled={disable_del}
            small={true}
            minimal={true}
            icon={<Icon iconSize={14} icon="trash" />}
            onClick={() => DELETE_COMP()}
          />
        </Tooltip>
        <Tooltip disabled={disable_lock} content="锁定" position={Position.TOP}>
          <Button
            small={true}
            minimal={true}
            disabled={disable_lock}
            intent={highlight_lock ? 'primary' : 'none'}
            icon={<Icon iconSize={14} icon="lock" />}
            onClick={() => dispatch(appAction.toggleCompStatus({ status: 'locked' }))}
          />
        </Tooltip>
        <Tooltip disabled={disable_hide} content="隐藏" position={Position.TOP}>
          <Button
            small={true}
            minimal={true}
            disabled={disable_hide}
            intent={highlight_hide ? 'primary' : 'none'}
            icon={<Icon iconSize={14} icon="eye-off" />}
            onClick={() => dispatch(appAction.toggleCompStatus({ status: 'hided' }))}
          />
        </Tooltip>
      </div>
    </LeftPanelStyled>
  );
};

export default LeftPanel;
