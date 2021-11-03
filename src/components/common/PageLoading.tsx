/**
 * 京东视界 预加载动画
 */

import React, { useState, useLayoutEffect } from 'react';
import styled from 'styled-components';
import { Spinner } from '@blueprintjs/core';

const Container = styled.div`
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  color: #333;
  text-align: center;
  font-weight: bold;
`;

const AutoDVPreLoader = () => {
  const BASE = 28;
  const [scale, setScale] = useState<number>(1);

  useLayoutEffect(() => {
    const { clientWidth } = document.documentElement;
    const scale = clientWidth / 1920;
    setScale(scale * BASE);
  }, []);

  return (
    <Container style={{ fontSize: scale }}>
      <Spinner size={scale * 4} intent="primary" />
    </Container>
  );
};

export default AutoDVPreLoader;
