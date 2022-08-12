import Parse from './initial';

enum Role {
  anonymous = 1,
  normal = 2,
  admin = 3,
  vip_1 = 4,
  vip_2 = 5,
  vip_3 = 6,
}

interface UsersOptions {
  username: string;
  password: string;
  email: string;
  phone?: string;
  role?: Role;
}

const setUserObject = (options: UsersOptions) => {
  const { username, password, email, phone, role = 1 } = options;
  const user = new Parse.User();
  user.set('username', username);
  user.set('password', password);
  user.set('email', email);
  user.set('role', role);
  if (phone) user.set('phone', phone);
  return user;
};

export const signUp = async (options: UsersOptions) => {
  try {
    const user = setUserObject(options);
    await user.signUp();
  } catch (error: any) {
    console.log('Error: ' + error.code + ' ' + error.message);
  }
};

export const login = async (options: Pick<UsersOptions, 'username' | 'password'>) => {
  try {
    const { username, password } = options;
    await Parse.User.logIn(username, password);
  } catch (error: any) {
    console.log('Error: ' + error.code + ' ' + error.message);
  }
};
