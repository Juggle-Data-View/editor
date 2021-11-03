import React from 'react';
import { Switch as BPSwitch, Checkbox, ISwitchProps, ICheckboxProps } from '@blueprintjs/core';
import { withField } from './withField';

export interface ISwitch {
  bp?: Omit<ISwitchProps | ICheckboxProps, 'onChange' | 'checked' | 'value'>;
  /** 使用 checkbox 组件 */
  useCheckbox?: boolean;
}

export const Switch = withField<ISwitch>((props) => {
  const { field, form, bp, useCheckbox } = props;
  const Comp = useCheckbox ? Checkbox : BPSwitch;
  return (
    <Comp
      style={{ marginBottom: 0 }}
      inline
      {...bp}
      checked={field.value}
      onChange={() => form.setFieldValue(field.name, !field.value)}
    />
  );
});
