import { INodeConfig } from 'components/recursion';
import tooltip from '../common/tooltip';
import axisLabel from '../common/axisLabel';
import legend from '../common/legend';
import lineStyle from '../common/lineStyle';

const pie: INodeConfig[] = [
  ...tooltip,
  {
    name: 'series[0]',
    props: {
      label: '圆环设置',
    },
    type: 'collapse',
    children: [
      {
        name: 'radius[0]',
        type: 'range',
        label: '外径',
        props: {
          range: [0, 100],
          sliderProps: {
            stepSize: 1,
          },
        },
      },
      {
        name: 'radius[1]',
        type: 'range',
        label: '内径',
        props: {
          range: [0, 100],
          sliderProps: {
            stepSize: 1,
          },
        },
      },
      {
        name: 'color[]',
        type: 'array',
        props: () => {
          return {
            label: '颜色设置',
            renderItem: ({ child, index, actions }) => {
              return (
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '5px 0px',
                  }}
                >
                  <div style={{ display: 'inline-flex', alignItems: 'center' }}>
                    <div style={{ paddingRight: '20px', minWidth: '5.5em' }}>颜色{index + 1}</div>
                    {child}
                  </div>
                  {/* <div style={{ flex: 1 }}></div> */}
                  <div style={{ display: 'flex' }}>{actions}</div>
                </div>
              );
            },
            actions: ['copy', 'delete'],
          };
        },
        children: [
          {
            name: 'colorStops[0].color',
            type: 'color',
          },
        ],
      },
    ],
  },
  {
    name: 'series[0].label',
    type: 'collapse',
    props: {
      label: '标签设置',
    },
    children: [
      ...axisLabel,
      {
        name: 'formatter',
        label: '值标签内容',
        type: 'select',
        props: {
          options: [
            {
              label: '不显示',
              value: '',
            },
            {
              label: '显示数据名',
              value: '{b}',
            },
            {
              label: '显示百分比',
              value: '{d}%',
            },
            {
              label: '显示数据值',
              value: '{c}',
            },
            {
              label: '显示数据值和百分比',
              value: '{c}\n{d}%',
            },
            {
              label: '显示数据名和百分比',
              value: '{b}\n{d}%',
            },
            {
              label: '显示数据名和数据值',
              value: '{b}\n{c}',
            },
          ],
        },
      },
    ],
  },
  {
    name: 'series[0].labelLine',
    type: 'collapse',
    props: {
      label: '标签引导线',
    },
    children: [
      {
        name: 'show',
        type: 'switch',
        label: '显示引导线',
      },
      {
        name: 'length',
        type: 'number',
        label: '引导线第一段长度',
        props: {
          muiProps: {
            min: 0,
          },
        },
      },
      {
        name: 'length2',
        type: 'number',
        label: '引导线第二段长度',
        props: {
          muiProps: {
            min: 0,
          },
        },
      },
      {
        name: 'smooth',
        type: 'switch',
        label: '曲线圆滑',
      },
      ...lineStyle,
    ],
  },
  legend,
];

export default pie;
