import { Switch as MuiSwitch, SwitchProps } from '@mui/material';
import { withField } from './withField';

export interface ISwitch {
  muiProps?: Omit<SwitchProps, 'onChange' | 'checked' | 'value'>;
  /** 使用 checkbox 组件 */
}

export const Switch = withField<ISwitch>((props) => {
  const { field, form, muiProps } = props;
  return (
    <MuiSwitch
      style={{ marginBottom: 0 }}
      {...muiProps}
      checked={field.value}
      onChange={() => form.setFieldValue(field.name, !field.value)}
    />
  );
});
