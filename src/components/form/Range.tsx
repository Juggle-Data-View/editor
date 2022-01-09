/**
 * 范围选择组件，输入某个范围，选取一个数字值
 */

import { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Slider, NumericInput, ISliderProps, INumericInputProps, HTMLInputProps } from '@blueprintjs/core';
import { validator } from './fieldValidator';
import numeral from 'numeral';
import { withField } from './withField';
import isFinite from 'lodash/isFinite';

const Container = styled.div<{ hasError: boolean }>`
  display: flex;
  align-items: center;
  width: 100%;
  .slider-wrap {
    flex: 1.5;
    overflow: ${(props) => (props.hasError ? 'hidden' : 'initial')};
    .bp3-slider {
      min-width: auto;
    }
  }
  .gap {
    width: 15px;
    flex: none;
  }
  .input-wrap {
    flex: 1;
  }
`;

interface IRange {
  /** [必填项] 滑块区间范围 */
  range: [number, number];
  sliderProps?: Omit<ISliderProps, 'value' | 'onChange' | 'onRelease' | 'min' | 'max'>;
  inputProps?: INumericInputProps & HTMLInputProps;
  format?: string; // 格式化小数点
}

export const Range = withField<IRange>(
  (props) => {
    const { field, form, range, sliderProps, inputProps, format = '0.[00]' } = props;
    const meta = form.getFieldMeta(field.name);
    const [slideValue, setSlideValue] = useState(field.value || 1);

    if (typeof range === 'undefined') {
      throw new Error('组件缺少range属性');
    }

    useEffect(() => {
      // 使数值始终保持在范围区间内
      const val = Math.min(Math.max(field.value, range[0]), range[1]);
      setSlideValue(!isFinite(val) ? 1 : val);
    }, [field.value, range]);

    const submit = (value: number) => {
      form.setFieldValue(field.name, value);
      form.setFieldTouched(field.name, true);
    };

    const err = !!(meta.touched && meta.error);

    return (
      <>
        <Container hasError={err}>
          <div className="slider-wrap">
            <Slider
              labelRenderer={false}
              {...sliderProps}
              min={range[0]}
              max={range[1]}
              intent={err ? 'danger' : 'none'}
              value={slideValue}
              onChange={(val) => {
                // FixBug: 滑动时会出现 0.30000002，所以引入 numeral 格式化
                const value = Number(numeral(val).format(format));
                setSlideValue(value);
              }}
              onRelease={submit}
            />
          </div>
          <div className="gap" />
          <div className="input-wrap">
            <NumericInput
              fill={true}
              intent={err ? 'danger' : 'none'}
              buttonPosition="none"
              min={range[0]}
              max={range[1]}
              stepSize={sliderProps ? sliderProps.stepSize : 1}
              majorStepSize={null}
              minorStepSize={null}
              style={{ textAlign: 'center' }}
              {...inputProps}
              asyncControl={true}
              value={slideValue}
              onBlur={(e) => {
                const _value = Number(e.currentTarget.value);
                if (field.value !== _value) {
                  submit(_value);
                }
              }}
            />
          </div>
        </Container>
        {err && <p className="error">{meta.error}</p>}
      </>
    );
  },
  (props) => {
    return {
      // 给 range 组件增加一个范围校验
      validate: (val: any) => {
        if (!isFinite(val)) return undefined; // 解决出现NaN时第一次验证失败的问题
        if (props.range) return validator.range(props.range)(val);
        return undefined;
      },
    };
  }
);
