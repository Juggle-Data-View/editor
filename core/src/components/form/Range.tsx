import { useState, useEffect, useCallback } from 'react';
import styled from 'styled-components';
import { validator } from './fieldValidator';
import numeral from 'numeral';
import { withField } from './withField';
import isFinite from 'lodash/isFinite';
import { Slider, TextField, SliderProps, InputProps } from '@mui/material';

const Container = styled.div<{ hasError: boolean }>`
  display: flex;
  align-items: center;
  width: 100%;
  .slider-wrap {
    flex: 1.5;
    overflow: ${(props) => (props.hasError ? 'hidden' : 'initial')};
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
  range: [number, number];
  sliderProps?: Omit<Partial<SliderProps>, 'value' | 'onChange' | 'onRelease' | 'min' | 'max'>;
  inputProps?: InputProps;
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

    const submit = useCallback(
      (value: number = slideValue) => {
        form.setFieldValue(field.name, value);
        form.setFieldTouched(field.name, true);
      },
      [slideValue, form, field.name]
    );

    useEffect(() => {
      submit();
    }, [submit]);

    const err = !!(meta.touched && meta.error);

    return (
      <>
        <Container hasError={err}>
          <div className="slider-wrap">
            <Slider
              {...sliderProps}
              min={range[0]}
              max={range[1]}
              step={sliderProps ? sliderProps.step : 1}
              value={field.value}
              onChange={(event, val) => {
                const value = Number(numeral(val).format(format));
                setSlideValue(value);
              }}
            />
          </div>
          <div className="gap" />
          <div className="input-wrap">
            <TextField
              inputProps={{
                ...(inputProps as any),
                min: range[0],
                max: range[1],
                step: sliderProps ? sliderProps.step : 1,
              }}
              type="number"
              size="small"
              style={{ textAlign: 'center' }}
              value={slideValue}
              onChange={(e) => {
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
      validate: (val: any) => {
        if (!isFinite(val)) return undefined;
        if (props.range) return validator.range(props.range)(val);
        return undefined;
      },
    };
  }
);
