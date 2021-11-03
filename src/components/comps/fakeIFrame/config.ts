/**
 *  * 组件配置信息
 */
import { Config } from './type';
import forms from './dictionary';

const config: AutoDV.CompConfig<Config> = {
  version: '1.0.0',
  tab: {
    config: true,
    dataset: false,
  },
  template: {
    title: '动态iframe',
    attr: {
      left: 0,
      top: 0,
      width: 400,
      height: 300,
      angle: 0,
      scale: [1, 1],
    },
    config: {
      title: '默认标题',
      style: {},
      option: {
        tabAddressOption: {
          tabAddress: [
            {
              title: '轮播1',
              // url: 'id=551',
              url: '',
              type: 'id',
            },
            {
              title: '轮播2',
              // url: 'release=f7c7653692a1421198c94c7da50adf8e',
              url: '',
              type: 'releaseCode',
            },
          ],
          carouselCycle: 5000,
        },
        tabTitleStyle: { height: 30, margin: 0, isShowTitle: false },
        activeTab: { fontSize: 14, color: '#fff', backgroundColor: 'red' },
        inactivedTab: { fontSize: 14, color: '#fff', backgroundColor: 'rgba(0,0,0,0)' },
        animationType: 'carousel',
        animationVelocity: 'Linear',
        animationDuration: 500,
        isAutoChange: true,
      },
    },
    dataConfig: {
      fieldMap: [
        {
          compFieldName: 'title',
          sourceFieldName: '',
        },
        {
          compFieldName: 'url',
          sourceFieldName: '',
        },
      ],
    },
  },
  forms: {
    name: 'config',
    type: 'fragment',
    children: forms as any,
  },
  staticData: [],
};

export default config;
