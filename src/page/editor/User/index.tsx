import { Control } from '@components/form';
import { ButtonGroup, Button } from '@mui/material';
import { login, signUp, UserInfo } from '@service/userInfo';
import { Formik } from 'formik';
import styled from 'styled-components';
import { object, string } from 'yup';

interface AuthParam extends UserInfo {
  confirmPassword: string;
}

export const Auth = (type: 'login' | 'signUp'): React.FunctionComponent => {
  const isSignUp = type === 'signUp';
  const handleAuth = (param: UserInfo) => {
    if (isSignUp) {
      signUp(param);
    } else {
      login(param);
    }
  };
  return () => (
    <Container>
      <Formik<Partial<AuthParam>>
        initialValues={{
          username: '',
          email: '',
          password: '',
          confirmPassword: '',
        }}
        onSubmit={console.log}
        validationSchema={object().shape({
          username: string().required(),
          email: string().when('email', {
            is: isSignUp,
            then: string().required('Required'),
          }),
          password: string().required(),
        })}
      >
        <Control.InputText
          name="username"
          muiProps={{
            placeholder: 'username',
          }}
        />
        {isSignUp ? (
          <Control.InputText
            name="email"
            muiProps={{
              placeholder: 'email',
            }}
          />
        ) : null}
        <Control.InputText
          name="password"
          muiProps={{
            placeholder: 'password',
          }}
        />
        {isSignUp ? (
          <Control.InputText
            name="confirmPassword"
            muiProps={{
              placeholder: 'confirm password',
            }}
          />
        ) : null}
        <ButtonGroup>
          <Button type="submit">
            {
              //TODO: implement user auth
            }
          </Button>
          <Button></Button>
        </ButtonGroup>
      </Formik>
    </Container>
  );
};

const Container = styled.div`
   {
    font-family: sans-serif;
    text-align: center;
    .form {
      max-width: 330px;
      margin: 0 auto;
      display: flex;
      flex-direction: column;
      background: white;
      padding: 20px;
      margin-top: 30px;
    }
  }
`;
