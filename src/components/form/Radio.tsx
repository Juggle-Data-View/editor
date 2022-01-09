import { RadioGroup, Radio as BPRadio, IRadioGroupProps } from '@blueprintjs/core';
import { children2option } from './utils';
import { withField } from './withField';

export interface IRadio {
  options?: any;
  radioGroupProps?: Omit<IRadioGroupProps, 'onChange' | 'options'>;
  children?: React.ReactNode;
}

export const Radio = withField<IRadio>((props) => {
  const { field, form, options, radioGroupProps, children } = props;
  const isNumber = typeof field.value === 'number';
  return (
    <RadioGroup
      className="radio-group"
      inline
      {...radioGroupProps}
      options={options}
      selectedValue={field.value}
      onChange={(e) => {
        const val = e.currentTarget.value;
        form.setFieldValue(field.name, isNumber ? +val : val);
        form.setFieldTouched(field.name, true);
      }}
    >
      {!options
        ? children2option(children).map(({ label, value, ...rest }) => {
            return <BPRadio key={(label || '') + value} value={value} label={label} {...rest} />;
          })
        : null}
    </RadioGroup>
  );
});
