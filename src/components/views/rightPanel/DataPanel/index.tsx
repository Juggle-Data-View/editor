import { Box } from '@mui/material';
import { Field } from 'components/form';
import { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { selectDatasources } from 'store/selectors';
import { DataConfigStyled } from '../style';
import JsonToTable from './JsonToTable';

const DataPanel: React.FC<AutoDV.CompDataConfig> = (props) => {
  const { fieldMap, dataSourceId } = props;

  const datasources = useSelector(selectDatasources);

  const options = useMemo(() => {
    return Object.keys(datasources).map((code) => {
      const { name, dataSourceId } = datasources[code];
      return {
        label: String(name || dataSourceId),
        value: dataSourceId,
      };
    });
  }, [datasources]);

  const tableData = useMemo(() => {
    const datasource = datasources[dataSourceId];
    if (!datasource) {
      return [];
    }
    if (!Array.isArray(datasource.body)) {
      return [datasource.body];
    }
    return datasource.body;
  }, [datasources, dataSourceId]);

  return (
    <DataConfigStyled>
      <Field.Select
        name="dataConfig.dataSourceId"
        options={options}
        label={<Box sx={{ typography: 'h5' }}>选择数据源</Box>}
      />
      <div className="bottomContainer">
        <JsonToTable data={tableData} fieldMap={fieldMap} />
      </div>
    </DataConfigStyled>
  );
};

export default DataPanel;
