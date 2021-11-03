import React, { useEffect } from 'react';
import { Colors } from '@blueprintjs/core';
import styled from 'styled-components';
import socket from 'socket.io-client';

/**
 * 1. 大屏自带ws属性，创建ws连接
 * 2. 大屏不自带ws属性，组件是否包含 时间器 组件，如果包含，创建ws连接
 *
 * 时间器组件逻辑
 */

export const io = socket(`ws://11.80.13.143:2008?appId=988&type=edit`, {
  transports: ['websocket'],
});

io.on('connect', () => {
  console.log('websocket 建立连接');
});

io.on('disconnect', () => {
  console.log('websocket 连接断开');
});

const Container = styled.div`
  background: ${Colors.DARK_GRAY3};
  height: 100%;
  overflow: hidden;
  .info {
    width: 500px;
    margin: 50px auto 0 auto;
    line-height: 1.5;
    h2 {
      font-size: 36px;
    }
    p {
      font-size: 18px;
    }
  }
`;

const TestWebSocket = () => {
  useEffect(() => {
    io.on('date_98970e', (data: any) => {
      console.log(data);
    });
  }, []);
  return (
    <Container>
      <h1>TestWebSocket</h1>
    </Container>
  );
};

export default TestWebSocket;
