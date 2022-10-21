import { Route, Switch } from 'react-router-dom';
import { Auth } from './Auth';
import Profile from './Profile';

const User: React.FunctionComponent = () => {
  return (
    <Switch>
      <Route exact path="/editor/user/auth">
        <Auth />
      </Route>
      <Route path="/editor/user/profile">
        <Profile />
      </Route>
    </Switch>
  );
};

export default User;
