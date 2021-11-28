/**
 * 三个点点的动效
 */

import styled from 'styled-components';

const CompLoaderStyled = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;

  span {
    display: inline-block;
    width: 14px;
    height: 14px;
    margin: 0 5px;
    background: #ccc;
    opacity: 0;
    border-radius: 50%;
    animation: loader-fade 2s infinite;
    &:nth-child(1) {
      animation-delay: 0.3s;
    }
    &:nth-child(2) {
      animation-delay: 0.6s;
    }
    &:nth-child(3) {
      animation-delay: 0.9s;
    }
  }
  @keyframes loader-fade {
    0% {
      opacity: 0;
    }
    50% {
      opacity: 0.8;
    }
    100% {
      opacity: 0;
    }
  }
`;

export default function CompLoader() {
  return (
    <CompLoaderStyled>
      <span />
      <span />
      <span />
    </CompLoaderStyled>
  );
}
