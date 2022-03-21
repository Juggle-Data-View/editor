import { INodeConfig } from 'auto-dv-type/src/form';

export const placeholder: INodeConfig = {
  type: 'collapse',
  name: 'placeholder',
  props: { label: '占位块', help: '组件自身无渲染时通过占位块区分组件位置' },
  children: [
    { type: 'number', name: 'size', label: '大小', props: { muiProps: { min: 0 } } },
    { type: 'color', name: 'color', label: '颜色' },
  ],
};
