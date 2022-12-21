import PropTypes from 'prop-types';
import { PureComponent } from 'react';
import RulerWrapper from './RulerWrapper';

import { StyledRuler } from './styles';

export default class SketchRuler extends PureComponent {
  handleLineChange = (arr, vertical) => {
    const { horLineArr, verLineArr, handleLine } = this.props;
    const newLines = vertical ? { h: horLineArr, v: [...arr] } : { h: [...arr], v: verLineArr };
    handleLine(newLines);
  };

  render() {
    const {
      width,
      height,
      scale,
      thick,
      shadow,
      startX,
      startY,
      cornerActive,
      cornerExtra,
      horLineArr,
      verLineArr,
      onCornerClick,
      visibleLine,
      ratio,
      palette,
    } = this.props;

    const { bgColor } = palette;

    const { x, y, width: w, height: h } = shadow;

    const canvasConfigs = {
      ratio,
      bgColor: palette.bgColor,
      longfgColor: palette.longfgColor,
      shortfgColor: palette.shortfgColor,
      fontColor: palette.fontColor,
      shadowColor: palette.shadowColor,
      lineColor: palette.lineColor,
      borderColor: palette.borderColor,
      cornerActiveColor: palette.cornerActiveColor,
    };

    const commonProps = {
      scale,
      canvasConfigs: canvasConfigs,
      onLineChange: this.handleLineChange,
      visibleLine,
    };

    return (
      <StyledRuler id="mb-ruler" className="mb-ruler" thick={thick} {...canvasConfigs}>
        {/* 水平方向 */}
        <RulerWrapper
          width={width}
          height={thick}
          start={startX}
          lines={horLineArr}
          selectStart={x}
          selectLength={w}
          {...commonProps}
        />
        {/* 竖直方向 */}
        <RulerWrapper
          width={thick}
          height={height}
          start={startY}
          lines={verLineArr}
          selectStart={y}
          selectLength={h}
          vertical
          {...commonProps}
        />
        {/* eslint-disable-next-line */}
        <a
          className={`corner${cornerActive ? ' active' : ''}`}
          style={{ backgroundColor: bgColor }}
          onClick={onCornerClick}
        >
          {cornerExtra}
        </a>
      </StyledRuler>
    );
  }
}
SketchRuler.propTypes = {
  scale: PropTypes.number,
  ratio: PropTypes.number,
  thick: PropTypes.number,
  width: PropTypes.number,
  height: PropTypes.number,
  startX: PropTypes.number,
  startY: PropTypes.number,
  shadow: PropTypes.object,
  visibleLine: PropTypes.bool,
  horLineArr: PropTypes.array,
  verLineArr: PropTypes.array,
  handleLine: PropTypes.func,
  cornerActive: PropTypes.bool,
  cornerExtra: PropTypes.node || PropTypes.string,
  onCornerClick: PropTypes.func,
  palette: PropTypes.shape({
    bgColor: PropTypes.string,
    longfgColor: PropTypes.string,
    shortfgColor: PropTypes.string,
    fontColor: PropTypes.string,
    shadowColor: PropTypes.string,
    lineColor: PropTypes.string,
    borderColor: PropTypes.string,
    cornerActiveColor: PropTypes.string,
  }),
};
SketchRuler.defaultProps = {
  thick: 16,
  visibleLine: true,
  horLineValue: [100, 200],
  verLineValue: [100, 200],
  scale: 1,
  startX: 0,
  startY: 0,
  ratio: window.devicePixelRatio || 1,
  shadow: {
    x: 200,
    y: 100,
    width: 200,
    height: 400,
  },
  palette: {
    bgColor: 'rgba(225,225,225, 0)', // ruler bg color
    longfgColor: '#BABBBC', // ruler longer mark color
    shortfgColor: '#C8CDD0', // ruler shorter mark color
    fontColor: '#7D8694', // ruler font color
    shadowColor: '#E8E8E8', // ruler shadow color
    lineColor: '#EB5648',
    borderColor: '#DADADC',
    cornerActiveColor: 'rgb(235, 86, 72, 0.6)',
  },
};
