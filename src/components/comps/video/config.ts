/**
 *组件配置信息
 */
import { IConfig } from './type';

const config: IConfig = {
  version: '1.0.0',
  tab: {
    config: true,
    dataset: true,
  },
  template: {
    title: '视频',
    attr: {
      left: 0,
      top: 0,
      width: 500,
      height: 300,
      angle: 0,
      scale: [1, 1],
    },
    config: {
      url: '',
      isAuto: true,
      isLoop: true,
      isMute: true,
    },
    dataConfig: {
      fieldMap: [
        {
          compFieldName: 'url',
          sourceFieldName: '',
        },
      ],
    },
  },
  forms: [
    {
      type: 'fragment',
      name: 'config',
      children: [
        {
          type: 'textarea',
          name: 'url',
          label: '视频地址',
          labelProps: { help: '支持从数据配置中获取视频，优先读取数据配置中URL的内容' },
        },
        {
          type: 'switch',
          name: 'isAuto',
          label: '自动播放',
        },
        {
          type: 'switch',
          name: 'isLoop',
          label: '循环播放',
        },
        {
          type: 'switch',
          name: 'isMute',
          label: '静音播放',
        },
      ],
    },
  ],
  staticData: [
    {
      videoUrl: '',
    },
  ],
};

export default config;
