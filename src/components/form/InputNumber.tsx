import React, { useState, useEffect, useRef } from 'react';
import { NumericInput, INumericInputProps, Tag, HTMLInputProps } from '@blueprintjs/core';
import { withField } from './withField';
import { validator, validateMerge } from 'components/form/fieldValidator';
import { debounce, isUndefined } from 'lodash';

import styled from 'styled-components';

export const NumberStyled = styled(NumericInput)`
  .prefix {
    position: absolute;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 24px;
    height: calc(100% - 1px);
    text-align: center;
  }
`;

export interface InputNumberProps {
  bp?: INumericInputProps & HTMLInputProps;
  /** 单位 */
  unit?: string;
  /** 是否为整数 */
  integer?: boolean;
  prefix?: string;
}

const CLICK_DEBOUNCE_MS = 300;

export const InputNumber = withField<InputNumberProps>(
  (props) => {
    const { field, form, unit, bp, prefix } = props;
    const [inputValue, setInputValue] = useState(field.value);
    const meta = form.getFieldMeta(field.name);
    const err = meta.touched && meta.error;
    const intent = err ? 'danger' : 'none';
    const debounceRef = useRef(debounce((name, value) => form.setFieldValue(name, value), CLICK_DEBOUNCE_MS));

    useEffect(() => {
      setInputValue(field.value);
    }, [field.value]);

    return (
      <div>
        <NumberStyled
          leftIcon={prefix ? <span className="prefix">{prefix}</span> : null}
          rightElement={
            unit ? (
              <Tag intent={intent} minimal={true}>
                {unit}
              </Tag>
            ) : undefined
          }
          style={{ width: bp?.fill ? '100%' : 100 }} // 100: 解决边框重渲染时突然增加的 35px 问题
          intent={intent}
          {...bp}
          asyncControl
          value={inputValue}
          name={field.name}
          onButtonClick={(val) => {
            setInputValue(val);
            debounceRef.current(field.name, val);
          }}
          onBlur={(e) => {
            const val = Number(e.currentTarget.value) || 0;
            if (field.value !== val) {
              form.setFieldValue(field.name, val);
            }
          }}
        />
        {err && <div className="error">{meta.error}</div>}
      </div>
    );
  },
  (props) => {
    const _validator: any[] = [];
    if (props.bp) {
      if (!isUndefined(props.bp.min)) {
        _validator.push(validator.min(props.bp.min));
      }
      if (!isUndefined(props.bp.max)) {
        _validator.push(validator.max(props.bp.max));
      }
    }
    if (props.integer) {
      _validator.push(validator.isInteger);
    }
    return {
      validate: validateMerge([props.validate, ..._validator]),
    };
  }
);
