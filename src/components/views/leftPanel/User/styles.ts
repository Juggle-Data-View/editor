import styled from 'styled-components';

export const Container = styled.div<{ visible: boolean }>`
  margin-left: ${(props) => (props.visible ? 0 : '-235px')};
  width: 235px;
  height: 100%;
  display: flex;
  flex-direction: column;
  .listTop {
    padding: 8px 10px;
    width: 100%;
    display: flex;
  }
  .listContainer {
    flex: 1;
    .listItem {
      width: 100%;
      height: 44px;
      display: flex;
      flex-direction: row;
      align-items: center;
      background-color: ${({ theme }) => theme.palette.action.disabledBackground};
      justify-content: space-between;
      > .label {
        flex: 1;
      }
      > .operator {
      }
    }
  }
`;
