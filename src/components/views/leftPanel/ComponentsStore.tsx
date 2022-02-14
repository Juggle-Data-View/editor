import { Button } from '@mui/material';
import { ADD_COMP } from 'components/base/BaseActions';
import { Control } from 'components/form';
import { DEFAULT_THUMBNAIL } from 'config/const';
import menu, { Category, GroupChildren, MenuItemKey } from 'config/menu';
import { useState } from 'react';
import { ComponentsStoreContainer } from './style';

const ListItem: React.FC<{
  itemData: GroupChildren;
  categoryId: MenuItemKey;
}> = ({ itemData, categoryId }) => {
  const [disable, setDisable] = useState(false);

  const handleComponentClick = async (id: string, alias: string) => {
    setDisable(true);
    await ADD_COMP(id, alias);
    setDisable(false);
  };
  const { id, name, sanpShotUrl, publicPath } = itemData;
  return (
    <Button disabled={disable} onClick={() => handleComponentClick(`${publicPath || categoryId}/${id}`, name)}>
      <div className="components">
        <div>
          <img src={sanpShotUrl ? sanpShotUrl : DEFAULT_THUMBNAIL} title={name} alt={name} />
        </div>
        <div>{name}</div>
      </div>
    </Button>
  );
};

const ComponentsStore: React.FC = () => {
  const renderSubCategory = (item: Category['groups'], categoryId: MenuItemKey) => {
    const subCategory = Object.keys(item);
    return subCategory.map((key) => {
      const { children, alias } = item[key];

      return (
        <Control.Collapse key={alias} label={alias} isOpen={true}>
          {children.map((item, index) => {
            const nextItem = children[index + 1];
            return (
              <div key={item.id} className="storeListRow">
                {<ListItem itemData={item} categoryId={categoryId} />}
                {nextItem ? <ListItem itemData={nextItem} categoryId={categoryId} /> : null}
              </div>
            );
          })}
        </Control.Collapse>
      );
    });
  };

  const renderCategoryList = () => {
    const topLevelcategory = Object.keys(menu) as MenuItemKey[];

    return topLevelcategory.map((key) => {
      const { alias, groups } = menu[key];
      return (
        <Control.Collapse label={alias} isOpen={true} key={key}>
          {renderSubCategory(groups, key)}
        </Control.Collapse>
      );
    });
  };

  return <ComponentsStoreContainer>{renderCategoryList()}</ComponentsStoreContainer>;
};

export default ComponentsStore;
