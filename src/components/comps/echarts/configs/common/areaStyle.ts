import { INodeConfig } from 'components/recursion';

const areaStyle: INodeConfig[] = [
  {
    name: 'color',
    type: 'color',
    label: '区域颜色',
    props: {
      useGradient: true,
    },
  },
  {
    name: 'opacity',
    type: 'number',
    label: '区域透明度',
    props: {
      bp: {
        minorStepSize: 0.01,
        stepSize: 0.01,
        max: 1,
        min: 0,
      },
    },
  },
];

export default areaStyle;
