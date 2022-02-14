import { INodeConfig } from 'components/recursion';
import tooltip from '../common/tooltip';
import axisLabel from '../common/axisLabel';

const radar: INodeConfig[] = [
  ...tooltip,
  {
    name: 'series[0]',
    props: {
      label: '全局设置',
    },
    type: 'collapse',
    children: [
      {
        name: 'itemStyle.gapWidth',
        type: 'number',
        label: '间距',
        props: {
          muiProps: {
            min: 0,
          },
        },
      },
      {
        name: 'itemStyle.borderColor',
        type: 'color',
        label: '边框颜色',
      },
      {
        name: 'itemStyle.borderWidth',
        type: 'number',
        label: '边框宽度',
      },
    ],
  },
  {
    name: 'series[0].label',
    type: 'collapse',
    children: axisLabel,
    props: {
      label: '标签文本设置',
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
];

export default radar;
