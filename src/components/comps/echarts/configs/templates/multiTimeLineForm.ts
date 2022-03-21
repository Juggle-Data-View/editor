import { INodeConfig } from 'auto-dv-type/src/form';

import axis from '../common/axis';
import toolip from '../common/tooltip';
import chartTitle from '../common/chartTitle';
import containLabel from '../common/containLabel';
import legend from '../common/legend';
import lineSeriesCommon from '../common/linesSeriesCommon';
// import multiBarSeries from '../multiBarSeries';

const multiBarForm: INodeConfig[] = [
  ...toolip,
  {
    name: '',
    type: 'collapse',
    props: {
      label: '图表',
    },
    children: [
      {
        name: 'backgroundColor',
        type: 'color',
        label: '背景色',
      },
      containLabel, // 图表溢出控制
      chartTitle, // 图表标题
      legend, // 图例配置
    ],
  },
  {
    name: '',
    type: 'collapse',
    props: {
      label: '坐标轴',
    },
    children: [
      {
        name: 'xAxis[]',
        type: 'collapse',
        props: {
          label: 'X轴样式',
        },
        children: axis,
      },
      {
        name: 'yAxis[]',
        type: 'array',
        props: {
          label: 'Y轴样式',
          itemTitle: (item) => `${item.name}轴`,
          headExtra: () => null,
          actions: ['down', 'up'],
        },
        children: axis,
      },
    ],
  },
  {
    name: '',
    type: 'collapse',
    props: {
      label: '系列',
    },
    children: [
      {
        name: 'series[]',
        type: 'array',
        props: ({ getValue, setValue }) => {
          const fieldMapPath = 'dataConfig.fieldMap';
          const fieldMap: any[] = getValue(fieldMapPath);
          const fieldName = 'y' + (fieldMap.length + 1);
          return {
            itemTitle: (item) => `系列-${item.name}`,
            label: '系列',
            onAdd: () => {
              const result: any[] = fieldMap.concat([
                {
                  sourceFieldName: '',
                  compFieldName: fieldName,
                },
              ]);
              setValue(fieldMapPath, result);
            },
            onBeforeAdd: (item) => {
              return {
                ...item,
                name: fieldName,
                FieldName: fieldName,
              };
            },
            onDelete: (deleteData) => {
              const result = fieldMap.filter((item) => {
                return item.compFieldName !== deleteData.FieldName;
              });
              setValue(fieldMapPath, result);
            },
          };
        },
        children: lineSeriesCommon, // 通用线性系列配置
      },
    ],
  },
];

export default multiBarForm;
