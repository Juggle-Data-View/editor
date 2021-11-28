/**
 * 业务组件 - 预览组件
 * @创建时间 2020-07-23 17:23:04
 */

import { Icon, IconName } from '@blueprintjs/core';
import { IIndex } from './type';
import styled from 'styled-components';

const IndexStyled = styled.div`
  height: 100%;
  // 样式写在这里
  .placeholder {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
  }
`;

const Index: React.FC<IIndex> = ({ compData, sourceData, isInEditor }) => {
  const { attr } = compData;
  const { url, isAuto, isMute, isLoop } = compData.config;

  // 有数据源的数据就用数据源，没有就用配置项的
  const videoUrl = sourceData.getSourceDataValue('url', url);

  const videoStyle: React.CSSProperties = {
    width: '100%',
    height: '100%',
  };

  const Placeholder = ({ icon }: { icon: IconName }) => {
    return isInEditor ? (
      <div className="placeholder">
        <Icon icon={icon} iconSize={Math.min(attr.width, attr.height) * 0.5} />
      </div>
    ) : null;
  };

  return (
    <IndexStyled>
      {videoUrl ? (
        <video key={videoUrl} controls autoPlay={isAuto} loop={isLoop} muted={isMute} style={videoStyle}>
          <source src={videoUrl} type="video/mp4" />
        </video>
      ) : (
        <Placeholder icon="mobile-video" />
      )}
    </IndexStyled>
  );
};

export default Index;
