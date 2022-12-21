import { INodeConfig } from '@juggle-data-view/types/src/form';

import { resolveName } from '@components/recursion/utils';

const multiBarSeries: INodeConfig = {
  name: 'series[0]',
  type: 'collapse',
  props: {
    label: '柱形样式',
  },
  children: [
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
    {
      name: 'itemStyle.barBorderRadius[0]',
      type: 'number',
      label: '柱条左上圆角',
      onChange: ({ value, getValue, setValue, name }) => {
        const seriesPath = resolveName(name, '../../../../');

        const seriesField = getValue(seriesPath);
        if (Array.isArray(seriesField)) {
          seriesField.forEach((_item: any, index: number) => {
            const name = [seriesPath, index, 'itemStyle.barBorderRadius[0]'].join('.');
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
    {
      name: 'itemStyle.barBorderRadius[1]',
      type: 'number',

      label: '柱条右上圆角',
      onChange: ({ value, getValue, setValue, name }) => {
        const seriesPath = resolveName(name, '../../../../');
        const seriesField = getValue(seriesPath);
        if (Array.isArray(seriesField)) {
          seriesField.forEach((_item: any, index: number) => {
            const name = [seriesPath, index, 'itemStyle.barBorderRadius[1]'].join('.');
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
    {
      name: 'itemStyle.barBorderRadius[2]',
      type: 'number',

      label: '柱条右下圆角',
      onChange: ({ value, getValue, setValue, name }) => {
        const seriesPath = resolveName(name, '../../../../');
        const seriesField = getValue(seriesPath);
        if (Array.isArray(seriesField)) {
          seriesField.forEach((_item: any, index: number) => {
            const name = [seriesPath, index, 'itemStyle.barBorderRadius[2]'].join('.');

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
    {
      name: 'itemStyle.barBorderRadius[3]',
      type: 'number',

      label: '柱条左下圆角',
      onChange: ({ value, getValue, setValue, name }) => {
        const seriesPath = resolveName(name, '../../../../');
        const seriesField = getValue(seriesPath);
        if (Array.isArray(seriesField)) {
          seriesField.forEach((_item: any, index: number) => {
            const name = [seriesPath, index, 'itemStyle.barBorderRadius[3]'].join('.');
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
    {
      name: 'barGap',
      type: 'text',
      label: '不同系列柱条间隔',
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
    },
  ],
};

export default multiBarSeries;
