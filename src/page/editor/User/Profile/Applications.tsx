import { getUserApps } from '@service/userInfo';
import { isEmpty } from 'lodash';
import { useEffect, useState } from 'react';
import { AppsContainer } from './styles';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

const AppCard: React.FunctionComponent<{ data: Parse.Object<Parse.Attributes> }> = ({ data }) => {
  return (
    <Card sx={{ maxWidth: 345 }}>
      <CardContent>
        <Typography gutterBottom variant="h5" component="div">
          {data.get('name')}
        </Typography>
      </CardContent>
      <CardActions>
        <Button size="small">open</Button>
        <Button size="small">delete</Button>
      </CardActions>
    </Card>
  );
};

const Applications: React.FunctionComponent = () => {
  const [apps, setApps] = useState<Parse.Object<Parse.Attributes>[]>([]);

  useEffect(() => {
    getUserApps().then((data) => {
      setApps(data);
    });
  }, []);

  const isAppsEmpty = isEmpty(apps);

  const renderApps = () =>
    apps.map((item) => {
      return <AppCard key={item.id} data={item} />;
    });

  return <AppsContainer>{isAppsEmpty ? <div>no apps</div> : renderApps()}</AppsContainer>;
};

export default Applications;
