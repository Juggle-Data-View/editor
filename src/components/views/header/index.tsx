import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import HeaderRight from './HeadRight';
import { HeaderStyled } from './style';
import { Button, Tooltip, Position } from '@blueprintjs/core';
import HeadMenu from './HeadMenu';
import { editorAction } from 'store/features/editorSlice';
import { selectEditorPanel, selectApp } from 'store/selectors';

const Header: React.FC = () => {
  const panel = useSelector(selectEditorPanel);
  const { name } = useSelector(selectApp);
  const dispatch = useDispatch();
  return (
    <HeaderStyled>
      <div className="head-left">
        <div className="actions">
          <div className="pannle-action">
            <Tooltip content="图层" position={Position.BOTTOM}>
              <Button
                icon="list-detail-view"
                intent={panel.compList ? 'primary' : 'none'}
                onClick={() => dispatch(editorAction.togglePanel('compList'))}
              />
            </Tooltip>
            <Tooltip content="组件配置" position={Position.BOTTOM}>
              <Button
                icon="panel-stats"
                intent={panel.compProps ? 'primary' : 'none'}
                onClick={() => dispatch(editorAction.togglePanel('compProps'))}
              />
            </Tooltip>
          </div>
        </div>
        <HeadMenu />
      </div>
      <div className="page-title">
        <strong>{name}</strong>
      </div>
      <HeaderRight />
    </HeaderStyled>
  );
};

export default Header;
