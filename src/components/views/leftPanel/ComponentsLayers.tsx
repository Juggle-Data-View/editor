import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { actionStatusSelector, IActionStatus } from 'helpers/selectors';
import { Button, ButtonGroup, Tooltip } from '@mui/material';
import List from './List';
import { DELETE_COMP } from 'components/base/BaseActions';
import JuggleDVIcon from 'components/common/JuggleDVIcon';
import { LeftPanelStyled } from './style';
import { selectEditorPanel } from 'store/selectors';
import { RootState } from 'store/index';
import { appAction } from 'store/features/appSlice';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import LockIcon from '@mui/icons-material/Lock';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';

const ComponentsLayers: React.FC = () => {
  const panel = useSelector(selectEditorPanel);
  //TODO: use setsamll to change components list style
  const [small] = useState(false);
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
      {/* <div className="panel-head">
        <span>图层</span>
        <div className="action" style={{ marginRight: -2 }}>
          <Button onClick={() => setSmall(true)}>
            <FormatListBulletedIcon />
          </Button>
          <Button onClick={() => setSmall(false)}>
            <ViewListIcon />
          </Button>
        </div>
      </div> */}
      <div className="panel-actions">
        <ButtonGroup size="small" fullWidth={true}>
          <Button
            disabled={disable_moveup}
            onClick={() => dispatch(appAction.moveComp({ direction: 'UP', isEnd: false }))}
          >
            <Tooltip title="上移" placement="bottom">
              <span>
                <JuggleDVIcon size={14} icon="autoDV-up" />
              </span>
            </Tooltip>
          </Button>
          <Button
            disabled={disable_movedown}
            onClick={() => dispatch(appAction.moveComp({ direction: 'DOWN', isEnd: false }))}
          >
            <Tooltip title="下移" placement="bottom">
              <span>
                <JuggleDVIcon size={14} icon="autoDV-up" flipY={true} />
              </span>
            </Tooltip>
          </Button>
          <Button
            disabled={disable_move2head}
            onClick={() => dispatch(appAction.moveComp({ direction: 'UP', isEnd: true }))}
          >
            <Tooltip title="置顶" placement="bottom">
              <span>
                <JuggleDVIcon size={14} icon="autoDV-top" />
              </span>
            </Tooltip>
          </Button>
          <Button
            disabled={disable_move2foot}
            onClick={() => dispatch(appAction.moveComp({ direction: 'DOWN', isEnd: true }))}
          >
            <Tooltip title="置底" placement="bottom">
              <span>
                <JuggleDVIcon size={14} icon="autoDV-top" flipY={true} />
              </span>
            </Tooltip>
          </Button>
        </ButtonGroup>
      </div>
      <List small={small} />
      <div className="panel-bottom-actions">
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

export default ComponentsLayers;
