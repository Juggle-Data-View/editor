/**
 * 右键菜单 hook. 用于单个组件
 * 用法:
 * ```
 * <div onContextMenu={showContextMenu}>
 *   右键点我
 * </div>
 */

import React from 'react';
import { ContextMenu, Menu, MenuDivider, MenuItem, IconName } from '@blueprintjs/core';
import AutoDVIcon from 'components/common/AutoDVIcon';
import { getAutoDV } from 'utils';
import store from 'store/index';
import { actionStatusSelector, selectedRectSelector } from 'helpers/selectors';
import { COPY_COMP, DELETE_COMP, ADD_GROUP_COMP } from 'components/base/BaseActions';
import { createFavorites } from 'components/views/header/HeadFavorites';
import { appAction } from 'store/features/appSlice';

interface extraItem {
  name: string;
  icon: IconName | JSX.Element;
  hasGroup?: string;
  handle: () => void;
}

/**
 * @param e 鼠标事件对象
 * @param extraConfig 扩展配置
 */
export const showContextMenu = (e: React.MouseEvent, extraConfig?: extraItem[]) => {
  // must prevent default to cancel parent's context menu
  e.preventDefault();

  const autoDVState = getAutoDV();
  const status = actionStatusSelector(autoDVState);

  ContextMenu.show(
    <Menu>
      <MenuItem text="复制" icon="duplicate" label="⌘C" onClick={COPY_COMP} />
      <MenuItem
        text={status.highlight_lock ? '解锁' : '锁定'}
        icon={status.highlight_lock ? 'unlock' : 'lock'}
        onClick={() => store.dispatch(appAction.toggleCompStatus({ status: 'locked' }))}
      />
      <MenuItem
        text={status.highlight_hide ? '显示' : '隐藏'}
        icon={status.highlight_hide ? 'eye-on' : 'eye-off'}
        onClick={() => store.dispatch(appAction.toggleCompStatus({ status: 'hided' }))}
      />
      <MenuItem text="顺序" icon={<AutoDVIcon size={16} icon="autoDV-shangyi" />}>
        <MenuItem
          text="向下一层"
          icon={<AutoDVIcon size={16} icon="autoDV-shangyi" />}
          disabled={status.disable_moveup}
          onClick={() => store.dispatch(appAction.moveComp({ direction: 'UP', isEnd: false }))}
        />
        <MenuItem
          text="向上一层"
          icon={<AutoDVIcon size={16} icon="autoDV-shangyi" flipY={true} />}
          disabled={status.disable_movedown}
          onClick={() => store.dispatch(appAction.moveComp({ direction: 'DOWN', isEnd: false }))}
        />
        <MenuItem
          text="置于底层"
          icon={<AutoDVIcon size={16} icon="autoDV-zhiding" />}
          disabled={status.disable_move2head || extraConfig?.every((item) => !!item.hasGroup)}
          onClick={() => store.dispatch(appAction.moveComp({ direction: 'UP', isEnd: true }))}
        />
        <MenuItem
          text="置于顶层"
          icon={<AutoDVIcon size={16} icon="autoDV-zhiding" flipY={true} />}
          disabled={status.disable_move2foot || extraConfig?.every((item) => !!item.hasGroup)}
          onClick={() => store.dispatch(appAction.moveComp({ direction: 'DOWN', isEnd: true }))}
        />
      </MenuItem>
      {extraConfig?.map(({ name, icon, handle }) => {
        return <MenuItem key={name} text={name} icon={icon} onClick={handle} />;
      })}
      <MenuItem
        icon="add-to-folder"
        onClick={() => ADD_GROUP_COMP((selectedRectSelector as any)(autoDVState), autoDVState.selectedCompCodes)}
        text="分组"
      />
      <MenuItem
        icon="add-to-folder"
        onClick={() => {
          store.dispatch(appAction.cancelGroup({ code: autoDVState.selectedCompCodes[0] }));
        }}
        disabled={!autoDVState.selectedCompCodes.find((item) => item.includes('group'))}
        text="取消分组"
      />
      <MenuItem icon="star" onClick={createFavorites} text="收藏" />
      <MenuDivider />
      <MenuItem icon="trash" onClick={DELETE_COMP} text="删除" />
    </Menu>,
    { left: e.clientX, top: e.clientY }
  );
};

export const hideContextMenu = () => {
  ContextMenu.hide();
};
