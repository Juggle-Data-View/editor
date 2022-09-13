import { useDispatch, useSelector } from 'react-redux';
import { Formik } from 'formik';
import { FieldLabel, AutoSubmit, Field } from '@components/form/index';
import DropZone from '@components/common/DropZone';
import { ZOOM_TYPE } from '@configurableComponents/const';
import FieldSize from '@components/common/FieldSize';
import { getDiffPayload } from 'helpers/diff';
import { appAction } from '@store/features/appSlice';
import { editorAction } from '@store/features/editorSlice';
import { selectCanvas, selectEditor } from '@store/selectors';
import { JuggleDV } from '@juggle-data-view/types';

const GlobalProps: React.FC = () => {
  const canvas = useSelector(selectCanvas);
  const editor = useSelector(selectEditor);
  const dispatch = useDispatch();
  const labelProps = {
    width: 80,
  };
  return (
    <>
      <div className="panel-head">页面设置</div>
      <div className="panel-body">
        <Formik
          initialValues={canvas}
          enableReinitialize
          onSubmit={(values) => {
            const payload = getDiffPayload(canvas, values);
            if (payload) {
              dispatch(appAction.updateCanvas({ canvas: values }));
            }
          }}
        >
          {() => {
            return (
              <>
                <AutoSubmit />
                <FieldSize label="页面宽高" widthName="width" heightName="height" labelProps={labelProps} />
                <Field.Color label="背景色" name="backgroundColor" labelProps={labelProps} />
                <FieldLabel label="背景图" {...labelProps}>
                  <DropZone name="backgroundImg" />
                </FieldLabel>
                <Field.Select label="缩放方式" name="zoomType" labelProps={labelProps}>
                  {(Object.keys(ZOOM_TYPE) as []).map((index: JuggleDV.ZoomType) => (
                    <option key={index} value={Number(index)}>
                      {ZOOM_TYPE[index]}
                    </option>
                  ))}
                </Field.Select>
              </>
            );
          }}
        </Formik>
        <Formik
          initialValues={editor}
          enableReinitialize
          onSubmit={(values) => {
            const payload = getDiffPayload(editor, values);
            if (payload) {
              dispatch(editorAction.updateEditor(values));
            }
          }}
        >
          {() => {
            return (
              <>
                <AutoSubmit />
                <Field.Radio label="主题设置" name="theme" labelProps={labelProps}>
                  <option value="light">浅色</option>
                  <option value="dark">深色</option>
                </Field.Radio>
              </>
            );
          }}
        </Formik>
      </div>
    </>
  );
};

export default GlobalProps;
