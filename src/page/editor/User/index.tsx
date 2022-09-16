import { Route, Switch } from 'react-router-dom';
import { Auth } from './Auth';

const User: React.FunctionComponent = () => {
  return (
    <Switch>
      <Route path="/editor/user/auth">
        <Auth />
      </Route>
    </Switch>
  );
};

export default User;
