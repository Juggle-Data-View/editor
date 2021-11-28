/**
 * 业务组件 - 预览组件
 * @创建时间 2020-05-14 15:40:36
 */

import styled from 'styled-components';
import { IIndex } from './type';

const IndexStyled = styled.div`
  // 预览组件的样式
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
  position: relative;
  .fragmentContainer {
    height: 100%;
    width: 100%;
    display: block;
  }
  .placeHolder {
    position: absolute;
    top: 0px;
    left: 0px;
  }
`;

const Index: React.FC<IIndex> = ({ compData, isInEditor }) => {
  const { option, placeholder } = compData.config;
  const { html, css } = option;

  const fragmentInsert = () => {
    const htmlContent = `<style>${css}</style>${html}`;
    return {
      __html: htmlContent,
    };
  };

  let placeholderStyle: React.CSSProperties = {};

  if (isInEditor && typeof placeholder !== 'undefined') {
    placeholderStyle = {
      width: placeholder.size,
      height: placeholder.size,
      backgroundColor: placeholder.color,
    };
  }

  return (
    <IndexStyled>
      <div dangerouslySetInnerHTML={fragmentInsert()} className="fragmentContainer" />
      <div className="placeHolder" style={placeholderStyle} />
    </IndexStyled>
  );
};

export default Index;
