import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { actionStatusSelector, IActionStatus } from 'helpers/selectors';
import { Button, Tooltip } from '@mui/material';
import List from './List';
import { DELETE_COMP } from 'components/base/BaseActions';
// import { Button, Tooltip, Position, Icon } from '@blueprintjs/core';
import AutoDVIcon from 'components/common/AutoDVIcon';
import { LeftPanelStyled } from './style';
import { selectEditorPanel } from 'store/selectors';
import { RootState } from 'store/index';
import { appAction } from 'store/features/appSlice';
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted';
import ViewListIcon from '@mui/icons-material/ViewList';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import LockIcon from '@mui/icons-material/Lock';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';

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
    // highlight_lock,
    // highlight_hide,
  } = actionStatus;

  return (
    <LeftPanelStyled visible={panel.compList}>
      <div className="panel-head">
        <span>图层</span>
        <div className="action" style={{ marginRight: -2 }}>
          <Button onClick={() => setSmall(true)}>
            <FormatListBulletedIcon />
          </Button>
          <Button onClick={() => setSmall(false)}>
            <ViewListIcon />
          </Button>
        </div>
      </div>
      <div className="panel-actions">
        <Button
          disabled={disable_moveup}
          onClick={() => dispatch(appAction.moveComp({ direction: 'UP', isEnd: false }))}
        >
          <Tooltip title="上移" placement="bottom">
            <AutoDVIcon size={14} icon="autoDV-up" />
          </Tooltip>
        </Button>
        <Button
          disabled={disable_movedown}
          onClick={() => dispatch(appAction.moveComp({ direction: 'DOWN', isEnd: false }))}
        >
          <Tooltip title="下移" placement="bottom">
            <AutoDVIcon size={14} icon="autoDV-up" flipY={true} />
          </Tooltip>
        </Button>
        <Button
          disabled={disable_move2head}
          onClick={() => dispatch(appAction.moveComp({ direction: 'UP', isEnd: true }))}
        >
          <Tooltip title="置顶" placement="bottom">
            <AutoDVIcon size={14} icon="autoDV-top" flipY={true} />
          </Tooltip>
        </Button>
        <Button
          disabled={disable_move2foot}
          onClick={() => dispatch(appAction.moveComp({ direction: 'DOWN', isEnd: true }))}
        >
          <Tooltip title="置底" placement="bottom">
            <AutoDVIcon size={14} icon="autoDV-top" flipY={true} />
          </Tooltip>
        </Button>
      </div>
      <List small={small} />
      <div className="panel-actions">
        <Button disabled={disable_del} onClick={() => DELETE_COMP()}>
          <Tooltip title="删除" placement="top">
            <DeleteForeverIcon />
          </Tooltip>
        </Button>
        <Button disabled={disable_lock} onClick={() => dispatch(appAction.toggleCompStatus({ status: 'locked' }))}>
          <Tooltip title="锁定" placement="top">
            <LockIcon />
          </Tooltip>
        </Button>
        <Button disabled={disable_hide} onClick={() => dispatch(appAction.toggleCompStatus({ status: 'hided' }))}>
          <Tooltip title="隐藏" placement="top">
            <VisibilityOffIcon />
          </Tooltip>
        </Button>
      </div>
    </LeftPanelStyled>
  );
};

export default LeftPanel;
