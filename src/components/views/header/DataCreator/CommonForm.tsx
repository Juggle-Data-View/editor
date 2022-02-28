import { DataSourceType as DT } from 'config/const';
import { Field } from 'components/form';
import { useMemo } from 'react';
import { ISelect } from 'components/form/Select';

const CommonForm: React.FC = () => {
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

  return (
    <>
      <Field.Select label="数据源类型" name="datasourceType" options={options} />
      <Field.Text label="数据源名称" name="name" />
    </>
  );
};

export default CommonForm;
