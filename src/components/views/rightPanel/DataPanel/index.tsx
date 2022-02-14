import { Box } from '@mui/material';
import { Field } from 'components/form';
import { DataConfigStyled } from '../style';
import JsonToTable from './JsonToTable';

const DataPanel: React.FC<AutoDV.DataConfig> = (props) => {
  const { mockData, fieldMap } = props;

  return (
    <DataConfigStyled>
      <Field.Select name="dataConfig.dataSourceId" label={<Box sx={{ typography: 'h5' }}>选择数据源</Box>} />
      <div className="bottomContainer">
        <JsonToTable data={mockData} fieldMap={fieldMap} />
      </div>
    </DataConfigStyled>
  );
};

export default DataPanel;
