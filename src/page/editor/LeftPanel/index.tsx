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
import { selectEditorPanel } from '@store/selectors';
import ComponentsStore from './ComponentsStore';
import StorageIcon from '@mui/icons-material/Storage';
import DatasourceList from './DatasourceList';
import useLang from '@components/base/useLang';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { useHistory, useParams } from 'react-router-dom';
import { User } from 'parse';

const LeftPanel: React.FC = () => {
  const [activeKey, setActiveKey] = useState('create');
  const lang = useLang();
  const { userPage } = useParams<RouterParams>();
  const dispatch = useDispatch();
  const panel = useSelector(selectEditorPanel);
  const history = useHistory();

  const isLogin = !!User.current();
  const isUser = activeKey === 'user' && !isLogin;

  const handleChange = (event: React.SyntheticEvent, val: string) => {
    setActiveKey(val);
  };

  const handleLogOut = async () => {
    try {
      await User.logOut();
      history.push('/editor/user/auth');
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (userPage === 'auth' && !isLogin) {
      setActiveKey('user');
    } else {
      setActiveKey('create');
    }
  }, [isLogin, userPage]);

  useEffect(() => {
    dispatch(
      editorAction.controlPanel({
        compList: activeKey !== 'user',
      })
    );
  }, [activeKey, dispatch, userPage]);

  return (
    <LeftPannelContainer visible={panel.compList}>
      <TabContext value={activeKey}>
        <div className="dashbroadController">
          <TabList orientation="vertical" onChange={handleChange}>
            <Tab disabled={isUser} label={lang.createComp} value="create" icon={<AddCircle />} />
            <Tab disabled={isUser} label={lang.layerList} value="layer" icon={<LayersIcon />} />
            <Tab disabled={isUser} label={lang.datasourcesList} value="datasource" icon={<StorageIcon />} />
            <Tab label={lang.user} value="user" icon={<AccountCircleIcon />} />
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
