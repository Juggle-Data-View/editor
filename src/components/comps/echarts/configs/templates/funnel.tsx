import { INodeConfig } from 'components/recursion';
import axisLabel from '../common/axisLabel';
import tooltip from '../common/tooltip';
import * as font from 'config/form/font';

const funnel: INodeConfig[] = [
  ...tooltip,
  {
    name: 'series[0]',
    props: {
      label: '全局设置',
    },
    type: 'collapse',
    children: [
      {
        name: 'sort',
        type: 'select',
        label: '排序',
        props: {
          options: [
            {
              label: '降序',
              value: 'descending',
            },
            {
              label: '升序',
              value: 'ascending',
            },
            {
              label: '数据顺序',
              value: 'none',
            },
          ],
        },
      },
      {
        name: 'gap',
        type: 'number',
        label: '间距',
        props: {
          bp: {
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
        props: {
          bp: {
            min: 0,
          },
        },
      },
    ],
  },
  {
    name: '',
    props: {
      label: '标签文本设置',
    },
    type: 'collapse',
    children: [
      {
        name: 'series[0].label',
        type: 'collapse',
        props: {
          label: '普通文本',
        },
        children: axisLabel,
      },
      {
        name: 'series[0].emphasis.labe',
        type: 'collapse',
        props: {
          label: '悬浮文本',
        },
        children: axisLabel,
      },
    ],
  },

  {
    name: 'legend',
    type: 'collapse',
    props: {
      label: '图例配置',
    },
    children: [
      {
        name: 'show',
        type: 'switch',
        label: '显示图例',
      },
      {
        name: 'textStyle',
        type: 'collapse',
        props: {
          label: '图例文本设置',
        },
        children: [
          font.fontSize,
          font.lineHeight,
          font.color,
          font.fontFamily,
          font.fontWeight,
          font.textShadow,
          font.writingMode,
        ],
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
  },
  {
    name: 'series[0].color[]',
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
export default funnel;
