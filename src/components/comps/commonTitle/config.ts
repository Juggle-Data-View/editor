/**
 * 组件配置信息
 */
import * as font from 'config/form/font';
import { IConfig } from './type';

const config: IConfig = {
  version: '1.0.0',
  tab: {
    config: true,
    dataset: true,
  },
  template: {
    title: '普通文本',
    attr: {
      left: 0,
      top: 0,
      width: 300,
      height: 72,
      angle: 0,
      scale: [1, 1],
    },
    config: {
      title: '默认文本',
      style: {
        display: 'flex',
        color: '#fff',
        fontSize: 28,
        lineHeight: 1.5,
        fontFamily: 'FZLTTHJW',
        fontWeight: 'normal',
        letterSpacing: 0,
        justifyContent: 'flex-start',
        alignItems: 'center',
        textAlign: 'left',
        writingMode: 'horizontal-tb',
        textShadow: '',
      },
      link: {
        url: '',
        isBlank: false,
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
        type: 'textarea',
        name: 'title',
        label: '文本内容',
        labelProps: {
          help: '支持从数据配置中获取文本内容，优先读取数据配置中value内容。',
        },
      },
      {
        type: 'collapse',
        name: 'style',
        props: {
          label: '文本样式',
        },
        children: [
          font.fontSize,
          font.lineHeight,
          font.color,
          font.fontFamily,
          font.fontWeight,
          font.textShadow,
          font.writingMode,
          {
            type: 'select',
            name: 'textAlign',
            label: '对齐方式',
            props: ({ parentValue }) => {
              const isVertical = parentValue.writingMode === 'vertical-rl';
              return {
                options: [
                  { label: isVertical ? '上对齐' : '左对齐', value: 'left' },
                  { label: '居中', value: 'center' },
                  { label: isVertical ? '下对齐' : '右对齐', value: 'right' },
                ],
              };
            },
          },
          {
            type: 'select',
            name: 'justifyContent',
            label: '横向位置',
            props: {
              options: [
                { label: '左侧', value: 'flex-start' },
                { label: '居中', value: 'center' },
                { label: '右侧', value: 'flex-end' },
              ],
            },
          },
          {
            type: 'select',
            name: 'alignItems',
            label: '纵向位置',
            props: {
              options: [
                { label: '顶部', value: 'flex-start' },
                { label: '居中', value: 'center' },
                { label: '底部', value: 'flex-end' },
              ],
            },
          },
          { type: 'number', name: 'letterSpacing', label: '文字间隔', props: { unit: 'px' } },
        ],
      },
      {
        type: 'collapse',
        name: 'link',
        props: { label: '超链接' },
        children: [
          { type: 'textarea', name: 'url', label: '地址' },
          { type: 'switch', name: 'isBlank', label: '新窗口打开' },
        ],
      },
    ],
  },
  staticData: [
    {
      content: '',
    },
  ],
};

export default config;
