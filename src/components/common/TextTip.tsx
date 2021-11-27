/**
 * 文本提示组件
 */

import React from 'react';
import Tooltip from '@mui/material/Tooltip';
import Help from '@mui/icons-material/Help';
export interface ITextTip {
  text: JSX.Element | string;
  tipWidth?: React.CSSProperties['width'];
}

const TextTip: React.FC<ITextTip> = ({ text, tipWidth }) => {
  return (
    <Tooltip
      title={typeof text === 'string' ? <div style={{ maxWidth: 200, width: tipWidth }}>{text}</div> : text}
      placement="right-start"
    >
      <Help fontSize="small" />
    </Tooltip>
  );
};

export default TextTip;
