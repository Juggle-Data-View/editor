import { Button, Collapse, Box, Divider } from '@mui/material';
import CustomPaginationActionsTable, { Data, OperationFieldMap } from 'components/common/AutoDVTable';
import { useState } from 'react';
import LinkIcon from '@mui/icons-material/Link';
import { useFormikContext } from 'formik';
import { AutoSubmit } from 'components/form';

interface Props {
  data: Data[];
  fieldMap: AutoDV.Field[];
}

const FieldMapItem: React.FC<AutoDV.Field> = ({ alias, sourceFieldName, compFieldName, filter }) => {
  const [isOpen, setOpen] = useState(false);

  return (
    <Button fullWidth onClick={() => setOpen(!isOpen)} disabled={!filter}>
      <div className="title">
        {sourceFieldName || 'not link data field'} <LinkIcon /> {alias || compFieldName}
      </div>
      {filter ? <Collapse in={isOpen}>test</Collapse> : null}
    </Button>
  );
};

const JsonToTable: React.FC<Props> = ({ data, fieldMap }) => {
  const { setFieldValue } = useFormikContext<AutoDV.Comp>();
  const operationFieldMap: OperationFieldMap = (compFieldName, sourceFieldName) => {
    const hasFieldMapIndex = fieldMap.findIndex((item) => item.compFieldName === compFieldName);
    const isExisted = hasFieldMapIndex !== -1;
    if (!isExisted) {
      setFieldValue('dataConfig.fieldMap', [...fieldMap, { compFieldName, sourceFieldName }], true);
    } else {
      const result = fieldMap.slice();
      result[hasFieldMapIndex] = {
        ...result[hasFieldMapIndex],
        sourceFieldName: sourceFieldName || '',
      };
      setFieldValue('dataConfig.fieldMap', result);
    }
  };
  return (
    <>
      <AutoSubmit />
      <CustomPaginationActionsTable fieldMap={fieldMap} rowsData={data} operationFieldMap={operationFieldMap} />
      <div className="fieldMapList">
        <Box
          sx={{
            typography: 'h4',
            paddingTop: '15px',
          }}
        >
          字段映射
        </Box>
        <Divider />
        {fieldMap.map((item) => (
          <FieldMapItem key={item.compFieldName + item.sourceFieldName} {...item} />
        ))}
      </div>
    </>
  );
};

export default JsonToTable;
