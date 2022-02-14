import { children2option } from './utils';
import { withField } from './withField';
import { Radio as MuiRadio, RadioGroup, RadioGroupProps, FormControlLabel, FormControl } from '@mui/material';
export interface IRadio {
  options?: any;
  radioGroupProps?: Omit<RadioGroupProps, 'onChange' | 'options'>;
  children?: React.ReactNode;
}

export const Radio = withField<IRadio>((props) => {
  const { field, form, options, radioGroupProps, children } = props;
  const isNumber = typeof field.value === 'number';
  return (
    <FormControl>
      <RadioGroup
        className="radio-group"
        {...radioGroupProps}
        row
        value={field.value}
        onChange={(e) => {
          const val = e.currentTarget.value;
          form.setFieldValue(field.name, isNumber ? +val : val);
          form.setFieldTouched(field.name, true);
        }}
      >
        {!options
          ? children2option(children).map(({ label, value, ...rest }) => {
              return (
                <FormControlLabel
                  key={(label || '') + value}
                  label={label}
                  value={value}
                  control={<MuiRadio />}
                  {...rest}
                />
              );
            })
          : null}
      </RadioGroup>
    </FormControl>
  );
});
