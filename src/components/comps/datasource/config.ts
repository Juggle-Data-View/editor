/**
 * 组件配置信息
 */
import { IConfig } from './type';

const config: IConfig = {
  version: '1.0.0',
  tab: {
    config: true,
    dataset: true,
  },
  template: {
    title: '数据源组',
    attr: {
      left: 0,
      top: 0,
      width: 200,
      height: 200,
      angle: 0,
      scale: [1, 1],
    },
    config: {
      placeholder: {
        size: 40,
        color: '#fff',
      },
    },
    dataConfig: {
      fieldMap: [
        {
          compFieldName: 'value',
          sourceFieldName: '',
        },
      ],
    },
  },
  forms: {
    type: 'fragment',
    name: 'config',
    children: [
      {
        type: 'collapse',
        name: 'placeholder',
        props: { label: '占位块设置', isOpen: true },
        children: [
          {
            type: 'number',
            name: 'size',
            label: '大小',
            props: {
              muiProps: {
                min: 0,
              },
            },
          },
          { type: 'color', name: 'color', label: '颜色' },
        ],
      },
    ],
  },
  staticData: [
    {
      content: {
        series: [
          {
            name: 'y1',
            type: 'bar',
            FieldName: 'y1',
            itemStyle: {
              color: '#50e3c1',
              borderColor: '#00000000',
              borderWidth: 2,
              barBorderRadius: [10, 10, 0, 0],

              // barBorderRadius: 10
            },
            showBackground: false,
            backgroundStyle: {
              color: 'rgba(180, 180, 180, 0.2)',
            },
            barWidth: '15',
            barGap: '30%',
            label: {
              show: true,
              rotate: 0,
              color: '#D8D8D8',
              fontSize: 12,
              fontFamily: 'FZLTTHJW',
              fontWeight: 'bold',
              position: 'top',
              formatter: `function(data) {
                return data.value;
}`,
            },
          },
        ],
      },
    },
  ],
};

export default config;
