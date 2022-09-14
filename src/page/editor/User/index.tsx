import { Control } from '@components/form';
import { ButtonGroup, Button } from '@mui/material';
import { login, signUp, UserInfo, UserRole } from '@service/userInfo';
import { Formik, FormikState } from 'formik';
import { useState } from 'react';
import { useHistory } from 'react-router-dom';
import styled from 'styled-components';
import { object, ref, string } from 'yup';

interface AuthParam extends UserInfo {
  confirmPassword: string;
}

const loginValidationSchema = {
  username: string().required('Required'),
  password: string().required('Required'),
};
const signUpValidationSchema = {
  ...loginValidationSchema,
  email: string().email('not email').required('Required'),
  confirmPassword: string().oneOf([ref('password'), null], 'Passwords must match'),
};

export const Auth: React.FunctionComponent = () => {
  const [isSignUp, setSignUp] = useState(false);

  const history = useHistory();

  const handleAuthSuccess = () => {
    if (isSignUp) {
      setSignUp(false);
    } else {
      history.push('/editor/canvas');
    }
  };

  const handleCancel = (reset: (nextState?: Partial<FormikState<AuthParam>> | undefined) => void) => {
    setSignUp(!isSignUp);
    return reset;
  };

  const handleAuth = (param: UserInfo) => {
    if (isSignUp) {
      return signUp(param);
    } else {
      return login(param);
    }
  };
  return (
    <Container>
      <div className="logo" />
      <h2>{isSignUp ? 'Create new account' : 'Welcome to Juggle Data View'}</h2>
      <div className="form">
        <Formik<AuthParam>
          initialValues={{
            username: '',
            email: '',
            password: '',
            confirmPassword: '',
            role: UserRole.normal,
          }}
          onSubmit={async (val, { setSubmitting }) => {
            try {
              setSubmitting(true);
              await handleAuth(val);
              handleAuthSuccess();
            } catch (error) {
              console.log(error);
            } finally {
              setSubmitting(false);
            }
          }}
          validationSchema={object().shape(isSignUp ? signUpValidationSchema : loginValidationSchema)}
        >
          {({ errors, isSubmitting, submitForm, resetForm }) => {
            return (
              <>
                <Control.InputText
                  name="username"
                  muiProps={{
                    placeholder: 'username',
                    error: 'username' in errors,
                    disabled: isSubmitting,
                  }}
                />
                {isSignUp ? (
                  <Control.InputText
                    name="email"
                    muiProps={{
                      placeholder: 'email',
                      error: 'email' in errors,
                      disabled: isSubmitting,
                    }}
                  />
                ) : null}
                <Control.InputText
                  name="password"
                  muiProps={{
                    placeholder: 'password',
                    error: 'password' in errors,
                    type: 'password',
                    disabled: isSubmitting,
                  }}
                />
                {isSignUp ? (
                  <Control.InputText
                    name="confirmPassword"
                    muiProps={{
                      placeholder: 'confirm password',
                      type: 'password',
                      error: 'confirmPassword' in errors,
                      disabled: isSubmitting,
                    }}
                  />
                ) : null}
                <ButtonGroup>
                  <Button onClick={submitForm} disabled={isSubmitting} type="submit">
                    {!isSignUp ? 'login' : 'Sign Up'}
                  </Button>
                  <Button onClick={() => handleCancel(resetForm)()} disabled={isSubmitting}>
                    {isSignUp ? 'cancel' : 'Sign Up'}
                  </Button>
                </ButtonGroup>
              </>
            );
          }}
        </Formik>
      </div>
    </Container>
  );
};

const Container = styled.div`
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
`;
