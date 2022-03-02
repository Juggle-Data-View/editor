import { AddCircle } from '@mui/icons-material';
import { IconButton, Tooltip } from '@mui/material';
import AutoDVIcon, { AutoDVIconName } from 'components/common/AutoDVIcon';
import SearchSelect, { Item } from 'components/common/SearchSelect';
import { useSelector } from 'react-redux';
import { selectDatasources, selectEditorPanel } from 'store/selectors';
import DataCreator from './DataCreator';
import { DatasourceListContainer } from './style';

const DatasourceList: React.FC = () => {
  const handleItemSelect = (item: Item) => {
    //TODO: trigger datesource item editor toast
    console.log(item);
  };
  const panel = useSelector(selectEditorPanel);
  const datasourceList = useSelector(selectDatasources) || [];

  const getDatasourceIcon = (type: AutoDV.DataSourceType): AutoDVIconName => {
    switch (type) {
      case 1:
        return 'autoDV-API';
      case 3:
        return 'autoDV-table';
      default:
        return 'autoDV-offline';
    }
  };

  const renderListItem = () => {
    return Object.keys(datasourceList).map((key) => {
      const { dataSourceType, name } = datasourceList[key];
      return (
        <div className="listItem" key={key}>
          <IconButton>
            <AutoDVIcon icon={getDatasourceIcon(dataSourceType)} />
          </IconButton>
          {name || key}
        </div>
      );
    });
  };

  return (
    <DatasourceListContainer visible={panel.compList}>
      <div className="listTop">
        <SearchSelect activeItem={undefined} items={[]} onItemSelect={handleItemSelect} />
        <IconButton style={{ margin: '0px 5px' }} onClick={() => DataCreator()}>
          <Tooltip title="新增数据源" placement="bottom">
            <AddCircle />
          </Tooltip>
        </IconButton>
      </div>
      <div className="listContainer">{renderListItem()}</div>
    </DatasourceListContainer>
  );
};
export default DatasourceList;
