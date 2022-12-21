import { getUserApps } from '@service/userInfo';
import { isEmpty } from 'lodash';
import { useEffect, useState } from 'react';
import { AppsContainer } from './styles';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { localStorageKey } from '@helpers/fetchAppConfig';

const AppCard: React.FunctionComponent<{ data: Parse.Object<Parse.Attributes>; fetchApps: () => void }> = ({
  data,
  fetchApps,
}) => {
  const handleOpen = () => {
    localStorage.setItem(localStorageKey.CURRENT_APP_ID, data.id);
    //TODO: should reset redux store
    window.location.reload();
  };

  const handleDelete = async () => {
    await data.destroy();
    fetchApps();
  };

  return (
    <Card sx={{ maxWidth: 345, minWidth: 245, margin: 1 }}>
      <CardContent>
        <Typography gutterBottom variant="h5" component="div">
          {data.get('name') || data.id}
        </Typography>
      </CardContent>
      <CardActions>
        <Button onClick={handleOpen} size="small">
          open
        </Button>
        <Button onClick={handleDelete} size="small">
          delete
        </Button>
      </CardActions>
    </Card>
  );
};

const Applications: React.FunctionComponent = () => {
  const [apps, setApps] = useState<Parse.Object<Parse.Attributes>[]>([]);

  const fetchApps = () => {
    getUserApps().then((data) => {
      setApps(data);
    });
  };

  useEffect(() => {
    fetchApps();
  }, []);

  const isAppsEmpty = isEmpty(apps);

  const renderApps = () =>
    apps.map((item) => {
      return <AppCard fetchApps={fetchApps} key={item.id} data={item} />;
    });

  return <AppsContainer>{isAppsEmpty ? <div>no apps</div> : renderApps()}</AppsContainer>;
};

export default Applications;
