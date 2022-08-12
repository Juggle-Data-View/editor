import { useSelector } from 'react-redux';
import HeaderRight from './HeadRight';
import { HeaderStyled } from './style';
import { selectApp } from 'store/selectors';

const Header: React.FC = () => {
  const { name } = useSelector(selectApp);
  const isLogIn = false;

  return isLogIn ? (
    <HeaderStyled>
      <div className="page-title">
        <strong>{name}</strong>
      </div>
      <HeaderRight />
    </HeaderStyled>
  ) : null;
};

export default Header;
