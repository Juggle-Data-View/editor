import React, { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import TypeMoveable, { MoveableManagerInterface, OnEndEvent, Able, MoveableProps } from 'react-moveable';
import styled from 'styled-components';
import cx from 'classnames';
import Selecto from 'react-selecto';
import { flatten, uniq } from 'lodash';
import emitter, { eventName } from 'utils/events';
import getAllChildren, { getAllParentGroup } from 'utils/getAllChildren';
import { selectJuggleDV, selectEditor, selectGuideLines, selectKeyPress, selectIsSelecto } from 'store/selectors';
import { appAction } from 'store/features/appSlice';
import { editorAction } from 'store/features/editorSlice';
import { JuggleDV } from '@juggle-data-view/types';
interface DimensionViewableProps {
  dimensionViewable?: boolean;
}

const Moveable = TypeMoveable as unknown as React.FC<MoveableProps & { ref: any }>;

const MoveableStyled = styled(Moveable)<DimensionViewableProps>`
  &.--move {
    .moveable-area {
      cursor: move;
    }
  }
`;

type AbleEndEvent = 'DragEnd' | 'DragGroupEnd' | 'ResizeEnd';

const DimensionViewable: Able = {
  name: 'dimensionViewable',
  props: {
    dimensionViewable: Boolean,
  },
  events: {},
  render(moveable: MoveableManagerInterface<any, any>) {
    const rect = moveable.getRect();
    const { ratio = 1 } = moveable.props;
    const { dragInfo } = moveable.state;
    const isResize = dragInfo && dragInfo.dist.length === 2;

    if (!moveable.isDragging()) {
      return null;
    }

    return (
      <div
        key={'dimension-viewer'}
        style={{
          position: 'absolute',
          left: 0,
          top: -10,
          background: '#4af',
          borderRadius: '2px',
          padding: '2px 4px',
          color: 'white',
          fontSize: '12px',
          whiteSpace: 'nowrap',
          fontWeight: 'bold',
          willChange: 'transform',
          transform: 'translate(0, -100%)',
        }}
      >
        {isResize ? (
          <div>
            <p>w: {Math.round(rect.offsetWidth)} 像素</p>
            <p>h: {Math.round(rect.offsetHeight)} 像素</p>
          </div>
        ) : (
          <div>
            <p>x: {Math.round(rect.left / ratio)} 像素</p>
            <p>y: {Math.round(rect.top / ratio)} 像素</p>
          </div>
        )}
      </div>
    );
  },
} as const;

// 排除掉需要拖拽对齐、对比的组件
const ExcludeCompCodes = ['datasource', 'decoration', 'globalEvent'];

interface Props {
  scrollContainer: HTMLElement;
}

const MoveAble: React.FC<Props> = ({ scrollContainer }) => {
  const { canvasRatio } = useSelector(selectEditor);
  const { canvas, selectedCompCodes, compDatas, compCodes } = useSelector(selectJuggleDV);
  const isSelecto = useSelector(selectIsSelecto);
  const guideLines = useSelector(selectGuideLines);
  const pressKey = useSelector(selectKeyPress);
  const moveableRef = useRef<any>(null);
  const selectoRef = useRef<any>(null);
  const [enableSnap, setEnableSnap] = useState(true);
  const [timestamp, setTimestamp] = useState(0);
  const mountMap = useRef<any>({});
  const sLen = selectedCompCodes.length;
  const locked = sLen && sLen === 1 && compDatas[selectedCompCodes[0]].locked;
  const dispatch = useDispatch();

  const isMoveCursor = useMemo(() => {
    if (selectedCompCodes.length === 1) {
      return true;
    }
    return !(pressKey === 'meta' || pressKey === 'control' || pressKey === 'shift');
  }, [pressKey, selectedCompCodes]);

  // 根据选中组件的个数，获取是否锁定拖拽
  const lockAspectRatio = useMemo(() => {
    if (selectedCompCodes.length === 1) {
      return compDatas[selectedCompCodes[0]].attr.lock;
    }
    return false;
  }, [selectedCompCodes, compDatas]);

  // 需要进行移动的元素
  const targets = useMemo(() => {
    const targetCodes: string[] = [];
    selectedCompCodes.forEach((code) => {
      if (compDatas[code].compCode === 'group') {
        // 如果选中的组件有分组组件，就把分组包含的子组件全部纳入target中
        getAllChildren(code, compCodes, compDatas).forEach((childCode) => {
          targetCodes.push(childCode);
        });
      }
      targetCodes.push(code);
    });
    return codes2elements(uniq(targetCodes)); // uniq: 去重code，否则会出现递归死循环
  }, [selectedCompCodes, timestamp, compDatas, compCodes]); // eslint-disable-line

  // 与移动元素进行对比的元素
  const guideTargets = useMemo(() => {
    const targetCodes = elements2codes(targets);
    const parentGroupCodes = targetCodes.length ? getAllParentGroup(targetCodes[0], compDatas) : [];
    const resultCodes = compCodes
      .filter((code) => !compDatas[code].locked)
      .filter((code) => !ExcludeCompCodes.includes(compDatas[code].compCode))
      .filter((code) => !targetCodes.includes(code))
      .filter((code) => !parentGroupCodes.includes(code))
      .filter((code) => !compDatas[code].config.groupCode);
    return codes2elements(resultCodes);
  }, [compCodes, targets, compDatas]);

  const resetSnaped = useCallback(() => {
    const cls = '--snap';
    guideTargets.forEach((el) => {
      if (el && el.classList.contains(cls)) {
        el.classList.remove(cls);
      }
    });
  }, [guideTargets]);

  useEffect(() => {
    const handleTarget = (code: string, time: number) => {
      if (!mountMap.current[code]) {
        setTimestamp(time);
        mountMap.current[code] = time;
      }
    };
    emitter.on(eventName.notifyCompMounted, handleTarget);
    return () => {
      emitter.off(eventName.notifyCompMounted, handleTarget);
    };
  }, []);

  useEffect(() => {
    Object.keys(mountMap.current).forEach((code) => {
      if (!compCodes.includes(code)) {
        delete mountMap.current[code];
      }
    });
  }, [compCodes]);

  useEffect(() => {
    // 受控更新
    if (moveableRef.current) {
      moveableRef.current.moveable.updateRect();
    }
  });

  useEffect(() => {
    setEnableSnap(!(pressKey === 'meta' || pressKey === 'control'));
    resetSnaped();
  }, [pressKey, resetSnaped]);

  const handleEnd = (endType: AbleEndEvent) => {
    return (event: OnEndEvent) => {
      const offset = getOffset(endType, event, canvasRatio);
      if (offset) {
        dispatch(appAction.updateCompRect({ offset }));
      }
      resetSnaped();
    };
  };

  const zoom = Math.min(Math.max(0.75, canvasRatio), 1);

  return (
    <>
      <MoveableStyled
        ref={moveableRef}
        className={cx({
          '--move': isMoveCursor,
        })}
        target={targets}
        elementGuidelines={enableSnap ? guideTargets : []}
        horizontalGuidelines={guideLines.v.map((v) => v * canvasRatio)}
        verticalGuidelines={guideLines.h.map((h) => h * canvasRatio)}
        ables={[DimensionViewable]}
        dimensionViewable={true}
        props={{
          ratio: canvasRatio,
        }}
        dragArea={true}
        passDragArea={pressKey === 'control' || pressKey === 'meta'}
        keepRatio={lockAspectRatio}
        bounds={{ left: 0, top: 0, right: canvas.width * canvasRatio, bottom: canvas.height * canvasRatio }}
        zoom={zoom}
        origin={false}
        draggable={!locked}
        resizable={!locked && targets.length === 1}
        snappable={enableSnap}
        snapGap
        snapElement
        snapVertical
        snapHorizontal
        snapCenter
        snapDigit={0}
        scrollable
        scrollContainer={scrollContainer}
        getScrollPosition={({ scrollContainer }) => [scrollContainer.scrollLeft, scrollContainer.scrollTop]}
        onScroll={({ direction }) => {
          scrollContainer.scrollBy(direction[0] * 10, direction[1] * 10);
        }}
        onDrag={({ target, beforeTranslate }) => {
          target.style.transform = `translate(${beforeTranslate[0]}px, ${beforeTranslate[1]}px)`;
        }}
        onDragEnd={handleEnd('DragEnd')}
        onDragGroup={({ events }) => {
          events.forEach((ev) => {
            ev.target.style.transform = `translate(${ev.beforeTranslate[0]}px, ${ev.beforeTranslate[1]}px)`;
          });
        }}
        onDragGroupEnd={handleEnd('DragGroupEnd')}
        onResize={({ target, width, height, drag }) => {
          target.style.width = `${width}px`;
          target.style.height = `${height}px`;
          target.style.transform = `translate(${drag.beforeTranslate[0]}px, ${drag.beforeTranslate[1]}px)`;
        }}
        onResizeEnd={handleEnd('ResizeEnd')}
        onSnap={({ elements }) => {
          resetSnaped();
          flatten(elements).forEach(({ element }) => {
            element?.classList.add('--snap');
          });
        }}
        onClickGroup={(e) => {
          selectoRef.current.clickTarget(e.inputEvent, e.inputTarget);
        }}
      />
      <Selecto
        ref={selectoRef}
        dragContainer={scrollContainer}
        selectableTargets={scrollContainer.querySelectorAll('div[data-selecto]') as any}
        hitRate={100}
        selectByClick={false}
        selectFromInside={false}
        toggleContinueSelect={['shift']}
        onDragStart={(e) => {
          const moveable = moveableRef.current;
          const target = e.inputEvent.target;
          if (moveable.isMoveableElement(target) || targets.some((t: any) => t === target || t.contains(target))) {
            e.stop();
          }
        }}
        scrollOptions={{
          container: scrollContainer,
          getScrollPosition: () => [scrollContainer.scrollLeft, scrollContainer.scrollTop],
          throttleTime: 30,
          threshold: 0,
        }}
        onScroll={(e) => {
          scrollContainer.scrollBy(e.direction[0] * 10, e.direction[1] * 10);
        }}
        onDrag={(e) => {
          if (!isSelecto && e.isSelect && (e.rect.width || e.rect.height)) {
            dispatch(editorAction.setSelecto(true));
          }
        }}
        onSelect={(e) => {
          e.added.forEach((el) => {
            el.classList.add('--hover');
          });
          e.removed.forEach((el) => {
            el.classList.remove('--hover');
          });
        }}
        onSelectEnd={(e) => {
          if (isSelecto) {
            dispatch(editorAction.setSelecto(false));
          }
          if (e.selected.length) {
            setTimeout(() => {
              dispatch(appAction.selectComp({ code: elements2codes(e.selected) }));
            });
          }
        }}
      />
    </>
  );
};

export default MoveAble;

function codes2elements(codes: string[]) {
  return codes.map((code) => document.getElementById(code)).filter((el) => el);
}

function elements2codes(elements: (Element | null)[]) {
  return elements.map((el) => (el ? el.id : '')).filter((code) => code);
}

function getOffset(endType: AbleEndEvent, event: OnEndEvent, ratio: number): JuggleDV.Rect | null {
  const { lastEvent } = event;
  if (!lastEvent) return null;
  const { dist, drag } = lastEvent;
  switch (endType) {
    case 'DragEnd':
      return { width: 0, height: 0, left: dist[0], top: dist[1] };
    case 'DragGroupEnd':
      return { width: 0, height: 0, left: dist[0] / ratio, top: dist[1] / ratio };
    case 'ResizeEnd':
      return { width: dist[0], height: dist[1], left: drag.dist[0], top: drag.dist[1] };
    default:
      return null;
  }
}
