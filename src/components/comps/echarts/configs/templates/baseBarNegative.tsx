import axisLabel from '../common/axisLabel';
import tooltip from '../common/tooltip';
import { INodeConfig } from '@juggle-data-view/types/src/form';

import { resolveName } from 'components/recursion/utils';
import xAxisDictionary from '../common/axis';

const dictionary: INodeConfig[] = [
  ...tooltip,
  {
    name: '',

    type: 'collapse',
    label: '图表',
    children: [
      {
        name: 'backgroundColor',
        type: 'color',
        label: '背景色',
      },
      {
        name: 'grid',
        type: 'collapse',
        label: '图表溢出控制',
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
      },
      {
        name: 'series[0]',
        type: 'collapse',
        label: '柱形样式',
        children: [
          {
            name: 'barCategoryGap',
            type: 'text',
            label: '柱形间距',
          },
          {
            name: 'barWidth',
            type: 'number',
            label: '柱形宽度',
            onChange: ({ value, getValue, setValue, name }) => {
              const itemKey = name.split('.').pop() as string; // 获取需要修改的key=barWidth
              const seriesPath = resolveName(name, '../../'); // 根据当前路径，回退2次，得到的name=series
              const seriesFieldValue = getValue(name, '../../');
              if (Array.isArray(seriesFieldValue)) {
                seriesFieldValue.forEach((_item: any, index: number) => {
                  const name = [seriesPath, index, itemKey].join('.');
                  setValue(name, value);
                });
              }
            },
            props: {
              muiProps: {
                min: 0,
              },
            },
          },
        ],
      },
    ],
  },

  {
    name: '',
    type: 'collapse',
    label: '坐标轴',
    children: [
      {
        name: 'xAxis',
        type: 'collapse',
        label: 'X轴样式',
        children: xAxisDictionary,
      },
      {
        name: 'yAxis',
        type: 'collapse',
        label: 'Y轴样式',
        children: [
          {
            name: 'showWay',
            type: 'select',
            label: '显示方式',
            props: {
              options: [
                {
                  value: 'sigle',
                  label: '单轴显示',
                },
                {
                  value: 'split',
                  label: '分离轴',
                },
              ],
            },
          },
          ...xAxisDictionary,
        ],
      },
    ],
  },
  {
    name: '',
    type: 'collapse',
    label: '系列样式',
    children: [
      {
        name: 'series',
        type: 'array',
        props: () => {
          // const fieldMap: any[] = getValue(fieldMapPath);

          return {
            itemTitle: (item) => `系列-${item.name}`,
            label: '系列',
          };
        },
        children: [
          {
            name: 'name',
            type: 'text',
            label: '系列名称',
          },
          {
            name: 'showBackground',
            type: 'switch',
            label: '显示背景',
          },
          {
            name: 'backgroundStyle.color',

            type: 'color',
            label: '柱形背景颜色',
          },
          {
            name: 'itemStyle.color',

            type: 'color',
            label: '柱形颜色',
            props: {
              useGradient: true,
              // mapProps: {
              //   colorProps: {
              //     useGradient: true,
              //   },
              // },
            },
          },
          {
            name: 'itemStyle.barBorderRadius[0]',
            type: 'number',

            label: '柱条左上圆角',
            props: {
              muiProps: {
                min: 0,
              },
            },
          },
          {
            name: 'itemStyle.barBorderRadius[1]',
            type: 'number',

            label: '柱条右上圆角',
            props: {
              muiProps: {
                min: 0,
              },
            },
          },
          {
            name: 'itemStyle.barBorderRadius[2]',
            type: 'number',

            label: '柱条右下圆角',
            props: {
              muiProps: {
                min: 0,
              },
            },
          },
          {
            name: 'itemStyle.barBorderRadius[3]',
            type: 'number',

            label: '柱条左下圆角',
            props: {
              muiProps: {
                min: 0,
              },
            },
          },
          {
            name: 'label',
            type: 'collapse',
            label: '值标签',
            children: axisLabel,
          },
        ],
      },
    ],
  },
];

export default dictionary;
