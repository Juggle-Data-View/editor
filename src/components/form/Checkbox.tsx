import React from 'react';
import { Checkbox as BPCheckbox, ICheckboxProps, IOptionProps } from '@blueprintjs/core';
import { children2option } from './utils';
import { withField } from './withField';

export interface ICheckbox {
  options?: Array<IOptionProps & Omit<ICheckboxProps, 'onChange' | 'checked'>>;
  children?: React.ReactNode;
}

export const Checkbox = withField<ICheckbox>((props) => {
  const { field, form, options, children } = props;
  const _options = options ? options : children2option(children);
  const fieldValue = field.value || [];
  return (
    <div className="checkbox-group">
      {_options.map(({ label, value, ...rest }) => {
        const checked = fieldValue.includes(value);
        return (
          <BPCheckbox
            key={value}
            value={value}
            label={label}
            inline
            {...rest}
            checked={checked}
            onChange={() => {
              let val = [...fieldValue];
              if (checked) {
                val = val.filter((v: any) => v !== value);
              } else {
                val.push(value);
              }
              form.setFieldValue(field.name, val);
              form.setFieldTouched(field.name, true);
            }}
          />
        );
      })}
    </div>
  );
});
