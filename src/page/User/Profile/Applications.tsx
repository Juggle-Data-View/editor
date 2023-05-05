import { isEmpty } from 'lodash';
import { useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { AppsContainer } from './styles';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { setAppID, setCacheAppID } from '@helpers/fetchAppConfig';
import api from '@service/index';
import notice from '@utils/notice';
import { createNewApps } from '@service/apps';
import AppConfig, { AppInfo, initCanvas } from '@store/DB/default.conf';
import { JuggleDV } from '@juggle-data-view/types';
import { Add } from '@mui/icons-material';

const AppCard: React.FunctionComponent<{ data: Parse.Object<Parse.Attributes>; }> = ({
  data,
}) => {
  const { refetch } = api.useGetUserAppsQuery('UserApps');
  const { push } = useHistory()
  const handleOpen = () => {
    setAppID(data.id);
    setCacheAppID(data.id);
    push('/editor/canvas?app_id=' + data.id);
  };

  const handleDelete = async () => {
    await data.destroy();
    refetch();
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

const CreateNewApp: React.FunctionComponent = () => {
  const val = api.useGetUserAppsQuery('UserApps');
  const handleCreate = async () => {
    const newApp: JuggleDV.State = {
      app: AppInfo,
      canvas: initCanvas,
      compCodes: [],
      compDatas: {},
      selectedCompCodes: [],
      copyComps: [],
      keyPressed: null,
      version: 0
    }
    const appRes = await createNewApps(newApp)
    val.refetch()
  };

  return (
    <Card onClick={handleCreate} sx={{ maxWidth: 345, minWidth: 245, margin: 1, cursor: 'pointer' }}>
      <CardContent>
        <div style={{
          display: 'flex',
          height: '100%',
          width: '100%',
          justifyContent: 'center',
          alignItems: 'center',
          fontSize: '3rem',
          fontWeight: 'bold',
        }} >+</div>
      </CardContent>
    </Card>
  );
};

const Applications: React.FunctionComponent = () => {
  const val = api.useGetUserAppsQuery('UserApps');
  const { data, isFetching, isSuccess, currentData } = val;
  const isAppsEmpty = isEmpty(data);

  useEffect(() => {
    if (isFetching) {
      notice.alert('loading applications...');

    } 
  }, [isFetching, isSuccess]);

  useEffect(() => {
    const isHitCache = !isFetching && isSuccess && currentData === data;

    if (!isHitCache) {
      notice.success('applications loaded');
    }
  }, [data, isSuccess, isFetching, currentData]);

  const renderApps = () =>
    data?.map((item: Parse.Object<Parse.Attributes>) => {
      return <AppCard key={item.id} data={item} />;
    });

  return <AppsContainer>{isAppsEmpty ? <CreateNewApp /> : <><CreateNewApp />{renderApps()}</>}</AppsContainer>;
};

export default Applications;
