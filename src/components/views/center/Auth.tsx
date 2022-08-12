import { Button, ButtonGroup } from '@mui/material';
import { Formik } from 'formik';
import { AutoSubmit, Control } from 'components/form';
import { useState } from 'react';
import styled from 'styled-components';
import { login, signUp } from 'api/user';

const Container = styled.div`
  height: 100%;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  .authContainer {
    box-shadow: 0px 0px 5px #222;
    border-radius: 8px;
    max-width: 400px;
    min-width: 300px;
    padding 10px;
    > h1 {
      text-align: center;
    }
    > div {
      margin: 10px 0px;
    }
  }
`;

const LogIn: React.FunctionComponent = () => {
  return (
    <>
      <Control.InputText muiProps={{ placeholder: 'user name' }} name="username" />

      <Control.InputText muiProps={{ placeholder: 'password', type: 'password' }} name="password" />
    </>
  );
};

const SignUp: React.FunctionComponent = () => {
  // const form =
  return (
    <>
      <Control.InputText muiProps={{ placeholder: 'user name' }} name="username" />
      <Control.InputText muiProps={{ placeholder: 'email' }} name="email" />
      <Control.InputText muiProps={{ placeholder: 'password', type: 'password' }} name="password" />
      <Control.InputText muiProps={{ placeholder: 'confirm password', type: 'password' }} name="confirmPassword" />
    </>
  );
};

const Auth: React.FunctionComponent = () => {
  const [isLogin, setLogin] = useState(true);
  const [userInfo, setUserInfo] = useState<any>();
  const handleSignUp = () => {
    if (!isLogin) {
      console.log(userInfo);
      signUp(userInfo);
    } else {
      setLogin(false);
    }
  };

  return (
    <Container>
      <div className="authContainer">
        <h1>{isLogin ? 'log in' : 'sign up'}</h1>
        <Formik initialValues={{}} onSubmit={(values) => setUserInfo(values)}>
          <>
            <AutoSubmit />
            {isLogin ? <LogIn /> : <SignUp />}
          </>
        </Formik>
        <ButtonGroup>
          <Button
            onClick={() => {
              if (!isLogin) {
                setLogin(true);
              } else {
                login(userInfo);
              }
            }}
          >
            {isLogin ? 'log in' : 'cancel'}
          </Button>
          <Button onClick={handleSignUp}>sign up</Button>
        </ButtonGroup>
      </div>
    </Container>
  );
};

export default Auth;
