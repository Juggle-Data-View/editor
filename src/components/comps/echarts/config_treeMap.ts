import { JuggleDV } from '@juggle-data-view/types';
import treeMap from './configs/templates/treeMap';

const componentConfig: JuggleDV.CompConfig = {
  version: '1.0.0',
  tab: {
    config: true,
    dataset: true,
  },
  template: {
    title: '基础折线图',
    attr: {
      left: 0,
      top: 0,
      width: 500,
      height: 300,
    },
    config: {
      option: {
        echarts: {
          backgroundColor: 'rgba(0,0,0,0)',
          color: [
            {
              colorStops: [
                {
                  offset: 1,
                  color: '#137a87',
                },
              ],
            },
            {
              colorStops: [
                {
                  offset: 1,
                  color: '#3a69a8',
                },
              ],
            },
            {
              colorStops: [
                {
                  offset: 1,
                  color: '#26685e',
                },
              ],
            },
            {
              colorStops: [
                {
                  offset: 1,
                  color: '#3f77bb',
                },
              ],
            },
            {
              colorStops: [
                {
                  offset: 1,
                  color: '#20525f',
                },
              ],
            },
            {
              colorStops: [
                {
                  offset: 1,
                  color: '#075c8f',
                },
              ],
            },
          ],
          tooltip: {
            trigger: 'item',
            backgroundColor: 'rgba(50,50,50,0.7)',
            borderColor: '#333',
            borderWidth: 1,
            padding: 5,
            textStyle: {
              color: '#D8D8D8',
              fontSize: 16,
              fontFamily: 'FZLTTHJW',
              fontWeight: 'bold',
            },
          },
          series: [
            {
              name: 'JuggleDV',
              FieldName: 'value',
              type: 'treemap',
              width: '100%',
              height: '100%',
              minSize: '0%',
              maxSize: '100%',
              label: {
                show: true,
                rotate: 0,
                color: '#fff',
                fontSize: 16,
                fontFamily: 'FZLTTHJW',
                fontWeight: 'bold',
                ellipsis: true,
              },

              itemStyle: {
                borderColor: '#151630',
                borderWidth: 1,
                gapWidth: 0,
              },
              breadcrumb: {
                show: false,
              },
            },
          ],
          notMerge: false,
        },
      },
    },
    dataConfig: {
      fieldMap: [
        {
          compFieldName: 'name',
          sourceFieldName: 'brand',
        },
        {
          compFieldName: 'value',
          sourceFieldName: 'stock',
        },
      ],
    },
  },
  forms: {
    type: 'fragment',
    name: 'config.option.echarts',
    children: [...treeMap, { name: 'notMerge', type: 'switch', label: '重绘' }],
  },
};

export default componentConfig;
