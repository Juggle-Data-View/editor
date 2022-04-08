/**
 * 对齐方式组件
 */

import * as React from 'react';
import { JuggleDV } from '@juggle-data-view/types';
import { useDispatch } from 'react-redux';
import styled from 'styled-components';
import { appAction } from 'store/features/appSlice';
import AlignHorizontalLeftIcon from '@mui/icons-material/AlignHorizontalLeft';
import AlignHorizontalRightIcon from '@mui/icons-material/AlignHorizontalRight';
import AlignVerticalTopIcon from '@mui/icons-material/AlignVerticalTop';
import AlignVerticalBottomIcon from '@mui/icons-material/AlignVerticalBottom';
import AlignHorizontalCenterIcon from '@mui/icons-material/AlignHorizontalCenter';
import AlignVerticalCenterIcon from '@mui/icons-material/AlignVerticalCenter';
import { IconButton, Tooltip } from '@mui/material';

const AlignmentWrap = styled.div`
  display: flex;
  justify-content: space-evenly;
  padding: 0px 20px;
`;

const MiniButton: React.FC<{
  align: JuggleDV.AlignType;
  tooltip: string;
}> = (props) => {
  const { align, tooltip } = props;
  const dispatch = useDispatch();
  const getIcon = () => {
    switch (align) {
      case 'left':
        return <AlignHorizontalLeftIcon />;
      case 'right':
        return <AlignHorizontalRightIcon />;
      case 'top':
        return <AlignVerticalTopIcon />;
      case 'bottom':
        return <AlignVerticalBottomIcon />;
      case 'horizontalCenter':
        return <AlignHorizontalCenterIcon />;
      case 'verticalCenter':
        return <AlignVerticalCenterIcon />;
      default:
        return <></>;
    }
  };
  return (
    <IconButton
      onClick={() => {
        dispatch(appAction.setCompAlignment({ alignType: align }));
      }}
    >
      <Tooltip title={tooltip} placement="bottom">
        {getIcon()}
      </Tooltip>
    </IconButton>
  );
};

const Alignment: React.FC = () => {
  return (
    <AlignmentWrap>
      <MiniButton tooltip="左对齐" align="left" />
      <MiniButton tooltip="水平居中" align="horizontalCenter" />
      <MiniButton tooltip="右对齐" align="right" />
      <MiniButton tooltip="顶部对齐" align="top" />
      <MiniButton tooltip="垂直居中" align="verticalCenter" />
      <MiniButton tooltip="底部对齐" align="bottom" />
    </AlignmentWrap>
  );
};

export default Alignment;
