import { ProfileContainer } from './styles';

const Profile: React.FunctionComponent = () => {
  return (
    <ProfileContainer>
      <div className="user-info">
        <div className="avatar"></div>
        <div className="info"></div>
      </div>
      <div className="app-list"></div>
    </ProfileContainer>
  );
};

export default Profile;
