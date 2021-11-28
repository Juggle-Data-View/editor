/**
 * RightSide - 右侧面板
 */

import { useSelector } from 'react-redux';
import { RightPanelStyled } from './style';
import { selectAutoDV, selectEditorPanel } from 'store/selectors';

import CompProps from './CompProps';
import GlobalProps from './GlobalProps';
import MultiProps from './MultiProps';
import HistoryList from './HistoryList';

const RightPanel: React.FC = () => {
  const { selectedCompCodes, compDatas } = useSelector(selectAutoDV);
  const panel = useSelector(selectEditorPanel);
  const len = selectedCompCodes.length;

  /**
   * @description Resolve group sub-components don't move when user input group coordinate
   */
  const isRenderMultiProps = (() => {
    if (len > 1 || (len === 1 && compDatas[selectedCompCodes[0]].compCode === 'group')) {
      return true;
    }
    return false;
  })();

  /**
   * @description Don't render component‘s attr when select signal component
   */
  const isRenderCompProps = (() => {
    if (len === 1 && compDatas[selectedCompCodes[0]].compCode !== 'group') {
      return true;
    }
    return false;
  })();

  return (
    <RightPanelStyled visible={panel.compProps}>
      <HistoryList />
      <div className="panel-form">
        {len === 0 ? <GlobalProps /> : null}
        {isRenderCompProps ? <CompProps compData={compDatas[selectedCompCodes[0]]} /> : null}
        {isRenderMultiProps ? <MultiProps /> : null}
      </div>
    </RightPanelStyled>
  );
};

export default RightPanel;
