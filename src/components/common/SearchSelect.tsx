import { MenuItem, TextField } from '@mui/material';
import Autocomplete from '@mui/material/Autocomplete';
import React from 'react';

export type Item = {
  label: string;
  value: string | number | null;
};

export interface SearchSelectProps {
  activeItem: Item | undefined;
  items: Item[];
  onItemSelect: (item: Item) => void;
  extraRefresh?: React.ReactNode; // 是否显示刷新按钮
  showEmpty?: boolean; // 是否显示“无”选项
  placeholder?: string;
}

const empty: Item = {
  label: '无',
  value: null,
};

const SearchSelect: React.FC<SearchSelectProps> = (props) => {
  const { activeItem, items, onItemSelect, extraRefresh, showEmpty = true, placeholder } = props;

  return (
    <div style={{ display: 'flex', alignItems: 'center', flex: 1 }}>
      <Autocomplete
        fullWidth
        options={showEmpty ? [empty].concat(items) : items}
        isOptionEqualToValue={(option, value) => {
          console.log(option, value);

          return option?.value === value.value;
        }}
        renderInput={(param) => {
          return (
            <TextField
              {...param}
              size="small"
              // defaultValue={activeItem?.label || ''}
              value={activeItem?.value}
              label={placeholder || 'select dataset'}
            />
          );
        }}
        renderOption={({ onClick }, option) => {
          return (
            <MenuItem
              key={option.value}
              onClick={(e) => {
                onClick && onClick(e);
                onItemSelect(option);
              }}
              selected={activeItem?.value === option.value}
            >
              {option.label}
            </MenuItem>
          );
        }}
      />
      {extraRefresh}
    </div>
  );
};

export default SearchSelect;
