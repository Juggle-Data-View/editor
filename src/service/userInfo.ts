import { JuggleDV } from '@juggle-data-view/types';
import { Attributes, Object as ObjectInst, Query, User } from 'parse';

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
    return user.signUp();
  } catch (error) {
    console.log(error);
  }
};

export const login = async (params: UserInfo) => {
  const { username, password } = params;

  try {
    return User.logIn(username, password);
  } catch (error) {
    console.log(error);
  }
};

export const queryUserInfo = () => {
  try {
    const user = User.current();
    if (!user) {
      throw new Error('get user fail');
    }
    return {
      username: user.getUsername(),
      email: user.getEmail(),
      id: user.id,
    };
  } catch (error) {
    console.log(error);
    return {
      username: 'non-name',
      email: 'non-email',
    };
  }
};

export const getUserApps = async () => {
  const applications = ObjectInst.extend('Applications');
  const user = User.current();
  const query = new Query(applications);
  query.equalTo('user', user);
  const result = await query.find();
  return result;
};
