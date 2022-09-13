import { User } from 'parse';

export enum UserRole {
  admin = 0,
  normal = 1,
  guest = 2,
}

export interface UserInfo {
  role: UserRole;
  username: string;
  password: string;
  email: string;
}

export const signUp = async (params: UserInfo) => {
  const user = new User();
  (Object.keys(params) as (keyof UserInfo)[]).forEach((key) => {
    user.set(key, params[key]);
  });
  try {
    await user.signUp();
  } catch (error) {
    console.log(error);
  }
};

export const login = async (params: UserInfo) => {
  const { username, password } = params;

  try {
    await User.logIn(username, password);
  } catch (error) {
    console.log(error);
  }
};
