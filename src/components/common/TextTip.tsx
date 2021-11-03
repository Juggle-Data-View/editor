/**
 * 文本提示组件
 */

import React from 'react';
import { Position, Tooltip, Icon } from '@blueprintjs/core';

export interface ITextTip {
  text: JSX.Element | string;
  tipWidth?: React.CSSProperties['width'];
}

const TextTip: React.FC<ITextTip> = ({ text, tipWidth }) => {
  return (
    <Tooltip
      content={typeof text === 'string' ? <div style={{ maxWidth: 200, width: tipWidth }}>{text}</div> : text}
      position={Position.RIGHT_TOP}
    >
      <Icon style={{ verticalAlign: 'middle', margin: '-1px 0 0 3px' }} icon="help" iconSize={12} />
    </Tooltip>
  );
};

export default TextTip;
