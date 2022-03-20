import { Button } from '@mui/material';
import { ADD_COMP } from 'components/base/BaseActions';
import { Control } from 'components/form';
import { DEFAULT_THUMBNAIL } from 'config/const';
import menu, { Category, GroupChildren, MenuItemKey } from 'config/menu';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import { selectEditorPanel } from 'store/selectors';
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
  const panel = useSelector(selectEditorPanel);
  const renderSubCategory = (item: Category['groups'], categoryId: MenuItemKey) => {
    const subCategory = Object.keys(item);
    return subCategory.map((key) => {
      const { children, alias } = item[key];
      const childrenComp = [];
      console.log(key, children.length);

      for (let index = 0; index < children.length; index += 1) {
        if (index % 2 !== 0) {
          continue;
        }
        const item = children[index];
        const next = children[index + 1];
        childrenComp.push(
          <div key={item.id} className="storeListRow">
            <ListItem itemData={item} categoryId={categoryId} />
            {next ? <ListItem itemData={next} categoryId={categoryId} /> : null}
          </div>
        );
      }
      return (
        <Control.Collapse key={alias} label={alias} isOpen={true}>
          {childrenComp}
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

  return <ComponentsStoreContainer visible={panel.compList}>{renderCategoryList()}</ComponentsStoreContainer>;
};

export default ComponentsStore;
