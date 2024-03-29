import React, { FocusEventHandler, useState } from 'react';
import { JuggleDV } from '@juggle-data-view/types';
import { useSelector, useDispatch } from 'react-redux';
import { Draggable } from 'react-beautiful-dnd';
import { isDev } from 'utils';
import { Chip, TextField, Button } from '@mui/material';
import { showContextMenu, hideContextMenu } from 'helpers/contextMenu';
import { ItemStyled } from './style';
import classNames from 'classnames';
import JuggleDVIcon from '@components/common/JuggleDVIcon';
import { selectKeyPress } from '@store/selectors';
import { editorAction } from '@store/features/editorSlice';
import { appAction } from '@store/features/appSlice';
import { DEFAULT_THUMBNAIL } from '@configurableComponents/const';
import { RootState } from 'store';
import EditIcon from '@mui/icons-material/Edit';
import LockIcon from '@mui/icons-material/Lock';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';

interface IListItem {
  item: JuggleDV.Comp;
  index: number;
  isGhosting: boolean;
  isSelected: boolean;
  selectedCount: number;
  isDraggingOver: boolean;
  small: boolean;
}

const ListItem = (props: IListItem) => {
  const [editAble, setEditAble] = useState(false);
  const { item, index, isSelected, isGhosting, selectedCount, isDraggingOver, small } = props;
  const { code, alias, title, locked, hided, version } = item;
  const visibleAction = locked || hided;
  const hoverIndex = useSelector((state: RootState) => state.editor.hoverIndex);
  const isSelecto = useSelector((state: RootState) => state.editor.isSelecto);
  const key = useSelector(selectKeyPress);
  const dispatch = useDispatch();

  const onSelect = (e: React.SyntheticEvent) => {
    hideContextMenu();
    const pressKey = (['meta', 'control', 'shift'] as JuggleDV.ModifierKey[]).includes(key);
    if (!isSelected || selectedCount !== 1 || pressKey) {
      dispatch(appAction.selectComp({ code }));
    }
    e.stopPropagation(); // 外层容器点击空白可以取消选中，所以这里需要阻止冒泡
  };

  const onToggleStatus = (status: keyof JuggleDV.ICompOwnStatus) => {
    dispatch(appAction.toggleCompStatus({ code, status }));
  };

  const handleTitle: FocusEventHandler<HTMLInputElement | HTMLTextAreaElement> = (e) => {
    const val = e.target.value;
    setEditAble(false);
    if (val !== item.title) {
      dispatch(appAction.updateComp({ code: item.code, comp: { ...item, title: val } }));
    }
  };

  const handleRename = () => {
    setEditAble(true);
    setTimeout(() => {
      const obj: any = document.querySelector('.edit-wrap');
      if (obj) {
        obj.querySelector('input').focus();
      }
    }, 0);
  };

  const handleHover = (index: number, isDragging: boolean) => {
    return (e: React.MouseEvent<Element>) => {
      e.preventDefault();
      // 当组件触发拖拽时，需要禁用鼠标移入移出操作，减少性能消耗
      if (isSelected || isDragging || isDraggingOver || isSelecto) return;
      dispatch(editorAction.compHover([index]));
    };
  };

  return (
    <Draggable draggableId={code} index={index} isDragDisabled={!isSelected}>
      {(provided, snapshot) => {
        return (
          <ItemStyled
            id={`listItem_${code}`}
            className={classNames({
              '--selected': isSelected,
              '--hided': hided,
              '--locked': locked,
              '--hover': hoverIndex.includes(index),
            })}
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            ref={provided.innerRef}
            onClick={onSelect}
            isDragging={snapshot.isDragging}
            isSelected={isSelected}
            isGhosting={isGhosting}
            onContextMenu={(e) => {
              if (!isSelected) {
                dispatch(appAction.selectComp({ code: item.code }));
              }
              showContextMenu(e, [
                {
                  name: '重命名',
                  icon: <EditIcon />,
                  handle: handleRename,
                  hasGroup: item.config.groupCode,
                },
              ]);
            }}
            onMouseEnter={handleHover(index, snapshot.isDragging)}
            onMouseLeave={handleHover(-1, snapshot.isDragging)}
          >
            <div className="inner" data-debug={['debug', code, version].join('-')}>
              <div
                className={classNames({
                  thumb: true,
                  '--img': !small,
                })}
              >
                {small ? (
                  <JuggleDVIcon className="thumb-icon" icon="autoDV-flip-horizontal" size={13} />
                ) : (
                  <img src={DEFAULT_THUMBNAIL} onError={(e) => (e.currentTarget.src = DEFAULT_THUMBNAIL)} alt="" />
                )}
              </div>
              <div className="info">
                {editAble ? (
                  <TextField className="edit-wrap" defaultValue={title || alias} onBlur={handleTitle} />
                ) : (
                  <p onDoubleClick={handleRename}>{title || alias}</p>
                )}
                {isDev && !small ? <p>{code}</p> : null}
              </div>
              {visibleAction && (
                <div className="actions">
                  {locked && (
                    <Button onClick={() => onToggleStatus('locked')}>
                      <LockIcon />
                    </Button>
                  )}
                  {hided && (
                    <Button onClick={() => onToggleStatus('hided')}>
                      <VisibilityOffIcon />
                    </Button>
                  )}
                </div>
              )}
            </div>
            {snapshot.isDragging ? <Chip className="badge" label={selectedCount} /> : null}
          </ItemStyled>
        );
      }}
    </Draggable>
  );
};

export default ListItem;
