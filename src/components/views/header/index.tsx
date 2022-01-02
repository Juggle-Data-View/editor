import { useSelector, useDispatch } from 'react-redux';
import HeaderRight from './HeadRight';
import { HeaderStyled } from './style';
import { Button, Tooltip } from '@mui/material';
import HeadMenu from './HeadMenu';
import { editorAction } from 'store/features/editorSlice';
import { selectEditorPanel, selectApp } from 'store/selectors';
import ListAltIcon from '@mui/icons-material/ListAlt';
import DashboardIcon from '@mui/icons-material/Dashboard';
const Header: React.FC = () => {
  const panel = useSelector(selectEditorPanel);
  const { name } = useSelector(selectApp);
  const dispatch = useDispatch();
  const activeColor = panel ? 'primary' : 'secondary';

  return (
    <HeaderStyled>
      <div className="head-left">
        <div className="actions">
          <div className="pannle-action">
            <Tooltip title="图层" placement="bottom">
              <Button color={activeColor} onClick={() => dispatch(editorAction.togglePanel('compList'))}>
                <ListAltIcon color={activeColor} />
              </Button>
            </Tooltip>
            <Tooltip title="组件配置" placement="bottom">
              <Button color={activeColor} onClick={() => dispatch(editorAction.togglePanel('compProps'))}>
                <DashboardIcon color={activeColor} />
              </Button>
            </Tooltip>
          </div>
        </div>
        <HeadMenu />
      </div>
      <div className="page-title">
        <strong>{name}</strong>
      </div>
      <HeaderRight />
    </HeaderStyled>
  );
};

export default Header;
