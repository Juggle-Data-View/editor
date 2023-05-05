import { AddCircle } from '@mui/icons-material';
import LayersIcon from '@mui/icons-material/Layers';
import { Button, Card, CardActions, CardContent, Popover, Tab, Typography } from '@mui/material';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import React, { useEffect, useState } from 'react';
import ComponentsLayers from './ComponentsLayers';
import { LeftPannelContainer } from './style';
import SkipPreviousOutlinedIcon from '@mui/icons-material/SkipPreviousOutlined';
import LogoutIcon from '@mui/icons-material/Logout';
import { useDispatch, useSelector } from 'react-redux';
import { editorAction } from '@store/features/editorSlice';
import { selectEditorPanel, selectUserRole } from '@store/selectors';
import ComponentsStore from './ComponentsStore';
import StorageIcon from '@mui/icons-material/Storage';
import DatasourceList from './DatasourceList';
import useLang from '@components/base/useLang';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { useHistory, useParams } from 'react-router-dom';
import { User } from 'parse';
import { logout } from '@service/userInfo';
import AccountBoxIcon from '@mui/icons-material/AccountBox';
import GitHubIcon from '@mui/icons-material/GitHub';
import { getCachedAppID } from '@helpers/fetchAppConfig';

const LeftPanel: React.FC = () => {
  const lang = useLang();
  const { page, userPage } = useParams<RouterParams>();
  const [activeKey, setActiveKey] = useState(page === 'user' ? 'user' : 'create');
  const dispatch = useDispatch();
  const panel = useSelector(selectEditorPanel);
  const userRole = useSelector(selectUserRole);
  const history = useHistory();
  const isLogin = !!User.current();
  const [isShowPopper, setShowPopper] = useState(!isLogin && page !== 'user');
  const currentAppID = new URL(window.location.href).searchParams.get('app_id')
    || getCachedAppID();

  const handleChange = (event: React.SyntheticEvent, val: string) => {
    setActiveKey(val);
    if (val !== 'user') {
      history.push('/editor/canvas' + '?app_id=' + currentAppID);
      dispatch(
        editorAction.controlPanel({
          compList: true,
        })
      );
    } else {
      history.push('/editor/user/profile');
      dispatch(
        editorAction.controlPanel({
          compList: false,
        })
      );
    }
  };

  const handleLogOut = async () => {
    try {
      await logout();
      dispatch(editorAction.setUserRole('Guest'));
      history.push('/editor/user/auth');
      dispatch(
        editorAction.controlPanel({
          compList: false,
        })
      );
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (activeKey === 'user') {
      dispatch(
        editorAction.controlPanel({
          compList: false,
        })
      );
    }
  }, []); // eslint-disable-line

  const handleCardClose = () => {
    setShowPopper(false);
    history.push('/editor/user/auth');
  };

  useEffect(() => {
    const isTurnToCanvas = page === 'user' && userPage !== 'profile' && isLogin;
    isLogin && dispatch(editorAction.setUserRole('User'));
    if (isTurnToCanvas) {
      //handle auto login
      history.push('/editor/canvas');
      setActiveKey('create');
      dispatch(
        editorAction.controlPanel({
          compList: true,
        })
      );
    }

    if (page === 'canvas') {
      activeKey === 'user' && setActiveKey('create');
      dispatch(
        editorAction.controlPanel({
          compList: true,
        })
      );
    }

  }, [page, userPage, history, dispatch]); // eslint-disable-line

  return (
    <LeftPannelContainer visible={panel.compList}>
      <TabContext value={activeKey}>
        <div className="dashbroadController">
          <TabList orientation="vertical" onChange={handleChange}>
            <Tab label={lang.createComp} value="create" icon={<AddCircle />} />
            <Tab label={lang.layerList} value="layer" icon={<LayersIcon />} />
            <Tab label={lang.datasourcesList} value="datasource" icon={<StorageIcon />} />
            {userRole !== 'Guest' ? (
              <Tab
                label={lang.user}
                value="user"
                icon={<AccountCircleIcon />}
              />
            ) : null}
          </TabList>
          <div className="operation-container">
            <div
              title="pick up"
              className="operations"
              onClick={() => activeKey === 'user' && dispatch(editorAction.togglePanel('compList'))}
            >
              <SkipPreviousOutlinedIcon />
            </div>
            <div
              title="pick up"
              className="operations"
              onClick={() => window.open('https://github.com/Juggle-Data-View/editor')}
            >
              <GitHubIcon />
            </div>
            <div title="log out" className="operations" onClick={handleLogOut}>
              {isLogin ? <LogoutIcon /> : <AccountBoxIcon />}
            </div>

            <Popover
              anchorPosition={{
                left: document.body.clientWidth - 200,
                top: document.body.clientWidth - 100,
              }}
              anchorReference="anchorPosition"
              open={isShowPopper}
              onClose={() => setShowPopper(false)}
            >
              <Card sx={{ minWidth: 275 }}>
                <CardContent>
                  <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
                    欢迎来到Juggle Data View
                  </Typography>
                  <Typography variant="h5" component="div">
                    成为注册用户获得更好的体验
                  </Typography>
                </CardContent>
                <CardActions>
                  <Button onClick={handleCardClose} size="small">
                    Learn More
                  </Button>
                </CardActions>
              </Card>
            </Popover>
          </div>
        </div>

        <TabPanel value="layer">
          <ComponentsLayers />
        </TabPanel>
        <TabPanel value="create">
          <ComponentsStore />
        </TabPanel>
        <TabPanel value="datasource">
          <DatasourceList />
        </TabPanel>
      </TabContext>
    </LeftPannelContainer>
  );
};

export default LeftPanel;
