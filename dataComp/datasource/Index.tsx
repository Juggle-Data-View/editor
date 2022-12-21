/**
 * 业务组件 - 预览组件
 * @创建时间 2020-03-18 13:05:43
 */

import { IIndex } from './type';

const Index = ({ compData, isInEditor }: IIndex) => {
  const { placeholder } = compData.config;
  const { size, color } = placeholder;
  const placeholderStyle: React.CSSProperties = {
    position: 'absolute',
    left: 0,
    top: 0,
    width: size,
    height: size,
    backgroundColor: color,
  };
  return <div>{isInEditor ? <div style={placeholderStyle} /> : null}</div>;
};

export default Index;
