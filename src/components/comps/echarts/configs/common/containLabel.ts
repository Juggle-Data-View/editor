import { INodeConfig } from 'auto-dv-type/src/form';

const containLabel: INodeConfig = {
  name: 'grid',
  type: 'collapse',
  props: {
    label: '图表溢出控制',
  },
  children: [
    {
      name: 'containLabel',
      type: 'switch',
      label: '防止标签溢出',
    },
    {
      name: 'top',
      type: 'text',
      label: '上边距',
    },
    {
      name: 'bottom',
      type: 'text',
      label: '下边距',
    },
    {
      name: 'left',
      type: 'text',
      label: '左边距',
    },
    {
      name: 'right',
      type: 'text',
      label: '右边距',
    },
  ],
};

export default containLabel;
