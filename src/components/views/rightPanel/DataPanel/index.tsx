import { Box } from '@mui/material';
import { Field } from 'components/form';
import { useMemo } from 'react';

import { DataConfigStyled } from '../style';
import JsonToTable from './JsonToTable';
import { JuggleDV } from '@juggle-data-view/types';

export interface DataPanelProps extends JuggleDV.CompDataConfig {
  body: any;
  datasourcesList: {
    label: string;
    value: JuggleDV.DataSourceId;
  }[];
}

const DataPanel: React.FC<DataPanelProps> = (props) => {
  const { fieldMap, datasourcesList, body } = props;

  const tableData = useMemo(() => {
    if (!Array.isArray(body)) {
      return [body];
    }
    return body;
  }, [body]);

  return (
    <DataConfigStyled>
      <Field.Select
        name="dataConfig.dataSourceId"
        options={datasourcesList}
        label={<Box sx={{ typography: 'h5' }}>选择数据源</Box>}
        labelProps={{
          width: 120,
        }}
      />
      <div className="bottomContainer">
        <JsonToTable data={tableData} fieldMap={fieldMap} />
      </div>
    </DataConfigStyled>
  );
};

export default DataPanel;
