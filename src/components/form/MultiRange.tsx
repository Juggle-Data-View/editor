import React, { useState, useEffect } from 'react';
import {
  RangeSlider as Slider,
  NumericInput,
  IRangeSliderProps,
  Icon,
  INumericInputProps,
  HTMLInputProps,
} from '@blueprintjs/core';
import { withField } from './withField';

export interface IMultiRange {
  /**
   * 滑块属性，如果不传入，将使用 inputNumber 控件
   */
  sliderProps?: Omit<IRangeSliderProps, 'value' | 'onChange' | 'onRelease'>;
  inputProps?: INumericInputProps;
}

export const MultiRange = withField<IMultiRange>((props) => {
  const { field, form, sliderProps, inputProps } = props;
  const [slideValue, setSlideValue] = useState<[number, number]>([0, 10]);

  useEffect(() => {
    setSlideValue(field.value);
  }, [field.value]);

  const setValue = (newValue: any) => {
    form.setFieldValue(field.name, newValue);
    form.setFieldTouched(field.name, true);
  };

  const mapProps = (index: 0 | 1): INumericInputProps & HTMLInputProps => {
    return {
      fill: true,
      placeholder: index === 0 ? 'From' : 'To',
      style: {
        textAlign: 'center',
      },
      ...inputProps,
      asyncControl: true,
      name: field.name,
      value: field.value[index],
      onButtonClick: (val) => {
        field.value[index] = val;
        setValue(field.value);
      },
      onBlur: (e: React.FormEvent<HTMLInputElement>) => {
        const val = Number(e.currentTarget.value);
        if (field.value[index] !== val) {
          field.value[index] = val;
          setValue(field.value);
        }
      },
    };
  };

  return sliderProps ? (
    <Slider
      {...sliderProps}
      value={slideValue}
      onChange={(val) => {
        setSlideValue(val);
      }}
      onRelease={setValue}
    />
  ) : (
    <div style={{ display: 'flex', alignItems: 'center' }}>
      <NumericInput {...mapProps(0)} />
      <Icon style={{ margin: '0 10px' }} icon="small-minus" />
      <NumericInput {...mapProps(1)} />
    </div>
  );
});
