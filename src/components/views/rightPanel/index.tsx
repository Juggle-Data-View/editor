import { useDispatch, useSelector } from 'react-redux';
import { RightPanelStyled } from './style';
import { selectAutoDV, selectRightPannelType } from 'store/selectors';

import CompProps from './CompProps';
import GlobalProps from './GlobalProps';
import MultiProps from './MultiProps';
import HistoryList from './HistoryList';
import { useCallback, useEffect, useLayoutEffect, useState } from 'react';
import { editorAction } from 'store/features/editorSlice';

const RightPanel: React.FC = () => {
  const { selectedCompCodes, compDatas } = useSelector(selectAutoDV);
  const rightPannelType = useSelector(selectRightPannelType);
  const dispatch = useDispatch();
  const [isVisible, setVisible] = useState(false);
  const changeVisible = useCallback(() => {
    setVisible(rightPannelType !== 'hidden');
  }, [rightPannelType]);

  const getRightPannelType = useCallback(
    (codes: string[]): AutoDV.Editor['rightPannelType'] => {
      const len = codes.length;
      if (len > 1) {
        return 'multiple-select';
      }
      if (len === 1 && compDatas[selectedCompCodes[0]].compCode === 'group') {
        return 'group';
      }
      if (len === 1) {
        return 'component';
      }
      return 'hidden';
    },
    [selectedCompCodes, compDatas]
  );

  useEffect(() => {
    dispatch(editorAction.setRightPannelType(getRightPannelType(selectedCompCodes)));
  }, [getRightPannelType, dispatch, selectedCompCodes]);

  useLayoutEffect(() => {
    changeVisible();
  }, [changeVisible]);

  return (
    <RightPanelStyled onTransitionEnd={changeVisible} visible={isVisible}>
      <HistoryList />
      <div className="panel-form">
        {rightPannelType === 'global' ? <GlobalProps /> : null}
        {rightPannelType === 'component' && compDatas[selectedCompCodes[0]] ? (
          <CompProps compData={compDatas[selectedCompCodes[0]]} />
        ) : null}
        {rightPannelType === 'multiple-select' ? <MultiProps /> : null}
      </div>
    </RightPanelStyled>
  );
};

export default RightPanel;
