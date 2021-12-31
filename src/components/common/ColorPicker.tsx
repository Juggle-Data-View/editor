/**
 * 颜色（含渐变色）拾取组件
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { SketchPicker } from 'react-color';
import styled from 'styled-components';
import { Position, Switch } from '@blueprintjs/core';
import { Popover2 } from '@blueprintjs/popover2';
import tinycolor from 'tinycolor2';
import { GradientPicker, AnglePicker } from 'react-linear-gradient-picker';
import { getGradientCSS } from 'utils/index';

const Container = styled.div`
  display: flex;
  align-items: center;
  min-height: 30px;
  .trigger {
    padding: 2px;
    background-color: white;
    box-shadow: rgba(0, 0, 0, 0.1) 0 0 0 1px;
    cursor: pointer;
    > span {
      display: block;
      width: 40px;
      height: 18px;
      background-color: black;
    }
  }
  .picker {
    border-radius: 3px;
    padding: 7px;
    background-color: #fff;
    .picker-head {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 2px;
      .gradient {
        transform: scale(0.85);
        transform-origin: left 0;
      }
      .tips {
        transform: scale(0.85);
        transform-origin: right 0;
      }
      .bp3-switch {
        margin: 0 -10px 0 5px !important;
        padding-right: 0 !important;
      }
    }
    .sketch-picker {
      margin: 0 auto;
      padding: 0 0 0 !important;
      box-shadow: none !important;
      transform: none !important;
    }
  }
  .palette svg {
    vertical-align: top;
  }
  .csh {
    margin-bottom: 5px;
  }
  .picker-foot {
    margin: 0 -10px;
    padding: 10px 10px 0;
    height: 44px;
    border-top: 1px solid rgb(238, 238, 238);
    display: flex;
    justify-content: flex-start;
    align-items: center;
    position: relative;
    .types {
      display: flex;
      margin-right: 0;
      > div {
        margin-right: 3px;
        width: 32px;
        height: 32px;
        border-radius: 50%;
        box-shadow: inset 0 0 0 1px #fff;
        overflow: hidden;
        cursor: pointer;
        &.linear {
          background: linear-gradient(to right, black, white);
        }
        &.radial {
          background: radial-gradient(black, white);
        }
        &.--active {
        }
      }
    }
    .angle-inputs {
      border-radius: 4px;
      background: #f2f2f2;
      display: flex;
      flex: 1;
      margin: 0 0 0 10px;
      justify-content: space-around;
      align-items: center;
      input {
        border: none;
        text-align: center;
        width: 48px;
        color: #0c0c09;
        background: inherit;
      }
      span {
        padding: 5px;
        cursor: pointer;
        user-select: none;
      }
    }
  }
`;

export interface IColorPicker {
  value: string | AutoDV.ColorResult;
  onChange: (color: any) => void;
  useGradient?: boolean; // 是否使用渐变色，默认不使用
}

const PickerWidth = 200;

const WrappedSketchPicker = ({ onSelect, ...rest }: any) => {
  return (
    <SketchPicker
      {...rest}
      width={PickerWidth + 'px'}
      className="sketch-picker"
      color={rest.color}
      presetColors={[]}
      onChange={({ rgb }) => {
        const { r, g, b, a } = rgb;
        onSelect(`rgb(${r}, ${g}, ${b})`, a);
      }}
    />
  );
};

const default_gradient: AutoDV.ColorResult = {
  type: 'linear',
  colorStops: [
    { offset: 0, color: 'rgb(238, 241, 11)' },
    { offset: 1, color: 'rgb(126, 32, 207)' },
  ],
  angle: 90,
};

export default function ColorPicker({ value, onChange, useGradient }: IColorPicker) {
  const [isOpen, setIsOpen] = useState(false);
  const [colorType, setColorType] = useState<'solid' | 'gradient'>('solid'); // 纯色 or 渐变色选项状态
  const [solidColor, setSolidColor] = useState('black'); // 纯色色值状态
  const [gradientColor, setGradientColor] = useState<AutoDV.ColorResult>(default_gradient); // 渐变色状态
  const prevColor = useRef<string | AutoDV.ColorResult>();
  const debounceRef = useRef<any>(-1);

  const setPalette = (_palette: AutoDV.ColorStop[]) => {
    setGradientColor({
      ...gradientColor,
      colorStops: _palette.map(({ offset, color, opacity: a }) => {
        const tc = tinycolor(color);
        return {
          offset: Number(offset), // 渐变色调色盘返回的是字符串类型
          // 没有 a 或者 a等于1 时，表示纯色
          color: !a || a === 1 ? tc.toHexString() : tc.setAlpha(a).toRgbString(),
        };
      }),
    });
  };

  const setAngle = (_angle: number) => {
    setGradientColor({
      ...gradientColor,
      angle: _angle,
    });
  };

  const setGradientType = (_gradientType: AutoDV.ColorResult['type']) => {
    setGradientColor({
      ...gradientColor,
      type: _gradientType,
    });
  };

  const gradientProps = {
    paletteHeight: 10,
    palette: gradientColor.colorStops,
    onPaletteChange: setPalette,
    maxStops: 10, // 最大个数，暂定10个
    width: PickerWidth,
  };

  const onAngleInputChange = (angle: number) => {
    angle = angle > 360 ? angle - 360 : angle;
    angle = angle < 0 ? angle + 360 : angle;
    setAngle(angle);
  };

  // 根据传入的value，设置内部初始状态
  useEffect(() => {
    if (typeof value === 'string') {
      setSolidColor(value);
      setColorType('solid');
    } else {
      setGradientColor(value);
      setColorType('gradient');
    }
  }, [value]);

  // mounted
  useEffect(() => {
    const handleClick = () => {
      setIsOpen(false);
    };
    document.addEventListener('click', handleClick);
    return () => {
      document.removeEventListener('click', handleClick);
    };
  }, []);

  // 判断组件内部 solidColor、gradientColor 是否与 props.value 一致
  // 如果不一致，说明有改动，需要触发 onChange
  const isValueChange = useCallback(() => {
    let isChange = false;
    const _value = colorType === 'solid' ? solidColor : gradientColor;
    if (typeof _value === 'string') {
      isChange = !!(value !== _value);
    } else {
      isChange = !!(JSON.stringify(value) !== JSON.stringify(_value));
    }
    return { isChange, currValue: _value };
  }, [colorType, gradientColor, solidColor, value]);

  useEffect(() => {
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      const { isChange, currValue } = isValueChange();
      if (isChange) {
        // 单色拾取器获取的颜色始终为rgba，这里为了节约字节，转为hex
        onChange(currValue);
      }
    }, 300);
  }, [isValueChange, onChange]);

  return (
    <Container>
      <Popover2
        isOpen={isOpen}
        usePortal={false}
        position={Position.BOTTOM_LEFT}
        modifiers={{ arrow: { enabled: false } }}
        targetTagName="div"
        minimal
      >
        <div
          className="trigger"
          onClick={(e) => {
            e.stopPropagation();
            setIsOpen(!isOpen);
            prevColor.current = value;
          }}
        >
          <span style={{ background: colorType === 'solid' ? solidColor : getGradientCSS(gradientColor) }} />
        </div>
        <div className="picker" onClick={(e) => e.stopPropagation()}>
          {useGradient ? (
            <div className="picker-head">
              <div className="gradient">
                渐变色
                <Switch
                  inline
                  checked={colorType === 'gradient'}
                  onChange={() => setColorType(colorType === 'solid' ? 'gradient' : 'solid')}
                />
              </div>
              <div className="tips" title="help tips" />
            </div>
          ) : null}
          {colorType === 'solid' ? (
            <SketchPicker
              width={PickerWidth + 'px'}
              className="sketch-picker"
              color={solidColor}
              onChange={({ rgb, hex }) => {
                const { r, g, b, a } = rgb;
                const color = a === 1 ? hex : `rgba(${[r, g, b, a].join(',')})`;
                setSolidColor(color);
              }}
            />
          ) : (
            <>
              <GradientPicker {...gradientProps}>
                <WrappedSketchPicker />
              </GradientPicker>
              <div className="picker-foot">
                <div className="types">
                  {['linear', 'radial'].map((gradient) => {
                    return (
                      <div
                        key={gradient}
                        className={[gradient, gradientColor.type === gradient ? '--active' : ''].join(' ')}
                        onClick={() => setGradientType(gradient as any)}
                      />
                    );
                  })}
                </div>
                {gradientColor.type === 'linear' ? (
                  <>
                    <AnglePicker angle={gradientColor.angle} setAngle={setAngle} size={32} />
                    <div className="angle-inputs">
                      <span onClick={() => onAngleInputChange(gradientColor.angle - 1)}>&#8722;</span>
                      <input value={`${gradientColor.angle}°`} disabled />
                      <span onClick={() => onAngleInputChange(gradientColor.angle + 1)}>&#43;</span>
                    </div>
                  </>
                ) : null}
              </div>
            </>
          )}
        </div>
      </Popover2>
    </Container>
  );
}
