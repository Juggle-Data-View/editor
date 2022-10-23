import { AddCircle } from '@mui/icons-material';
import LayersIcon from '@mui/icons-material/Layers';
import { Tab } from '@mui/material';
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

const LeftPanel: React.FC = () => {
  const lang = useLang();
  const { page, userPage } = useParams<RouterParams>();
  const [activeKey, setActiveKey] = useState(page === 'user' ? 'user' : 'create');
  const dispatch = useDispatch();
  const panel = useSelector(selectEditorPanel);
  const userRole = useSelector(selectUserRole);
  const history = useHistory();

  const isLogin = !!User.current();
  const isNoUser = activeKey === 'user' && !isLogin;

  const handleChange = (event: React.SyntheticEvent, val: string) => {
    setActiveKey(val);
    if (val !== 'user') {
      history.push('/editor/canvas');
      dispatch(
        editorAction.controlPanel({
          compList: true,
        })
      );
    } else {
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
  }, [page, userPage, history, dispatch]); // eslint-disable-line

  return (
    <LeftPannelContainer visible={panel.compList}>
      <TabContext value={activeKey}>
        <div className="dashbroadController">
          <TabList orientation="vertical" onChange={handleChange}>
            <Tab disabled={isNoUser} label={lang.createComp} value="create" icon={<AddCircle />} />
            <Tab disabled={isNoUser} label={lang.layerList} value="layer" icon={<LayersIcon />} />
            <Tab disabled={isNoUser} label={lang.datasourcesList} value="datasource" icon={<StorageIcon />} />
            {userRole !== 'Guest' ? (
              <Tab
                label={lang.user}
                value="user"
                onClick={() => {
                  history.push('/editor/user/profile');
                }}
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
            <div title="log out" className="operations" onClick={handleLogOut}>
              <LogoutIcon />
            </div>
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