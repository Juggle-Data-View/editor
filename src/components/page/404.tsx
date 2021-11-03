import React from 'react';
import styled from 'styled-components';

const Container = styled.div`
  background-color: #1f2127;
  height: 100%;
  text-align: center;
  overflow: hidden;
  > img {
    margin-top: 100px;
  }
  > p {
    font-size: 20px;
    color: rgba(255, 255, 255, 0.35);
  }
`;

export default function NotFound() {
  return (
    <Container>
      <p>当前页面未找到，请检查页面链接！</p>
    </Container>
  );
}
