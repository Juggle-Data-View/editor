import { INodeConfig } from '@juggle-data-view/types/src/form';

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
      muiProps: {
        minorStepSize: 0.01,
        step: 0.01,
        max: 1,
        min: 0,
      },
    },
  },
];

export default areaStyle;
