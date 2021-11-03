/**
 * 对齐方式组件
 */

import * as React from 'react';
import { useDispatch } from 'react-redux';
import styled from 'styled-components';
import { Button, Tooltip, Position, IconName } from '@blueprintjs/core';
import { appAction } from 'store/features/appSlice';

const AlignmentWrap = styled.div`
  text-align: center;
`;

const MiniButton: React.FC<{
  icon: IconName;
  align: AutoDV.AlignType;
  tooltip: string;
}> = (props) => {
  const { icon, align, tooltip } = props;
  const dispatch = useDispatch();
  return (
    <Tooltip content={tooltip} position={Position.BOTTOM}>
      <Button
        onClick={() => {
          dispatch(appAction.setCompAlignment({ alignType: align }));
        }}
        icon={icon}
        minimal={true}
      />
    </Tooltip>
  );
};

const Alignment: React.FC = () => {
  return (
    <AlignmentWrap>
      <MiniButton icon="alignment-left" tooltip="左对齐" align="left" />
      <MiniButton icon="alignment-vertical-center" tooltip="水平居中" align="horizontalCenter" />
      <MiniButton icon="alignment-right" tooltip="右对齐" align="right" />
      <MiniButton icon="alignment-top" tooltip="顶部对齐" align="top" />
      <MiniButton icon="alignment-horizontal-center" tooltip="垂直居中" align="verticalCenter" />
      <MiniButton icon="alignment-bottom" tooltip="底部对齐" align="bottom" />
    </AlignmentWrap>
  );
};

export default Alignment;
