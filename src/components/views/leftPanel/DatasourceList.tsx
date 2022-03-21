import { AddCircle, Delete, Edit } from '@mui/icons-material';
import { IconButton, Tooltip } from '@mui/material';
import AutoDVIcon, { AutoDVIconName } from 'components/common/AutoDVIcon';
import SearchSelect, { Item } from 'components/common/SearchSelect';
import { useDispatch, useSelector } from 'react-redux';
import { appAction } from 'store/features/appSlice';
import { selectDatasources, selectEditorPanel } from 'store/selectors';
import dataCreator from './DataCreator';
import { AutoDV } from 'auto-dv-type';
import { DatasourceListContainer } from './style';

const DatasourceList: React.FC = () => {
  const handleItemSelect = (item: Item) => {
    //TODO: trigger datesource item editor toast
    console.log(item);
  };

  const dispatch = useDispatch();

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
      const item = datasourceList[key];
      const { dataSourceType, name } = item;
      return (
        <div className="listItem" key={key}>
          <div className="label">
            <IconButton>
              <AutoDVIcon icon={getDatasourceIcon(dataSourceType)} />
            </IconButton>
            {name || key}
          </div>
          <div className="operator">
            <IconButton onClick={() => dataCreator(item)}>
              <Edit />
            </IconButton>
            <IconButton onClick={() => dispatch(appAction.deleteDatasource(item))}>
              <Delete />
            </IconButton>
          </div>
        </div>
      );
    });
  };

  return (
    <DatasourceListContainer visible={panel.compList}>
      <div className="listTop">
        <SearchSelect activeItem={undefined} items={[]} onItemSelect={handleItemSelect} />
        <IconButton style={{ margin: '0px 5px' }} onClick={() => dataCreator()}>
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
