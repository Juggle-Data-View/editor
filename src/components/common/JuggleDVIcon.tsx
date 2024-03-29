import styled from 'styled-components';
import SvgIcon, { SvgIconProps } from '@mui/material/SvgIcon';
import RefreshIcon from '@mui/icons-material/Refresh';
export const injectCDNScript = () => {
  const ICONFONT_URL = '//at.alicdn.com/t/font_1781874_8luu239vdrs.js';
  const oScript = document.createElement('script');
  oScript.src = ICONFONT_URL;
  oScript.async = true; // 没有依赖关系
  document.body.appendChild(oScript);
};

// export const isJuggleDVIcon = (iconName: string) => {
//   return (iconName as string).search(/^autoDV/) !== -1;
// };

// 使用`autoDV-`开头的命名规则
export type JuggleDVIconName =
  | 'autoDV-save'
  | 'autoDV-up'
  | 'autoDV-down'
  | 'autoDV-bottom'
  | 'autoDV-top'
  | 'autoDV-undo'
  | 'autoDV-native'
  | 'autoDV-fenzu'
  | 'autoDV-publish'
  | 'autoDV-suitable'
  | 'autoDV-text'
  | 'autoDV-normal'
  | 'autoDV-flip-horizontal'
  | 'autoDV-flip-vertical'
  | 'autoDV-Exitfullscreen'
  | 'autoDV-to-left'
  | 'autoDV-to-top'
  | 'autoDV-table'
  | 'autoDV-API'
  | 'autoDV-SQL'
  | 'autoDV-offline';

export interface IJuggleDVIconProps extends Omit<SvgIconProps, 'icon'> {
  icon: JuggleDVIconName;
  flipX?: boolean;
  flipY?: boolean;
  size?: number;
  className?: string;
}

const JuggleDVIcon: React.FC<IJuggleDVIconProps> = (props) => {
  const { icon, flipX, flipY, size, className, color } = props;
  const _size = size || '1em';

  return (
    <SvgIcon
      style={{
        transform: `scale(${flipX ? -1 : 1}, ${flipY ? -1 : 1})`,
      }}
      className={className}
      fill={color || 'currentColor'}
      width={_size}
      height={_size}
    >
      <use xlinkHref={`#icon${icon}`} />
    </SvgIcon>
  );
};

export default JuggleDVIcon;

interface LoadingIconProp extends SvgIconProps {
  duration?: number; // 动画持续时间，单位：秒
}

const LoadingStyled = styled(RefreshIcon)<LoadingIconProp>`
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
  return <LoadingStyled duration={3} {...props} />;
};
