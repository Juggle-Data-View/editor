import styled from 'styled-components';
import classNames from 'classnames';
import DropDown, { IDropDown } from '@components/common/DropDown';

const Container = styled.div`
  position: relative;
  z-index: 10;
  .dd-item {
    padding: 10px;
    display: flex;
    align-items: center;
    img {
      max-width: 40px;
      max-height: 40px;
      min-height: 40px;
      margin-right: 10px;
    }
  }
  .dd-list {
    .inner {
      display: flex;
      flex-wrap: wrap;
      padding-bottom: 10px;
    }
    .list-item {
      margin: 10px 0 0 4%;
      padding: 5px;
      width: 44%;
      text-align: center;
      .img {
        position: relative;
        width: 100%;
        padding-bottom: 60%;
        border: 1px solid transparent;
        transition: transform 0.3s ease;
        img {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          max-width: 100%;
          max-height: 100%;
        }
      }
      p {
        margin-top: 3px;
      }
      &:hover,
      &.--active {
        background: #eee;
        .img {
          transform: scale(1.05);
        }
      }
    }
  }
`;

export interface IItem {
  name: string;
  source: string;
}

export interface IImageSelect {
  active: IItem | null;
  items: IItem[];
  onChange: IDropDown<IItem>['onItemSelect'];
}

const ImageSelect: React.FC<IImageSelect> = ({ active, items, onChange }) => {
  return (
    <Container>
      <DropDown<IItem>
        items={items}
        itemRenderer={({ item, handleClick }) => {
          const selected = active && item.source === active.source;
          return (
            <div className={classNames('list-item', { '--active': selected })} key={item.source} onClick={handleClick}>
              <div className="img">
                <img src={item.source} alt="" />
              </div>
              <p>{item.name}</p>
            </div>
          );
        }}
        onItemSelect={onChange}
        listMaxHeight={300}
      >
        <>
          {active && <img src={active.source} alt="" />}
          <span>{active ? active.name : '无'}</span>
        </>
      </DropDown>
    </Container>
  );
};

export default ImageSelect;
