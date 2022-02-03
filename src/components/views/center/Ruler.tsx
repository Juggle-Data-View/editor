import React, { useState, memo, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { MenuList, MenuItem, Checkbox, Popover, IconButton } from '@mui/material';
import { useEventListener } from 'ahooks';
import Ruler from 'assets/lib/ruler';
import { selectEditor, selectCanvas } from 'store/selectors';
import useResize from 'components/base/useResize';
import { selectGuideLines } from 'store/selectors';
import { editorAction } from 'store/features/editorSlice';
import notice from 'utils/notice';
import SettingsIcon from '@mui/icons-material/Settings';
import DeleteForever from '@mui/icons-material/DeleteForever';

const AuxLine: React.FC<{ lines: AutoDV.GuideLine }> = memo(({ lines }) => {
  const dispatch = useDispatch();
  const triggerRef = useRef<any>();

  const [isOpen, setOpen] = useState(false);
  return (
    <>
      <SettingsIcon onClick={() => setOpen(!isOpen)} ref={triggerRef} fontSize="small" />
      <Popover
        open={isOpen}
        onClose={() => setOpen(false)}
        anchorEl={triggerRef.current}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
      >
        <MenuList>
          <MenuItem>
            显示参考线
            <Checkbox
              style={{ margin: '0 0 0 1px' }}
              checked={lines.visible}
              onChange={() => {
                dispatch(
                  editorAction.setGuideLines({
                    visible: !lines.visible,
                    h: [...lines.h],
                    v: [...lines.v],
                  })
                );
              }}
            />
          </MenuItem>
          <MenuItem
            disabled={!lines.h.length && !lines.v.length}
            onClick={() => {
              dispatch(editorAction.setGuideLines({ visible: lines.visible, h: [], v: [] }));
              notice.alert('已清除');
            }}
          >
            清除参考线
            <IconButton>
              <DeleteForever />
            </IconButton>
          </MenuItem>
        </MenuList>
      </Popover>
    </>
  );
});

interface Props {
  container: React.RefObject<HTMLDivElement>;
}

type RulerStart = {
  x: number;
  y: number;
};

type RulerSize = {
  width: number;
  height: number;
};

const CanvasRuler: React.FC<Props> = ({ container }) => {
  const { canvasRatio, canvasPadding } = useSelector(selectEditor);
  const lines = useSelector(selectGuideLines);
  const canvas = useSelector(selectCanvas);
  const [start, setStart] = useState<RulerStart>({ x: -canvasPadding, y: -canvasPadding });
  const [rulerSize, setRulerSize] = useState<RulerSize>({ width: 0, height: 0 });
  const thick = 16;
  const dispatch = useDispatch();

  useEventListener(
    'scroll',
    (e: React.SyntheticEvent<HTMLDivElement>) => {
      const { scrollLeft, scrollTop } = e.currentTarget;
      setStart({ x: scrollLeft - canvasPadding, y: scrollTop - canvasPadding });
    },
    { target: container }
  );

  useResize(
    (el) => {
      const { width, height } = el.getBoundingClientRect();
      setRulerSize({ width: width - thick, height: height - thick });
    },
    { target: container }
  );

  return (
    <Ruler
      thick={thick}
      scale={canvasRatio}
      width={rulerSize.width}
      height={rulerSize.height}
      startX={start.x / canvasRatio}
      startY={start.y / canvasRatio}
      shadow={{
        x: 0,
        y: 0,
        width: canvas.width,
        height: canvas.height,
      }}
      visibleLine={lines.visible}
      horLineArr={[...lines.h]}
      verLineArr={[...lines.v]}
      handleLine={(_lines: Omit<AutoDV.GuideLine, 'visible'>) => {
        dispatch(
          editorAction.setGuideLines({
            visible: _lines.h.length || _lines.v.length ? true : lines.visible,
            ..._lines,
          })
        );
      }}
      cornerActive={true}
      palette={{
        bgColor: '#eee', // ruler bg color
        longfgColor: '#7D8694', // ruler longer mark color
        shortfgColor: '#7D8694', // ruler shorter mark color
        fontColor: '#7D8694', // ruler font color
        lineColor: 'blue',
        borderColor: '#ccc',
        cornerActiveColor: '#eee',
      }}
      cornerExtra={<AuxLine lines={lines} />}
    />
  );
};

export default CanvasRuler;
