import { AddCircle } from '@mui/icons-material';
import { IconButton, Tooltip } from '@mui/material';
import SearchSelect, { Item } from 'components/common/SearchSelect';
import { useSelector } from 'react-redux';
import { selectEditorPanel } from 'store/selectors';
import { DatasourceListContainer } from './style';

const DatasourceList: React.FC = () => {
  const handleItemSelect = (item: Item) => {
    //TODO: trigger datesource item editor toast
    console.log(item);
  };
  const panel = useSelector(selectEditorPanel);

  return (
    <DatasourceListContainer visible={panel.compList}>
      <div className="listTop">
        <SearchSelect activeItem={undefined} items={[]} onItemSelect={handleItemSelect} />
        <IconButton style={{ margin: '0px 5px' }}>
          <Tooltip title="新增数据源" placement="bottom">
            <AddCircle />
          </Tooltip>
        </IconButton>
      </div>
    </DatasourceListContainer>
  );
};
export default DatasourceList;
