import { useState, useEffect, useRef } from 'react';
import { TextField, Chip, InputBaseComponentProps } from '@mui/material';
import { withField } from './withField';
import { validator, validateMerge } from 'components/form/fieldValidator';
import { debounce, isUndefined } from 'lodash';

import styled from 'styled-components';

export const NumberStyled = styled(TextField)`
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

interface MuiProps extends InputBaseComponentProps {
  placeholder?: string;
}

export interface InputNumberProps {
  muiProps?: MuiProps;
  /** 单位 */
  unit?: string;
  /** 是否为整数 */
  integer?: boolean;
  prefix?: string;
}

const CLICK_DEBOUNCE_MS = 300;

export const InputNumber = withField<InputNumberProps>(
  (props) => {
    const { field, form, unit, muiProps, prefix } = props;
    const [inputValue, setInputValue] = useState(field.value);
    const meta = form.getFieldMeta(field.name);
    const err = meta.touched && meta.error;
    const debounceRef = useRef(debounce((name, value) => form.setFieldValue(name, value), CLICK_DEBOUNCE_MS));

    useEffect(() => {
      setInputValue(field.value);
    }, [field.value]);
    const inputProps = muiProps || {};
    return (
      <div>
        <NumberStyled
          style={{ width: '100%' }} // 100: 解决边框重渲染时突然增加的 35px 问题
          error={!!err}
          value={inputValue}
          name={field.name}
          size="small"
          type="number"
          onChange={(e) => {
            const val = Number(e.currentTarget.value) || 0;
            setInputValue(val);
            debounceRef.current(field.name, val);
          }}
          inputProps={{
            ...inputProps,
            startadornment: prefix ? <span className="prefix">{prefix}</span> : null,
            endadornment: unit ? <Chip label={unit} size="small" /> : undefined,
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
    if (props.muiProps) {
      if (!isUndefined(props.muiProps.min)) {
        _validator.push(validator.min(props.muiProps.min));
      }
      if (!isUndefined(props.muiProps.max)) {
        _validator.push(validator.max(props.muiProps.max));
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
