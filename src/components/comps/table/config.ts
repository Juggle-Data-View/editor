import { Config } from './type';
import forms from './dictionary';
import { nanocode } from 'utils';
const config: AutoDV.CompConfig<Config> = {
  version: '1.0.0',
  tab: {
    config: true,
    dataset: true,
  },
  template: {
    title: '基础表格',
    attr: {
      left: 0,
      top: 0,
      width: 800,
      height: 400,
      angle: 0,
      scale: [1, 1],
    },
    config: {
      style: {
        color: '#fff',
        fontSize: 100,
        fontFamily: 'FZLTTHJW',
        fontWeight: 'bold',
      },
      option: {
        global: {
          maxNumberOfRow: 5,
          fontFamily: 'FZLTTHJW',
          autoScroll: true,
          scrollTime: '5s',
          borderStyle: {
            columnBorder: true,
            columnBorderColor: '#006eff',
            columnBorderWidth: 1,
            rowBorder: true,
            rowBorderColor: '#006eff',
            rowBorderWidth: 1,
          },
        },
        tableHeader: {
          lineHeight: 16.7,
          backgroundColor: 'rgba(0,110,255,0.2)',
          fontFamily: 'FZLTTHJW',
          fontSize: 20,
          color: '#fff',
          fontWeight: 'normal',
          justifyContent: 'center',
          isShow: true,
          rowHeight: 16,
        },
        column: [
          {
            columnName: '列1',
            name: 'svalue1',
            width: 50,
            justifyContent: 'center',
            whiteSpace: 'normal',
            fontSize: 18,
            color: '#fff',
            fontWeight: 'normal',
            fontFamily: 'FZLTTHJW',
            textAlign: 'center',
            formatter: '',
            trend: {
              hasTrend: false,
              number: {
                isIconColor: true,
                suffix: '元',
                isThousands: true,
                base: 0,
              },
              color: {
                equal: '#ff0',
                up: 'red',
                down: '#06fc2c',
              },
              icon: './icon01.svg',
              size: 24,
              marginRight: 5,
            },
            limitOption: {
              isShow: false,
              limitTrigger: [
                {
                  conditionCode: nanocode('table'),
                  intervalType: 'close',
                  left: 1,
                  right: 3,
                  color: '#222',
                  isTrigger: false,
                  time: 10000,
                  timeUnit: 'sec',
                },
              ],
            },
          },
          {
            columnName: '列2',
            name: 'svalue2',
            width: 50,
            justifyContent: 'center',
            whiteSpace: 'normal',
            fontSize: 18,
            color: '#fff',
            fontWeight: 'normal',
            textAlign: 'center',
            fontFamily: 'FZLTTHJW',
            formatter: '',
            trend: {
              hasTrend: true,
              number: {
                isIconColor: true,
                suffix: '元',
                isThousands: true,
                base: 300,
              },
              color: {
                equal: '#ff0',
                up: 'red',
                down: '#06fc2c',
              },
              icon: './icon01.svg',
              size: 24,
              marginRight: 5,
            },
            limitOption: {
              isShow: true,
              limitTrigger: [
                {
                  conditionCode: nanocode('table'),
                  intervalType: 'close',
                  left: 1,
                  right: 3,
                  color: '#222',
                  isTrigger: false,
                  time: 10000,
                  timeUnit: 'sec',
                },
              ],
            },
          },
        ],
        row: {
          oddBackgroudColor: 'rgba(0,25,56,0.4)',
          evenBackgroudColor: 'rgba(0,25,56,0.4)',
        },
      },
    },
    dataConfig: {
      fieldMap: [
        {
          compFieldName: 'svalue1',
          sourceFieldName: 'city',
        },
        {
          compFieldName: 'svalue2',
          sourceFieldName: 'rainfall',
        },
      ],
    },
  },
  forms: {
    name: 'config',
    type: 'fragment',
    children: forms,
  },
  staticData: [
    {
      city: '北京',
      rainfall: 279.8,
    },
    {
      city: '上海',
      rainfall: 1419.3,
    },

    {
      city: '广州',
      rainfall: 1577.2,
    },

    {
      city: '成都',
      rainfall: 784.8,
    },

    {
      city: '武汉',
      rainfall: 1358.3,
    },
  ],
};

export default config;
