/**
 * 渲染组件
 * @author TEMPLATE_AUTHOR
 * @createTime TEMPLATE_CREATED_TIME
 */

import React from 'react';
import { IIndex } from './type';

const Index: React.FC<IIndex> = ({ compData, sourceData, isInEditor }) => {
  const { placeholder, text } = compData.config;
  const { size, color } = placeholder;
  const value = sourceData.getSourceDataValue('value', text.content);

  const placeholderStyle: React.CSSProperties = {
    position: 'absolute',
    left: 0,
    top: 0,
    width: size,
    height: size,
    backgroundColor: color,
  };

  return (
    <div style={text.style}>
      <p>{value}</p>
      {isInEditor ? <div style={placeholderStyle} /> : null}
    </div>
  );
};

export default Index;
