/**
 * 组件配置信息
 */
import { IConfig } from './type';
import * as font from 'config/form/font';

const config: IConfig = {
  version: '1.0.0',
  tab: {
    config: true,
    dataset: true,
  },
  template: {
    title: 'TEMPLATE_ALIAS',
    attr: {
      left: 0,
      top: 0,
      width: 500,
      height: 200,
      angle: 0,
      scale: [1, 1],
    },
    config: {
      placeholder: {
        size: 40,
        color: '#fff',
      },
      text: {
        content: '文本内容',
        style: {
          color: '#fff',
          fontSize: 28,
          lineHeight: 1.5,
          fontFamily: 'FZLTTHJW',
          fontWeight: 'normal',
          textAlign: 'center',
        },
      },
    },
    dataConfig: {
      fieldMap: [
        {
          compFieldName: 'value',
          sourceFieldName: 'str',
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
          { type: 'number', name: 'size', label: '大小', props: { muiProps: { min: 0 }, unit: 'px' } },
          { type: 'color', name: 'color', label: '颜色' },
        ],
      },
      {
        type: 'fragment',
        name: 'text',
        children: [
          { type: 'textarea', name: 'content', label: '文本内容' },
          {
            type: 'collapse',
            name: 'style',
            props: { label: '文本样式', isOpen: true },
            children: [font.fontSize, font.lineHeight, font.color, font.fontFamily, font.fontWeight, font.textAlign],
          },
        ],
      },
    ],
  },
  staticData: [{ str: 'template static data' }],
};

export default config;
