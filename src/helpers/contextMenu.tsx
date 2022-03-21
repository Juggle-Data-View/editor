import AutoDVIcon from 'components/common/AutoDVIcon';
import { getAutoDV } from 'utils';
import store from 'store/index';
import { actionStatusSelector, selectedRectSelector } from 'helpers/selectors';
import { COPY_COMP, DELETE_COMP, ADD_GROUP_COMP } from 'components/base/BaseActions';
import { appAction } from 'store/features/appSlice';
import { ListItemIcon, ListItemText, MenuItem, MenuList, Typography } from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import React from 'react';
import LockIcon from '@mui/icons-material/Lock';
import LockOpenIcon from '@mui/icons-material/LockOpen';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import FolderIcon from '@mui/icons-material/Folder';
import FolderOffIcon from '@mui/icons-material/FolderOff';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import { AutoDV } from 'auto-dv-type';
import ReactDOM from 'react-dom';
interface extraItem {
  name: string;
  icon: string | JSX.Element;
  hasGroup?: string;
  handle: () => void;
}

interface ContextMenuItemOption {
  icon: React.ReactElement | ((status: ReturnType<typeof actionStatusSelector>) => React.ReactElement);
  onClick: any;
  text: string | ((status: ReturnType<typeof actionStatusSelector>) => string);
  shortcutkey?: string;
}

interface ContextMenuItemProps extends ContextMenuItemOption {
  status: ReturnType<typeof actionStatusSelector>;
  autoDVState: AutoDV.State;
}

const ContextMenuItem: React.FC<ContextMenuItemProps> = ({ status, icon, onClick, text, shortcutkey, autoDVState }) => {
  const itemText = typeof text === 'string' ? text : text(status);
  const itemIcon = typeof icon === 'function' ? icon(status) : icon;
  return (
    <MenuItem onClick={() => onClick(autoDVState)}>
      <ListItemIcon>{itemIcon}</ListItemIcon>
      <ListItemText>{itemText}</ListItemText>
      {shortcutkey ? (
        <Typography variant="body2" color="MenuText">
          {shortcutkey}
        </Typography>
      ) : null}
    </MenuItem>
  );
};

const contextMenuOptions: ContextMenuItemOption[] = [
  {
    text: '复制',
    icon: <ContentCopyIcon />,
    onClick: COPY_COMP,
    shortcutkey: '⌘C',
  },
  {
    text: ({ highlight_lock }) => (highlight_lock ? '解锁' : '锁定'),
    icon: ({ highlight_lock }) => (highlight_lock ? <LockOpenIcon /> : <LockIcon />),
    onClick: () => store.dispatch(appAction.toggleCompStatus({ status: 'locked' })),
  },
  {
    text: ({ highlight_hide }) => (highlight_hide ? '显示' : '隐藏'),
    icon: ({ highlight_hide }) => (highlight_hide ? <VisibilityIcon /> : <VisibilityOffIcon />),
    onClick: () => store.dispatch(appAction.toggleCompStatus({ status: 'hided' })),
  },
  {
    text: '向下一层',
    icon: <AutoDVIcon size={16} icon="autoDV-down" />,
    onClick: () => store.dispatch(appAction.moveComp({ direction: 'DOWN', isEnd: false })),
  },
  {
    text: '向上一层',
    icon: <AutoDVIcon size={16} icon="autoDV-up" />,
    onClick: () => store.dispatch(appAction.moveComp({ direction: 'UP', isEnd: false })),
  },
  {
    text: '置于底层',
    icon: <AutoDVIcon size={16} icon="autoDV-bottom" />,
    onClick: () => store.dispatch(appAction.moveComp({ direction: 'UP', isEnd: true })),
  },
  {
    text: '置于顶层',
    icon: <AutoDVIcon size={16} icon="autoDV-top" />,
    onClick: () => store.dispatch(appAction.moveComp({ direction: 'DOWN', isEnd: true })),
  },
  {
    text: '分组',
    icon: <FolderIcon />,
    onClick: (autoDVState: AutoDV.State) =>
      ADD_GROUP_COMP((selectedRectSelector as any)(autoDVState), autoDVState.selectedCompCodes),
  },
  {
    text: '取消分组',
    icon: <FolderOffIcon />,
    onClick: (autoDVState: AutoDV.State) =>
      store.dispatch(appAction.cancelGroup({ code: autoDVState.selectedCompCodes[0] })),
  },
  {
    text: '删除',
    icon: <DeleteForeverIcon />,
    onClick: DELETE_COMP,
  },
];

const ContextMenu: React.FC<{
  contextMenuOptions: ContextMenuItemOption[];
}> = ({ contextMenuOptions }) => {
  const autoDVState = getAutoDV();
  const status = actionStatusSelector(autoDVState);
  const renderMenuItem = () => {
    return contextMenuOptions.map((item) => {
      return <ContextMenuItem {...item} key={item.text.toString()} status={status} autoDVState={autoDVState} />;
    });
  };
  return <MenuList>{renderMenuItem()}</MenuList>;
};

const getFormatItems = (extraConfig?: extraItem[]) => {
  if (extraConfig) {
    const result = extraConfig.map<ContextMenuItemOption>(({ name, handle, icon }) => ({
      text: name,
      onClick: handle,
      icon: icon as React.ReactElement,
    }));
    return [...contextMenuOptions, ...result];
  } else {
    return contextMenuOptions;
  }
};

/**
 * @param e 鼠标事件对象
 * @param extraConfig 扩展配置
 */
export const showContextMenu = (e: React.MouseEvent, extraConfig?: extraItem[]) => {
  // must prevent default to cancel parent's context menu
  e.preventDefault();
  const options = getFormatItems(extraConfig);
  const menuContainer = document.createElement('div');
  const menuBack = document.createElement('div');
  menuBack.id = '__autoDV_menu_context';
  menuBack.style.cssText = `
    position: fixed;
    top: 0px;
    left: 0px;
    height:100vh;
    width: 100vw;
    z-index: 9999;
  `;
  menuContainer.style.cssText = `
    position: absolute;
    top: ${e.clientY}px;
    left: ${e.clientX}px;
    background-color: #eee;
    color: #222;
  `;
  const hideContext = (e: MouseEvent) => {
    e.stopPropagation();
    menuBack.remove();
  };
  menuBack.addEventListener('click', hideContext);
  menuBack.addEventListener('contextmenu', hideContext);
  menuBack.appendChild(menuContainer);
  document.body.appendChild(menuBack);
  ReactDOM.render(<ContextMenu contextMenuOptions={options} />, menuContainer);
};

export const hideContextMenu = () => {
  // ContextMenu.hide();
  const menuContainer = document.getElementById('#__autoDV_menu_context');
  if (menuContainer) {
    menuContainer.remove();
  }
};
