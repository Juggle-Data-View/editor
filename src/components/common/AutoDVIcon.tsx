/**
 * AutoDV Icon 组件.
 * 补全`blueprint`中没有的`Icon`图标
 * 注意事项：
 * 1. iconfont url依赖`longchan`在`iconfont.cn`的账号生成
 * 2. 使用`autoDV-`开头的命名规则
 */
import React from 'react';
import { Icon, IconName, IconProps } from '@blueprintjs/core';
import styled from 'styled-components';

/**
 * 插入 iconfont 生成的js文件，项目文件找`LongChan`
 */
export const injectCDNScript = () => {
  // iconfont url，链接来自 longchan 的 iconfont 账号
  const ICONFONT_URL = '//at.alicdn.com/t/font_1317889_mad5fp4e2q.js';
  const oScript = document.createElement('script');
  oScript.src = ICONFONT_URL;
  oScript.async = true; // 没有依赖关系
  document.body.appendChild(oScript);
};

export const isAutoDVIcon = (iconName: string) => {
  return (iconName as string).search(/^autoDV/) !== -1;
};

// 使用`autoDV-`开头的命名规则
export type AutoDVIconName =
  | IconName
  | 'autoDV-save'
  | 'autoDV-shangyi'
  | 'autoDV-zhiding'
  | 'autoDV-undo'
  | 'autoDV-resize'
  | 'autoDV-fenzu'
  | 'autoDV-publish'
  | 'autoDV-scale'
  | 'autoDV-text'
  | 'autoDV-normal'
  | 'autoDV-flip-horizontal'
  | 'autoDV-flip-vertical'
  | 'autoDV-Exitfullscreen'
  | 'autoDV-to-left'
  | 'autoDV-to-top';

export interface IAutoDVIconProps extends Omit<IconProps, 'icon'> {
  icon: AutoDVIconName;
  flipX?: boolean;
  flipY?: boolean;
  size?: number;
  className?: string;
  color?: string;
}

const AutoDVIcon: React.FC<IAutoDVIconProps> = (props) => {
  const { icon, flipX, flipY, size, className, color } = props;
  const _size = size || '1em';

  if (isAutoDVIcon(icon)) {
    return (
      <span
        className={['bp3-icon', className].join(' ')}
        style={{
          transform: `scale(${flipX ? -1 : 1}, ${flipY ? -1 : 1})`,
        }}
      >
        <svg fill={color || 'currentColor'} width={_size} height={_size}>
          <use xlinkHref={`#${icon}`} />
        </svg>
      </span>
    );
  }

  return <Icon icon={icon as IconName} iconSize={+_size} />;
};

export default AutoDVIcon;

/** ↓↓↓↓↓↓↓↓↓↓ LoadingIcon ↓↓↓↓↓↓↓↓↓↓ */

interface LoadingIconProp extends Omit<IconProps, 'icon'> {
  duration?: number; // 动画持续时间，单位：秒
}

const LoadingStyled = styled(Icon)<LoadingIconProp>`
  svg {
    animation: ${(props) => `svgSpin ${props.duration}s linear infinite`};
  }
  @keyframes svgSpin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
`;

export const LoadingIcon: React.FC<LoadingIconProp> = (props) => {
  return <LoadingStyled duration={3} {...props} icon="refresh" />;
};
