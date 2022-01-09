import { INodeConfig } from 'components/recursion/types';
import { borderStyle } from 'config/form/style';

const lineStyle: INodeConfig[] = [
  {
    name: 'color',
    type: 'color',
    props: {
      useGradient: true,
    },
    label: '线条颜色',
  },
  {
    name: 'width',
    type: 'number',
    label: '线条宽度',
    props: {
      muiProps: {
        min: 0,
      },
    },
  },
  {
    ...borderStyle,
    name: 'type',
  },
];

export default lineStyle;
