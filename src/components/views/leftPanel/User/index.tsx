import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import AirplayIcon from '@mui/icons-material/Airplay';
import { useSelector } from 'react-redux';
import { selectEditorPanel } from 'store/selectors';
import { Container } from './styles';

const User: React.FunctionComponent = () => {
  const panel = useSelector(selectEditorPanel);
  const isLogIn = false;
  return (
    <Container visible={panel.compList && isLogIn}>
      <div>
        <AccountCircleIcon />
        <p>account</p>
      </div>
      <div>
        <AirplayIcon />
        <p>application</p>
      </div>
    </Container>
  );
};

export default User;
