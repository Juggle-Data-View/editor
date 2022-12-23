import React, { useState, useEffect } from 'react';
import { TextField, TextareaAutosize, TextareaAutosizeProps, InputBaseComponentProps } from '@mui/material';
import { withField } from './withField';
import styled from 'styled-components';

const ErrorStyled = styled.p`
  margin-top: 3px;
  line-height: 1.25;
  color: ${({ theme }) => {
    return theme.palette.error.main;
  }};
`;

export interface IText<T> {
  muiProps?: T & TextareaAutosizeProps & InputBaseComponentProps;
  useMeta?: boolean;
}

function withInput<T = TextareaAutosizeProps & InputBaseComponentProps>(
  Comp: React.FC<React.PropsWithChildren<T>>,
  type: 'text' | 'textarea'
) {
  return withField<React.PropsWithChildren<IText<T>>>((props) => {
    const { muiProps, useMeta = true, field, form } = props;
    const meta = form.getFieldMeta(field.name);
    const [inputValue, setInputValue] = useState(field.value);
    const err = meta.touched && meta.error;

    useEffect(() => {
      setInputValue(field.value);
    }, [field.value]);

    const compProps: any = {
      ...muiProps,
      fullWidth: true,
      minRows: 3,
      value: inputValue,
      onChange: (e: React.FormEvent<HTMLInputElement>) => {
        setInputValue(e.currentTarget.value);
      },
      size: 'small',
      onBlur: (e: any) => {
        const _value = e.currentTarget.value;
        if (meta.value !== _value) {
          form.setFieldValue(field.name, _value);
        }
      },
    };

    if (type === 'text') {
      delete compProps.minRows;
    } else {
      delete compProps.fullWidth;
    }

    return (
      <>
        <Comp {...compProps} />
        {err && useMeta ? <ErrorStyled className="error">{meta.error}</ErrorStyled> : null}
      </>
    );
  });
}

export const InputText = withInput(TextField, 'text');

export const Textarea = withInput(TextareaAutosize, 'textarea');
