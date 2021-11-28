import { Button, Menu, MenuItem, Position, OptionProps, MenuItemProps, ButtonProps } from '@blueprintjs/core';
import { Popover2, Popover2Props } from '@blueprintjs/popover2';
import { children2option, s2o } from './utils';
import { withField } from './withField';

export interface ISelect {
  options?: Array<OptionProps & Omit<MenuItemProps, 'text' | 'active'>>;
  children?: React.ReactNode;
  buttonProps?: ButtonProps;
  popoverProps?: Popover2Props;
  onChange?: (value: any) => void;
  disabled?: boolean;
}

export const Select = withField<ISelect>((props) => {
  const { field, form, options, children, buttonProps, popoverProps, onChange, disabled } = props;
  const placeholder = '请选择下拉项';

  // 优先使用 options，没有时才使用 children
  const _options = s2o(options ? options : children2option(children));
  const activeOption = _options.find((option) => option.value === field.value);

  return (
    <>
      <Popover2
        position={Position.BOTTOM}
        disabled={disabled}
        {...popoverProps}
        content={
          <Menu style={{ maxHeight: 240, overflow: 'auto' }}>
            {_options.length ? (
              _options.map(({ label, value, ...rest }) => (
                <MenuItem
                  key={value}
                  text={label}
                  active={value === field.value}
                  {...rest}
                  onClick={() => {
                    form.setFieldValue(field.name, value);
                    form.setFieldTouched(field.name, true);
                    onChange && onChange(value);
                  }}
                />
              ))
            ) : (
              <MenuItem text={'没有下拉数据'} />
            )}
          </Menu>
        }
      >
        <Button
          alignText="left"
          rightIcon="double-caret-vertical"
          disabled={disabled}
          {...buttonProps}
          text={activeOption?.label || placeholder}
        />
      </Popover2>
    </>
  );
});
