import { Route, Switch, useRouteMatch } from 'react-router-dom';
import Auth from './Auth';
import CanvasWrap from './CanvasWrap';
import CentFoot from './CentFoot';
import { CenterStyled } from './style';

const Center = () => {
  const { path } = useRouteMatch();

  return (
    <Switch>
      <Route path={path} exact>
        <CenterStyled>
          <CanvasWrap />
          <CentFoot />
        </CenterStyled>
      </Route>
      <Route path={`${path}/auth`}>
        <Auth />
      </Route>
    </Switch>
  );
};

export default Center;
