import axis from '../common/axis';
import toolip from '../common/tooltip';
import containLabel from '../common/containLabel';
import chartTitle from '../common/chartTitle';
import legend from '../common/legend';
import multiBarSeries from '../multiBarSeries';
import lineSeriesCommin from '../common/linesSeriesCommon';
import { INodeConfig } from 'components/recursion';
import SeriesAction from '../../seriesAction';

// import { resolveName } from 'components/recursion/utils';
// import Tabs from 'components/recursion/widget/Tabs';

const doubleAxisLineBarForm: INodeConfig[] = [
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
      ...toolip,
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
      multiBarSeries, // 柱状图通用系列
      {
        name: 'series[]',
        type: 'array',
        props: ({ getValue, setValue, value }) => {
          const fieldMapPath = 'dataConfig.fieldMap';
          const fieldMap: any[] = getValue(fieldMapPath);
          const fieldName = 'y' + (fieldMap.length + 1);
          const baseBar = value[0];
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
              return item.type === 'bar'
                ? {
                    ...item,
                    name: fieldName,
                    FieldName: fieldName,
                    itemStyle: {
                      ...item.itemStyle,
                      barBorderRadius: baseBar.itemStyle.barBorderRadius,
                    },
                    barWidth: baseBar.barWidth,
                    barGap: baseBar.barGap,
                  }
                : {
                    ...item,
                    name: fieldName,
                    FieldName: fieldName,
                  };
            },
            disableDelete: (item, index) => {
              return item.type === 'bar' && index === 0;
            },
            onDelete: (deleteData) => {
              const result = fieldMap.filter((item) => {
                return item.compFieldName !== deleteData.FieldName;
              });
              setValue(fieldMapPath, result);
            },
            headExtra: (defaultValues, push) => {
              return (
                <SeriesAction
                  fieldMapOption={{ fieldMapPath, fieldMap, fieldName }}
                  defaultValue={defaultValues}
                  setValue={setValue}
                  push={push}
                />
              );
            },
          };
        },
        children: lineSeriesCommin, // 折线图通用系列配置
      },
    ],
  },
];

export default doubleAxisLineBarForm;
