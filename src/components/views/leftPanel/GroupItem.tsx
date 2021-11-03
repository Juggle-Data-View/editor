import { Button, Collapse, EditableText, Icon } from '@blueprintjs/core';
import { useDispatch, useSelector } from 'react-redux';
import classNames from 'classnames';
import { hideContextMenu, showContextMenu } from 'helpers/contextMenu';
import React, { useState } from 'react';
import { Draggable } from 'react-beautiful-dnd';
import { isDev } from 'utils';
import { CollapseList, GroupItem } from './style';
import { appAction } from 'store/features/appSlice';
import { selectKeyPress } from 'store/selectors';
import { editorAction } from 'store/features/editorSlice';
import { RootState } from 'store';

interface IProps {
  compCodes: string[];
  selectedCompCodes: string[];
  compDatas: AutoDV.State['compDatas'];
  code: string;
  draggingId: string | null;
  indent: number;
  isSelected: boolean;
  isGhosting: boolean;
  item: AutoDV.Comp;
}

const GroupDropItem: React.FC<IProps> = (props) => {
  const { compCodes, isSelected, selectedCompCodes, children, code, indent, item } = props;
  const selectedCount = selectedCompCodes.length;
  const [isOpen, setOpen] = useState<boolean>(true);
  const [editAble, setEditAble] = useState(false);
  const key = useSelector(selectKeyPress);
  const dispatch = useDispatch();
  const hoverIndex = useSelector((state: RootState) => state.editor.hoverIndex);

  const listClick = (e: React.MouseEvent) => {
    setOpen(!isOpen);
  };

  const onSelect = (e: React.SyntheticEvent) => {
    hideContextMenu();
    const pressKey = (['meta', 'control', 'shift'] as AutoDV.ModifierKey[]).includes(key);
    if (!isSelected || selectedCount !== 1 || pressKey) {
      dispatch(appAction.selectComp({ code }));
    }
    e.stopPropagation(); // 外层容器点击空白可以取消选中，所以这里需要阻止冒泡
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

  const handleTitle = (val: string) => {
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
      // 当组件触发拖拽时，需要禁用鼠标移入移出操作，减少性能消耗
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
                  icon: 'edit',
                  handle: handleRename,
                },
              ]);
            }}
            onMouseEnter={handleHover(compCodes.indexOf(code), snapshot.isDragging)}
            onMouseLeave={handleHover(-1, snapshot.isDragging)}
          >
            <div className="groupHeader" {...dragProvided.draggableProps} ref={dragProvided.innerRef}>
              <div className="groupIcon">
                <Button minimal={true} onClick={listClick}>
                  <Icon icon="folder-close" />
                </Button>
              </div>
              <div {...dragProvided.dragHandleProps} className="groupName">
                {editAble ? (
                  <EditableText
                    className="edit-wrap"
                    alwaysRenderInput={true}
                    defaultValue={item.title || item.alias || `分组${isDev ? code : ''}`}
                    onConfirm={handleTitle}
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
        <Collapse className="itemList" isOpen={isOpen}>
          {children}
        </Collapse>
      </CollapseList>
    </>
  );
};

export default GroupDropItem;
