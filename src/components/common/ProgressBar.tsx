/**
 * 进度条组件.
 * 使用`mask-image + mask-size + inline SVG`开发，可能会有低版本兼容问题。
 */

import React from 'react';
import styled from 'styled-components';

const Container = styled.div`
  height: 100%;
  .progress {
    background: white;
    position: relative;
    height: 100%;
  }
  .percent {
    background: #00aaff;
    position: absolute;
    height: 100%;
    transition: width 0.5s ease;
  }
`;

export interface IProps {
  /** 柱条百分比, 值为[0-100] */
  percent: number;
  /** 填充色,如果`percentStyle`中设置了背景色，可忽略这个属性 */
  fillColor?: string | string[];
  /** 片段数量 */
  segments?: number;
  /**
   * 片段间隔，单位可以为 px | %
   * 当值为px单位时，如果整个进度条长度过短，会出现
   * 进度条消失问题，此时可以使用百分比单位。
   */
  spacing?: string;
  /** 片段圆角 */
  radius?: number;
  /** 底部颜色 */
  backColor?: string;
  /** 柱条样式，可以做更高级的设置，会覆盖fillColor */
  percentStyle?: React.CSSProperties;
}

// 100% / 2 => 50%
const halfString = (str: string) => {
  const res: any = /^(\d+)\s*(\D+)/.exec(str);
  if (Array.isArray(res)) {
    const [, num, unit] = res;
    if (unit === 'px' || unit === '%') {
      return Number(num) / 2 + unit;
    }
  }
  return 0;
};

const ProgressBar: React.FC<IProps> = (props) => {
  const { percent, backColor = 'none', segments = 1, spacing = '0px', radius = 0, fillColor = '#f00' } = props;
  const percentBackground = Array.isArray(fillColor) ? `linear-gradient(90deg, ${fillColor.join(',')})` : fillColor;

  return (
    <Container>
      <div
        className="progress"
        style={{
          WebkitMaskImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg"><rect x="${halfString(
            spacing
          )}" y="0" height="100%" rx="${radius}px" ry="${radius}px" style="width:calc(100% - ${spacing})"/></svg>')`,
          WebkitMaskSize: `${100 / segments}% 100%`,
          background: backColor,
        }}
      >
        <div
          className="percent"
          style={{
            background: percentBackground,
            ...props.percentStyle,
            width: `${percent}%`,
          }}
        />
      </div>
    </Container>
  );
};

export default ProgressBar;
