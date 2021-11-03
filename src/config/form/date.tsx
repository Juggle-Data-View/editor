import { INodeConfig } from 'components/recursion/types';

export const dateFormatOptions = [
  { value: 'YYYY-MM-DD', label: 'YYYY-MM-DD' },
  { value: 'YYYY.M.D', label: 'YYYY.M.D' },
  { value: 'YYYY-M-D ', label: 'YYYY-M-D ' },
  { value: 'YYYY.MM.DD', label: 'YYYY.MM.DD' },
  { value: 'YYYY/MM/DD', label: 'YYYY/MM/DD' },
  { value: 'YYYY/M/D', label: 'YYYY/M/D' },
  { value: 'YYYY年MM月DD日', label: 'YYYY年MM月DD日' },
  { value: 'YYYY年M月D日', label: 'YYYY年M月D日' },
];

export const timeFormatOptions = [
  { value: 'HH:mm:ss', label: 'HH:mm:ss' },
  { value: 'hh:mm:ss', label: 'hh:mm:ss' },
  { value: 'H:m:s', label: 'H:m:s' },
  { value: 'h:m:s', label: 'h:m:s' },
  { value: 'HH时mm分ss秒', label: 'HH时mm分ss秒' },
  { value: 'H时m分s秒', label: 'H时m分s秒' },
  { value: 'hh时mm分ss秒', label: 'hh时mm分ss秒' },
  { value: 'h时m分s秒', label: 'h时m分s秒' },
];

export const dateFormat: INodeConfig = {
  type: 'select',
  name: 'dateFormat',
  label: '日期格式化',
  props: {
    options: dateFormatOptions,
  },
};

export const timeFormat: INodeConfig = {
  type: 'select',
  name: 'timeFormat',
  label: '时间格式化',
  props: {
    options: timeFormatOptions,
  },
};
