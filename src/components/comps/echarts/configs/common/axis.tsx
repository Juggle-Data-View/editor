import axisTick from './axisTick';
import axisLabel from './axisLabel';
import lineStyle from './lineStyle';
import { INodeConfig } from 'components/recursion';

const xAxisDictionary: INodeConfig[] = [
  {
    name: 'show',
    type: 'switch',
    label: ' 显示坐标轴',
  },
  { name: 'needZeroPoint', type: 'switch', label: '补充零值' },
  {
    name: 'timeStamp',
    type: 'select',
    label: '刻度时间间隔',
    // show: ({ parentValue }) => parentValue.timeRangeType === 'custom',
    props: {
      options: [
        {
          value: '1m',
          label: '1分钟',
        },
        {
          value: '5m',
          label: '5分钟',
        },
        {
          value: '1h',
          label: '1小时',
        },
        {
          value: '3h',
          label: '3小时',
        },
        {
          value: '1d',
          label: '1天',
        },
        {
          value: '1w',
          label: '1周',
        },
      ],
    },
  },
  {
    name: 'isFixedTimeRange',
    type: 'switch',
    label: '固定时间范围',
  },
  {
    name: 'timeRangeType',
    type: 'select',
    label: '时间范围类型',
    // labelProps: {
    //   width: '100px',
    // },
    show: ({ parentValue }) => parentValue.isFixedTimeRange,
    props: {
      options: [
        {
          value: 'custom',
          label: '自定义',
        },
        {
          value: 'fixedStart',
          label: '固定起点',
        },
        {
          value: 'today',
          label: '今天零点',
        },
      ],
    },
  },
  {
    name: 'timeStart',
    type: 'text',
    label: '时间起点',
    show: ({ parentValue }) => parentValue.timeRangeType !== 'today' && parentValue.isFixedTimeRange,
  },
  {
    name: 'timeEnd',
    type: 'text',
    label: '时间终点',
    show: ({ parentValue }) => parentValue.timeRangeType === 'custom' && parentValue.isFixedTimeRange,
  },
  {
    name: 'timeStack',
    type: 'text',
    labelProps: {
      help: (
        <div style={{ maxWidth: 180 }}>
          1d: 一天
          <br />
          1h: 一时
          <br />
          1m: 一分
          <br />
          1s: 一秒
          <br />
          1w: 一周
        </div>
      ),
    },
    label: '时间跨度',
    show: ({ parentValue }) => parentValue.timeRangeType !== 'custom' && parentValue.isFixedTimeRange,
  },
  {
    name: '',
    type: 'collapse',
    props: {
      label: '轴单位设置',
    },
    children: [
      {
        name: 'name',
        type: 'text',
        label: '文本内容',
      },
      {
        name: 'nameLocation',
        type: 'select',
        label: '位置',
        props: {
          options: [
            {
              label: 'start',
              value: '开始',
            },
            {
              label: 'end',
              value: '结束',
            },
            {
              label: 'center',
              value: '中间',
            },
          ],
        },
      },
      {
        name: 'nameTextStyle',
        type: 'fragment',
        children: axisLabel,
      },
      {
        name: 'nameRotate',
        type: 'number',
        label: '旋转角度',
        props: {
          bp: {
            min: -90,
            max: 90,
          },
        },
      },
    ],
  },
  {
    name: 'axisLine',
    type: 'collapse',
    props: {
      label: '轴线样式',
    },

    children: [
      {
        name: 'lineStyle',
        type: 'fragment',
        children: lineStyle,
      },
      {
        name: 'show',
        type: 'switch',
        label: '显示轴线',
      },
    ],
  },

  {
    name: 'offset',
    type: 'number',
    label: '轴线偏移量',
  },
  {
    name: 'nameGap',
    type: 'number',
    label: '轴线名距轴线距离',
  },
  {
    name: 'splitNumber',
    type: 'number',
    label: '坐标轴分割段数',
    labelProps: {
      width: 120,
    },
    props: {
      bp: { min: 0 },
    },
  },
  {
    name: 'axisTick',
    type: 'collapse',
    props: {
      label: '轴刻度',
    },

    children: axisTick,
  },
  {
    name: 'axisLabel',
    type: 'collapse',
    props: {
      label: '轴标签',
    },

    children: axisLabel,
  },
  {
    name: 'splitLine',
    type: 'collapse',
    props: {
      label: '网格线',
    },

    children: [
      {
        name: 'show',
        type: 'switch',
        label: '显示网格线',
      },
      {
        name: 'lineStyle',
        type: 'fragment',
        children: lineStyle,
      },
    ],
  },
  {
    name: 'inverse',
    type: 'switch',
    label: '反向坐标轴',
  },
];
export default xAxisDictionary;
