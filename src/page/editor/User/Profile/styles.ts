import styled from 'styled-components';

export const ProfileContainer = styled.div`
  height: 100%;
  width: 100%;
  padding: 0px 10px;
  .user-info {
    width: 100%;
    height: 30%;
    display: flex;
    justify-content: flex-start;
    align-items: flex-end;
    padding: 10px 0px;
    .avatar {
      height: 220px;
      width: 220px;
      border-radius: 10px;
      box-shadow: 0px 0px 1px rgba(34, 34, 34, 1);
    }
    .info {
      margin-left: 10px;
      flex: 1;
      font-size: 24px;
      > p {
        display: flex;
        align-items: center;
      }
    }
  }
  .app-list {
    width: 100%;
  }
`;

export const AppsContainer = styled.div``;
