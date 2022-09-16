import styled from 'styled-components';

export const Container = styled.div`
  height: 100%;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background: #efefef;
  .auth-container {
    font-family: sans-serif;
    text-align: center;
    box-shadow: 0px 0px 5px rgba(34, 34, 34, 0.25);
    background: white;
    border-radius: 8px;
    padding: 5px;
    .logo {
      margin: 5px auto;
      height: 64px;
      width: 64px;
      border-radius: 32px;
      box-shadow: 0px 0px 1px rgba(34, 34, 34, 1);
    }
    .form {
      width: 330px;
      margin: 0 auto;
      display: flex;
      flex-direction: column;
      padding: 20px;
      > div {
        margin-top: 10px;
      }
      > .error {
        text-align: left;
        font-size: 12px;
      }
    }
  }
`;

export const ProfileContainer = styled.div`
  height: 100%;
  width: 100%;
  padding: 0px 10px;
  .user-info {
    width: 100%;
    height: 30%;
    display: flex;
    justify-content: flex-start;
    .avatar {
      height: 64px;
      width: 64px;
      border-radius: 32px;
      box-shadow: 0px 0px 1px rgba(34, 34, 34, 1);
    }
    .info {
      display: flex;
      align-items: center;
    }
  }
  .app-list {
    width: 100%;
  }
`;
