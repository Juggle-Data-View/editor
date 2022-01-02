import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Collapse, NonIdealState } from '@blueprintjs/core';
import { HeadMenuStyled } from './style';
import { useClickAway, useDebounceFn } from 'ahooks';
import AutoDVIcon from 'components/common/AutoDVIcon';
import { ADD_COMP } from 'components/base/BaseActions';
import { asyncLoadMenu } from 'store/features/dataSlice';
import { selectMenu } from 'store/selectors';
import type { Group } from 'config/menu';
import { DEFAULT_THUMBNAIL } from 'config/const';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import { IconButton } from '@mui/material';

const HeadMenu = () => {
  const [currIndex, setCurrIndex] = useState<number>(0);
  const [visible, setVisible] = useState<boolean>(false);
  const ref = useRef<any>();
  const menu = useSelector(selectMenu);
  const { categories, categoryIds, comps } = menu;
  const dispatch = useDispatch();
  const { run } = useDebounceFn((index: number) => setCurrIndex(index), { wait: 300 });

  useClickAway(() => {
    setVisible(false);
  }, ref);

  useEffect(() => {
    dispatch(asyncLoadMenu());
  }, []); // eslint-disable-line

  const Group = ({ group }: { group: Group }) => {
    const { alias, compIds } = group;
    const [isOpen, setIsOpen] = useState<boolean>(true);
    return (
      <>
        <div className="comps-head" onClick={() => setIsOpen(!isOpen)}>
          {alias}({compIds.length})
          {/* <span className={['icon', isOpen ? '--active' : ''].join(' ')}>
            <Icon icon="chevron-right" />
          </span> */}
        </div>
        <Collapse isOpen={isOpen} keepChildrenMounted={true} transitionDuration={200}>
          <div className="comps-body clearfix">
            {compIds.map((id) => {
              const comp = comps[id];
              return comp ? (
                <div key={id} className="comp" onClick={() => ADD_COMP(id, comp.alias).then(() => setVisible(false))}>
                  <div className="imgbox">
                    <div>
                      <img
                        src={comp ? comp.thumbnail : DEFAULT_THUMBNAIL}
                        onError={(e) => (e.currentTarget.src = DEFAULT_THUMBNAIL)}
                        alt=""
                      />
                    </div>
                  </div>
                  <p>{comp.alias}</p>
                </div>
              ) : (
                <div key={id} className="coming-soon">
                  敬请期待
                </div>
              );
            })}
          </div>
        </Collapse>
      </>
    );
  };

  return (
    <HeadMenuStyled ref={ref} className={visible ? '--active' : ''} width={64}>
      <div className="block" onClick={() => setVisible(!visible)}>
        <IconButton>
          <AddCircleOutlineIcon />
        </IconButton>
      </div>
      <div className="expander">
        {menu ? (
          categoryIds.map((id, index) => {
            const { alias, icon, groupIds, groups } = categories[id];
            return (
              <dl key={id} className={currIndex === index ? 'active' : ''} onMouseEnter={() => run(index)}>
                <dt className="block">
                  <AutoDVIcon icon={icon as any} size={16} />
                  <p>{alias}</p>
                </dt>
                <dd>
                  {groupIds.map((id) => (
                    <Group key={id} group={groups[id]} />
                  ))}
                </dd>
              </dl>
            );
          })
        ) : (
          <NonIdealState icon={'search'} title="No search results" description={'没有找到菜单信息'} />
        )}
      </div>
    </HeadMenuStyled>
  );
};

export default HeadMenu;
