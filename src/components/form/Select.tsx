import { Popover, Button, Menu, MenuItem, ButtonProps, PopoverProps } from '@mui/material';
import { useRef, useState } from 'react';
import { children2option, s2o } from './utils';
import { withField } from './withField';

export interface ISelect {
  options?: { label: string; value: any }[];
  children?: React.ReactNode;
  buttonProps?: ButtonProps;
  popoverProps?: PopoverProps;
  onChange?: (value: any) => void;
  disabled?: boolean;
}

export const Select = withField<ISelect>((props) => {
  const { field, form, options, children, buttonProps, popoverProps, onChange, disabled } = props;
  const placeholder = '请选择下拉项';
  const containerRef = useRef<any>(null);
  // 优先使用 options，没有时才使用 children
  const _options = s2o(options ? options : children2option(children));
  console.log(options);

  const activeOption = _options.find((option) => option.value === field.value);
  const [isOpen, setOpen] = useState(false);
  //TODO: Menu item is selected styled
  return (
    <>
      <Popover
        anchorEl={containerRef.current}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        {...popoverProps}
        open={isOpen}
      >
        <Menu ref={containerRef} open={isOpen} style={{ maxHeight: 240, overflow: 'auto' }}>
          {_options.length ? (
            _options.map(({ label, value, ...rest }) => (
              <MenuItem
                {...rest}
                onClick={() => {
                  form.setFieldValue(field.name, value);
                  form.setFieldTouched(field.name, true);
                  onChange && onChange(value);
                  setOpen(false);
                }}
              >
                {label}
              </MenuItem>
            ))
          ) : (
            <MenuItem>没有下拉数据</MenuItem>
          )}
        </Menu>
      </Popover>
      <Button onClick={() => setOpen(!isOpen)} disabled={disabled} {...buttonProps}>
        {activeOption?.label || placeholder}
      </Button>
    </>
  );
});
