import React, { useState, useEffect } from 'react';
import { HTMLInputProps, InputGroup, TextArea } from '@blueprintjs/core';
import { withField } from './withField';
import styled from 'styled-components';

const ErrorStyled = styled.p`
  margin-top: 3px;
  line-height: 1.25;
`;

export interface IText<T> {
  bp?: T & HTMLInputProps;
  useMeta?: boolean;
}

// text 和 textarea 有相同的业务逻辑，所以使用 withInput 高阶包裹
function withInput<T>(Comp: React.ComponentType<T>) {
  // 使组件具备 formik 的能力
  return withField<IText<T>>((props) => {
    const { bp, useMeta = true, field, form } = props;
    const meta = form.getFieldMeta(field.name);
    const [inputValue, setInputValue] = useState(field.value);
    const err = meta.touched && meta.error;

    /**
     * 受控与非受控的区别
     * 受控组件本身的值受外部传入的 filed.value 影响，如果设置两个相同name的inputText组件
     * 修改一个时，另一个的值也会跟着发生变化。
     */
    useEffect(() => {
      setInputValue(field.value);
    }, [field.value]);

    return (
      <>
        <Comp
          fill
          intent={err ? 'danger' : 'none'}
          {...(bp as T)}
          value={inputValue}
          onChange={(e: React.FormEvent<HTMLInputElement>) => {
            setInputValue(e.currentTarget.value);
          }}
          onBlur={(e: any) => {
            const _value = e.currentTarget.value;
            if (meta.value !== _value) {
              form.setFieldValue(field.name, _value);
            }
          }}
        />
        {err && useMeta ? <ErrorStyled className="error">{meta.error}</ErrorStyled> : null}
      </>
    );
  });
}

export const InputText = withInput(InputGroup);

export const Textarea = withInput(TextArea);
