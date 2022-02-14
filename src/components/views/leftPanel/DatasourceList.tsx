import { AddCircle } from '@mui/icons-material';
import { IconButton, Tooltip } from '@mui/material';
import SearchSelect, { Item } from 'components/common/SearchSelect';

const DatasourceList: React.FC = () => {
  const handleItemSelect = (item: Item) => {
    //TODO: trigger datesource item editor toast
    console.log(item);
  };

  return (
    <div>
      <div>
        <SearchSelect activeItem={undefined} items={[]} onItemSelect={handleItemSelect} />
        <IconButton>
          <Tooltip title="新增数据源" placement="bottom">
            <AddCircle />
          </Tooltip>
        </IconButton>
      </div>
    </div>
  );
};
export default DatasourceList;
