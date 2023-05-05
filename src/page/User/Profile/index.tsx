import { queryUserInfo, UserInfo } from '@service/userInfo';
import { useEffect, useState } from 'react';
import { ProfileContainer } from './styles';
import AlternateEmailIcon from '@mui/icons-material/AlternateEmail';
import PersonIcon from '@mui/icons-material/Person';
import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import Applications from './Applications';

const Profile: React.FunctionComponent = () => {
  const [userInfo, setUserInfo] = useState<Partial<UserInfo>>({});
  const [value, setValue] = useState('Applications');

  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);
  };

  useEffect(() => {
    setUserInfo(queryUserInfo());
  }, []);

  const { username, email } = userInfo;

  return (
    <ProfileContainer>
      <div className="user-info">
        <div className="avatar" />
        <div className="info">
          <p>
            <PersonIcon />
            &nbsp;
            {username}
          </p>
          <p>
            <AlternateEmailIcon />
            &nbsp;
            {email}
          </p>
        </div>
      </div>
      <div className="app-list">
        <Box sx={{ width: '100%', typography: 'body1' }}>
          <TabContext value={value}>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
              <TabList onChange={handleChange} aria-label="lab API tabs example">
                <Tab label="Applications" value="Applications" />
                <Tab label="Item Two" value="2" />
                <Tab label="Item Three" value="3" />
              </TabList>
            </Box>
            <TabPanel value="Applications">
              <Applications />
            </TabPanel>
            <TabPanel value="2">Item Two</TabPanel>
            <TabPanel value="3">Item Three</TabPanel>
          </TabContext>
        </Box>
      </div>
    </ProfileContainer>
  );
};

export default Profile;
