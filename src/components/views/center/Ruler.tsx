import React, { useState, memo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Dialog, Icon, Menu, MenuItem, Position, Checkbox, Button, Classes, MenuDivider } from '@blueprintjs/core';
import { Popover2 } from '@blueprintjs/popover2';
import { useEventListener } from 'ahooks';
import Ruler from 'assets/lib/ruler';
import useTheme from 'components/base/useTheme';
import { selectEditor, selectCanvas } from 'store/selectors';
import useResize from 'components/base/useResize';
import { selectGuideLines } from 'store/selectors';
import { editorAction } from 'store/features/editorSlice';
import notice from 'utils/notice';
import { Formik } from 'formik';
import { Field } from 'components/form';

const AuxLine: React.FC<{ lines: AutoDV.GuideLine }> = memo(({ lines }) => {
  const [visibleModal, setVisibleModal] = useState<boolean>(false);
  const { theme } = useTheme();
  const dispatch = useDispatch();

  const IconStyle = {
    margin: '1px 10px 0 1px',
  };

  return (
    <>
      <Popover2
        position={Position.RIGHT_TOP}
        content={
          <Menu>
            <MenuItem
              shouldDismissPopover={false}
              text={
                <Checkbox
                  style={{ margin: '0 0 0 1px' }}
                  checked={lines.visible}
                  label="显示参考线"
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
              }
            />
            <MenuItem
              icon={<Icon style={IconStyle} icon="add" />}
              text="新建参考线"
              onClick={() => setVisibleModal(!visibleModal)}
            />
            <MenuDivider />
            <MenuItem
              icon={<Icon style={IconStyle} icon="trash" />}
              text="清除参考线"
              disabled={!lines.h.length && !lines.v.length}
              onClick={() => {
                dispatch(editorAction.setGuideLines({ visible: lines.visible, h: [], v: [] }));
                notice.alert('已清除');
              }}
            />
          </Menu>
        }
      >
        <Icon iconSize={12} color={theme.iconColor} icon="cog" />
      </Popover2>

      <Dialog
        title="新建参考线"
        isOpen={visibleModal}
        canOutsideClickClose={true}
        onClose={() => {
          setVisibleModal(!visibleModal);
        }}
      >
        <Formik
          initialValues={{ x: 0, y: 0 }}
          onSubmit={(values) => {
            dispatch(
              editorAction.setGuideLines({
                visible: lines.visible,
                h: [...lines.h, values.x],
                v: [...lines.v, values.y],
              })
            );
            setVisibleModal(false);
          }}
        >
          {({ handleSubmit }) => {
            return (
              <>
                <div className={Classes.DIALOG_BODY}>
                  <Field.Number label="横坐标" name="x" />
                  <Field.Number label="纵坐标" name="y" />
                </div>
                <div className={[Classes.DIALOG_FOOTER, Classes.DIALOG_FOOTER_ACTIONS].join(' ')}>
                  <Button intent="primary" onClick={() => handleSubmit()}>
                    创 建
                  </Button>
                </div>
              </>
            );
          }}
        </Formik>
      </Dialog>
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
  const { theme } = useTheme();
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
      palette={theme.ruler}
      cornerExtra={<AuxLine lines={lines} />}
    />
  );
};

export default CanvasRuler;
