import { JuggleDV } from '@juggle-data-view/types';
import { IconButton, Collapse, TextField } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import classNames from 'classnames';
import { hideContextMenu, showContextMenu } from 'helpers/contextMenu';
import React, { useState } from 'react';
import { Draggable } from 'react-beautiful-dnd';
import { isDev } from 'utils';
import { CollapseList, GroupItem } from './style';
import { appAction } from '@store/features/appSlice';
import { selectKeyPress } from '@store/selectors';
import { editorAction } from '@store/features/editorSlice';
import { RootState } from 'store';
import EditIcon from '@mui/icons-material/Edit';
import FolderIcon from '@mui/icons-material/Folder';

interface IProps {
  compCodes: string[];
  selectedCompCodes: string[];
  compDatas: JuggleDV.State['compDatas'];
  code: string;
  draggingId: string | null;
  indent: number;
  isSelected: boolean;
  isGhosting: boolean;
  item: JuggleDV.Comp;
}

const GroupDropItem: React.FC<React.PropsWithChildren<IProps>> = (props) => {
  const { compCodes, isSelected, selectedCompCodes, children, code, indent, item } = props;
  const selectedCount = selectedCompCodes.length;
  const [isOpen, setOpen] = useState<boolean>(true);
  const [editAble, setEditAble] = useState(false);
  const key = useSelector(selectKeyPress);
  const dispatch = useDispatch();
  const hoverIndex = useSelector((state: RootState) => state.editor.hoverIndex);

  const listClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setOpen(!isOpen);
  };

  const onSelect = (e: React.SyntheticEvent) => {
    e.stopPropagation();
    hideContextMenu();
    const pressKey = (['meta', 'control', 'shift'] as JuggleDV.ModifierKey[]).includes(key);
    if (!isSelected || selectedCount !== 1 || pressKey) {
      dispatch(appAction.selectComp({ code }));
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

  const handleTitle: React.FocusEventHandler<HTMLInputElement | HTMLTextAreaElement> = (e) => {
    const val = e.target.value;
    setEditAble(false);
    if (val !== `分组${code}`) {
      dispatch(
        appAction.updateComp({
          code,
          comp: {
            ...item,
            title: val,
          },
        })
      );
    }
  };

  const handleHover = (index: number, isDragging: boolean) => {
    return (e: React.MouseEvent<Element>) => {
      e.preventDefault();
      // When a component triggers a drag-and-drop, mouse-over operations need to be disabled to reduce performance consumption
      if (isSelected || isDragging) return;
      dispatch(editorAction.compHover([index]));
    };
  };

  return (
    <>
      <Draggable key={code} draggableId={code} index={compCodes.indexOf(code)} isDragDisabled={!isSelected}>
        {(dragProvided, snapshot) => (
          <GroupItem
            id={`listItem_${code}`}
            className={classNames({
              '--selected': isSelected,
              '--hover': hoverIndex.includes(compCodes.indexOf(code)),
            })}
            isSelect={isSelected}
            onClick={onSelect}
            onContextMenu={(e) => {
              if (!isSelected) {
                dispatch(appAction.selectComp({ code }));
              }
              showContextMenu(e, [
                {
                  name: '重命名',
                  icon: <EditIcon />,
                  handle: handleRename,
                },
              ]);
            }}
            onMouseEnter={handleHover(compCodes.indexOf(code), snapshot.isDragging)}
            onMouseLeave={handleHover(-1, snapshot.isDragging)}
          >
            <div className="groupHeader" {...dragProvided.draggableProps} ref={dragProvided.innerRef}>
              <div className="groupIcon">
                <IconButton color={!isOpen || isSelected ? 'primary' : 'default'} size="small" onClick={listClick}>
                  <FolderIcon />
                </IconButton>
              </div>
              <div {...dragProvided.dragHandleProps} className="groupName">
                {editAble ? (
                  <TextField
                    className="edit-wrap"
                    defaultValue={item.title || item.alias || `分组${isDev ? code : ''}`}
                    onBlur={handleTitle}
                  />
                ) : (
                  <p onDoubleClick={handleRename}>{`${item.title || item.alias || '分组'}${isDev ? code : ''}`}</p>
                )}
              </div>
            </div>
          </GroupItem>
        )}
      </Draggable>
      <CollapseList indent={indent}>
        <Collapse className="itemList" in={isOpen}>
          {children}
        </Collapse>
      </CollapseList>
    </>
  );
};

export default GroupDropItem;
