import React, { useState, useRef, useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { DragDropContext, Droppable, DropResult, DragStart } from 'react-beautiful-dnd';
import ListItem from './ListItem';
import scroll from 'helpers/animate';
import { ItemListStyled } from './style';
import subList, { AssistStruct } from '@utils/SubList';
import GroupDropItem from './GroupItem';
import { appAction } from '@store/features/appSlice';
import { selectJuggleDV } from '@store/selectors';

interface IList {
  small: boolean;
}

const List: React.FC<IList> = ({ small }) => {
  const { compCodes, compDatas, selectedCompCodes } = useSelector(selectJuggleDV);
  const selectedCount = selectedCompCodes.length;
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const listRef = useRef<any>(null);
  const dispatch = useDispatch();

  const onDragstart = (start: DragStart) => {
    setDraggingId(start.draggableId);
  };

  const onDragEnd = ({ source, destination }: DropResult) => {
    if (!destination) {
      return;
    }
    dispatch(
      appAction.resortComp({
        source: source.index,
        destination: destination.index,
      })
    );
    setDraggingId(null);
  };

  const handleClick = (e: React.MouseEvent) => {
    if (e.defaultPrevented) {
      return;
    }
    if (selectedCompCodes.length) {
      dispatch(appAction.unSelectComp());
    }
  };

  /**
   * 当组件code、选中code发生变化时，触发自动滚动
   */
  const handleAutoScorll = useCallback(() => {
    // 多选时无需自动滚动
    if (!listRef.current || selectedCompCodes.length !== 1) {
      return;
    }
    const { scrollTop, offsetHeight } = listRef.current;
    const el = document.getElementById(`listItem_${selectedCompCodes[0]}`);

    if (!el) return;

    const itemHeight = el.offsetHeight;
    const currentOffsetTop = el.offsetTop;

    const isInView = currentOffsetTop - scrollTop <= offsetHeight - itemHeight && scrollTop <= currentOffsetTop;

    if (!isInView) {
      scroll(scrollTop, currentOffsetTop, 300, (v) => {
        listRef.current.scrollTop = v;
      });
    }
  }, [selectedCompCodes, compCodes]); //eslint-disable-line
  const renderItem = (level: number, snapshot: any, codes?: AssistStruct[]) => {
    if (!codes) {
      return null;
    }
    return codes.map((item) => {
      const code = item.code;
      const isSelected = selectedCompCodes.includes(code);
      const isGhosting = isSelected && Boolean(draggingId) && draggingId !== code;

      if (!item.children) {
        return (
          <ListItem
            key={code}
            small={small}
            index={compCodes.indexOf(code)}
            item={compDatas[code]}
            isGhosting={isGhosting}
            isSelected={isSelected}
            isDraggingOver={snapshot.isDraggingOver}
            selectedCount={selectedCount}
          />
        );
      } else {
        return (
          <GroupDropItem
            key={code}
            isGhosting={isGhosting}
            isSelected={isSelected}
            indent={level + 1}
            draggingId={draggingId}
            item={compDatas[code]}
            code={code}
            compDatas={compDatas}
            compCodes={compCodes}
            selectedCompCodes={selectedCompCodes}
          >
            {renderItem(level + 1, snapshot, item.children)}
          </GroupDropItem>
        );
      }
    });
  };

  useEffect(() => {
    handleAutoScorll();
  }, [handleAutoScorll]);

  return (
    <DragDropContext onDragStart={onDragstart} onDragEnd={onDragEnd}>
      <Droppable droppableId="component-list">
        {(provided, snapshot) => (
          <ItemListStyled
            {...provided.droppableProps}
            ref={(ref: HTMLElement) => {
              provided.innerRef(ref);
              listRef.current = ref;
            }}
            isDraggingOver={snapshot.isDraggingOver}
            onClick={handleClick}
          >
            {renderItem(0, snapshot, subList(compCodes, compDatas))}
            {provided.placeholder}
          </ItemListStyled>
        )}
      </Droppable>
    </DragDropContext>
  );
};

export default List;
