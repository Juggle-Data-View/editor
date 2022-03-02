import { DataSourceType as DT } from 'config/const';
import { Control, Field } from 'components/form';
import { useEffect, useMemo, useState } from 'react';
import { ISelect } from 'components/form/Select';
import {
  ArrayHelpers,
  FieldArray,
  useFormikContext,
  // , Field as FormField
} from 'formik';
import { Delete } from '@mui/icons-material';
import { IconButton } from '@mui/material';
import CodeEditor from 'components/common/CodeEditor';
// import { Formatter } from 'components/form/Formatter';

const DataParamItem: React.FC<ArrayHelpers & { index: number }> = ({ index }) => {
  const { values } = useFormikContext<AutoDV.MixinDatasource>();

  return (
    <div>
      <Control.InputText
        name={`dataParams[${index}].name`}
        muiProps={{
          placeholder: "parameter's name",
        }}
        validate={
          (value) => (values.dataParams?.find((item) => item.value === value) ? 'Parameter is existed' : undefined) //Parameter is unique
        }
      />
      <Control.InputText
        name={`dataParams[${index}].value`}
        muiProps={{
          placeholder: "parameter's value",
        }}
      />
      <IconButton>
        <Delete />
      </IconButton>
    </div>
  );
};

const asyncFormatter = (setState: any, value?: string) => {
  return new Promise((resolve) => {
    resolve(<CodeEditor value={value || ''} />);
  }).then((comp) => setState(comp));
};

const CommonForm: React.FC<{ params?: AutoDV.DataParam[]; onChange: any }> = ({ params, onChange }) => {
  const options = useMemo(() => {
    const result: ISelect['options'] = [];
    for (const item in DT) {
      result.push({
        label: item,
        value: item,
      });
    }
    return result;
  }, []);

  const [
    ,
    // EditorComp
    setEditorComp,
  ] = useState();

  useEffect(() => {
    asyncFormatter(setEditorComp);
  }, []);

  return (
    <>
      <Field.Select label="数据源类型" name="datasourceType" options={options} />
      <Field.Text label="数据源名称" name="name" />
      <FieldArray name="dataParams">
        {(helper) => {
          return params ? params.map((v, index) => <DataParamItem key={v.name} {...helper} index={index} />) : null;
        }}
      </FieldArray>
      {/* <FormField>{({form}:FieldProps)=> <EditorComp /> }</FormField> */}
    </>
  );
};

export default CommonForm;
