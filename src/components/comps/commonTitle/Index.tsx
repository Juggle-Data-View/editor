/**
 * 业务组件 - 预览组件
 * @创建时间 2020-03-18 13:05:43
 */

import React from 'react';
import { IIndex } from './type';

const Index = ({ compData, sourceData }: IIndex) => {
  const { style, title, link } = compData.config;
  const value = sourceData.getSourceDataValue('value', title);

  const Text = () => {
    if (link.url) {
      return (
        <a href={link.url} target={link.isBlank ? '_blank' : '_self'} rel="noreferrer">
          {value}
        </a>
      );
    }
    return value;
  };

  // 兼容版本
  if (style.display === 'flex') {
    return (
      <div
        style={{
          display: 'flex',
          width: '100%',
          height: '100%',
          wordBreak: 'break-all',
          ...style,
        }}
      >
        <Text />
      </div>
    );
  }

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        wordBreak: 'break-all',
        ...style,
      }}
    >
      <Text />
    </div>
  );
};

export default Index;
