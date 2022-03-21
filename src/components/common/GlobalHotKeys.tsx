/**
 * 全局热键组件
 */

import { AutoDV } from 'auto-dv-type';
import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Dialog, DialogTitle, IconButton, useMediaQuery, useTheme } from '@mui/material';
import { useKeyPress } from 'ahooks';
import { COPY_COMP, DELETE_COMP } from 'components/base/BaseActions';
import { MIN_CANVAS_RATIO, MAX_CANVAS_RATIO } from 'config/const';
import { GlobalHotKeys, configure } from 'react-hotkeys';
import { getAutoDV } from 'utils';
import { defaultRect } from 'config/defaults';
import { editorAction } from 'store/features/editorSlice';
import { appAction } from 'store/features/appSlice';
import { UNDO_RESTORE } from 'config/const';
import { selectEditor } from 'store/selectors';
import CloseIcon from '@mui/icons-material/Close';

configure({
  /**
   * 是否忽略持续按住按键的事件。默认为 true
   * 这里选择false，是因为持续按住画布快捷键缩放时，可以避免触发浏览器的默认事件。
   */
  ignoreRepeatedEventsWhenKeyHeldDown: false,

  /**
   * 开启组合键，例如： left/shift+left，让组件向左移动
   */
  allowCombinationSubmatches: true,
});

const keyMap = {
  TOGGLE_SHORTCUTS_DIALOG: 'shift+?',
  SHOW_LEFT_PANEL: ['command+left', 'ctrl+left'],
  SHOW_RIGHT_PANEL: ['command+right', 'ctrl+right'],
  CANVAS_ZOOM_IN: ['command+=', 'ctrl+='],
  CANVAS_ZOOM_OUT: ['command+-', 'ctrl+-'],
  TOGGLE_HISTORY: ['command+h', 'ctrl+h'],
  UNDO: ['command+z', 'ctrl+z'],
  COMP_SELECT_ALL: ['command+a', 'ctrl+a'],
  COMP_COPY: ['command+c', 'ctrl+c'],
  COMP_PASTE: ['command+v', 'ctrl+v'],
  COMP_DELETE: 'backspace',
  COMP_MOVE: ['up', 'down', 'left', 'right'],
};

export default function AutoDVGlobalHotKeys() {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const { canvasRatio } = useSelector(selectEditor);
  const dispatch = useDispatch();

  const handleCanvasRatio = (step: number) => {
    let ratio = canvasRatio + step;
    if (ratio < MIN_CANVAS_RATIO) {
      ratio = MIN_CANVAS_RATIO;
    }
    if (ratio > MAX_CANVAS_RATIO) {
      ratio = MAX_CANVAS_RATIO;
    }
    dispatch(editorAction.zoomCanvas(ratio));
  };

  useKeyPress(
    ['alt', 'control', 'meta', 'shift'] as Exclude<AutoDV.ModifierKey, null>[],
    (e) => {
      if (e.type === 'keydown') {
        dispatch(appAction.setKeypress(e.key.toLowerCase()));
      }
      if (e.type === 'keyup') {
        dispatch(appAction.setKeypress(null));
      }
    },
    {
      events: ['keydown', 'keyup'],
    }
  );
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'));

  return (
    <GlobalHotKeys
      keyMap={keyMap}
      handlers={{
        SHOW_LEFT_PANEL: (e) => {
          e?.preventDefault();
          dispatch(editorAction.togglePanel('compList'));
        },
        SHOW_RIGHT_PANEL: (e) => {
          e?.preventDefault();
          dispatch(editorAction.togglePanel('compProps'));
        },
        TOGGLE_SHORTCUTS_DIALOG: () => {
          // setIsOpen(!isOpen);
        },
        CANVAS_ZOOM_IN: (e) => {
          e?.preventDefault();
          handleCanvasRatio(0.1);
        },
        CANVAS_ZOOM_OUT: (e) => {
          e?.preventDefault();
          handleCanvasRatio(-0.1);
        },
        TOGGLE_HISTORY: (e) => {
          e?.preventDefault();
          dispatch(editorAction.togglePanel('history'));
        },
        UNDO: () => {
          dispatch({ type: UNDO_RESTORE });
        },
        COMP_SELECT_ALL: (e) => {
          e?.preventDefault();
          dispatch(appAction.selectComp({ code: 'ALL' }));
        },
        COMP_COPY: (e) => {
          e?.preventDefault();
          COPY_COMP();
        },
        // COMP_PASTE: (e) => {
        //   e?.preventDefault();
        //   PASTE_COMP();
        // },
        COMP_DELETE: (e) => {
          e?.preventDefault();
          DELETE_COMP();
        },
        COMP_MOVE: (e) => {
          e?.preventDefault();
          const { selectedCompCodes } = getAutoDV();
          if (!e || !selectedCompCodes.length) return;
          const step = e.shiftKey ? 10 : 1;
          const direction: keyof AutoDV.Rect = e.code === 'ArrowUp' || e.code === 'ArrowDown' ? 'top' : 'left';
          const positive = e.code === 'ArrowDown' || e.code === 'ArrowRight' ? 1 : -1;
          const offset: AutoDV.Rect = { ...defaultRect };
          offset[direction] = step * positive;
          dispatch(appAction.updateCompRect({ offset }));
        },
      }}
      allowChanges={true}
    >
      <Dialog open={isOpen} fullScreen={fullScreen} onClose={() => setIsOpen(false)}>
        <DialogTitle>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
            }}
          >
            快捷键展示
            <IconButton edge="start" color="inherit" onClick={() => setIsOpen(false)} aria-label="close">
              <CloseIcon />
            </IconButton>
          </div>
        </DialogTitle>
        todo...
      </Dialog>
    </GlobalHotKeys>
  );
}
