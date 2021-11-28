import { useDispatch } from 'react-redux';
import { FormikContextType } from 'formik';
import { Button, Classes, Drawer, ButtonGroup } from '@blueprintjs/core';
import { JSONEditor } from 'components/common/CodeEditor';
import { appAction } from 'store/features/appSlice';
import { isRelease, qs } from 'utils';
import { useBoolean } from 'ahooks';

interface Props {
  formik: FormikContextType<AutoDV.Comp>;
  compData: AutoDV.Comp;
}

const DebugFormik = ({ formik }: { formik: Props['formik'] }) => {
  const [state, { setTrue, setFalse }] = useBoolean(false);
  return (
    <>
      <Button small text={'formik'} onClick={setTrue} />
      <Drawer title="查看formik数据" isOpen={state} style={{ width: '50%' }} onClose={setFalse}>
        <div className={Classes.DRAWER_BODY}>
          <JSONEditor value={JSON.stringify(formik, null, 2)} zoomIn={false} options={{ readOnly: true }} />
        </div>
      </Drawer>
    </>
  );
};

const DebugConfig = ({ compData }: { compData: Props['compData'] }) => {
  const [state, { setTrue, setFalse }] = useBoolean(false);
  const dispatch = useDispatch();

  const handleChange = (value: string) => {
    try {
      const config: AutoDV.Config = JSON.parse(value);
      dispatch(
        appAction.updateComp({
          code: compData.code,
          comp: { ...compData, config },
        })
      );
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <Button small onClick={setTrue}>
        config
      </Button>
      <Drawer title="编辑配置项" isOpen={state} style={{ width: '50%' }} onClose={setFalse}>
        <div className={Classes.DRAWER_BODY}>
          <JSONEditor value={JSON.stringify(compData.config, null, 2)} onSubmit={handleChange} zoomIn={false} />
        </div>
      </Drawer>
    </>
  );
};

const CompDebug: React.FC<Props> = ({ formik, compData }) => {
  return !isRelease || qs.query['__debug__'] === '1011' ? (
    <ButtonGroup>
      <DebugFormik formik={formik} />
      <DebugConfig compData={compData} />
    </ButtonGroup>
  ) : null;
};

export default CompDebug;
