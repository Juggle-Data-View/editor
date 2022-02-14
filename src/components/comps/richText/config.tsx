/**
 * 组件配置信息
 */

import * as font from 'config/form/font';
import { IConfig } from './type';
import DropZone from 'components/common/DropZone';
import { nanocode } from 'utils';
import { nanoid } from 'utils/index';

const config: IConfig = {
  version: '1.0.0',
  tab: {
    config: true,
    dataset: true,
  },
  template: {
    title: '富文本',
    attr: {
      left: 0,
      top: 0,
      width: 300,
      height: 72,
      angle: 0,
      scale: [1, 1],
    },
    config: {
      textAlign: 'left',
      writingMode: 'horizontal-tb',
      columns: [
        {
          id: '0',
          title: '富文本',
          marginLeft: 0,
          marginRight: 0,
          isWrap: false,
          style: {
            color: '#fff',
            fontSize: 28,
            lineHeight: 1.5,
            fontFamily: 'FZLTTHJW',
            fontWeight: 'normal',
            letterSpacing: 0,
            textShadow: '',
          },
          img: {
            imgUrl: '',
            marginTop: 0,
            marginLeft: 0,
            marginRight: 0,
            width: 20,
            height: 20,
            position: 'left',
          },
          link: {
            url: '',
            isBlank: false,
          },
        },
        {
          id: '1',
          title: '富文本',
          marginLeft: 0,
          marginRight: 0,
          isWrap: false,
          style: {
            color: '#D72424',
            fontSize: 28,
            lineHeight: 1.5,
            fontFamily: 'FZLTTHJW',
            fontWeight: 'normal',
            letterSpacing: 0,
            textShadow: '',
          },
          img: {
            imgUrl: '',
            marginTop: 0,
            marginLeft: 0,
            marginRight: 0,
            width: 20,
            height: 20,
            position: 'left',
          },
          link: {
            url: '',
            isBlank: false,
          },
        },
        {
          id: '2',
          title: '富文本',
          marginLeft: 0,
          marginRight: 0,
          isWrap: false,
          style: {
            color: '#4A90E2',
            fontSize: 28,
            lineHeight: 1.5,
            fontFamily: 'FZLTTHJW',
            fontWeight: 'normal',
            letterSpacing: 0,
            textShadow: '',
          },
          img: {
            imgUrl: '',
            marginTop: 0,
            marginLeft: 0,
            marginRight: 0,
            width: 20,
            height: 20,
            position: 'left',
          },
          link: {
            url: '',
            isBlank: false,
          },
        },
      ],
    },
    dataConfig: {
      fieldMap: [
        {
          compFieldName: 'value1',
          sourceFieldName: '',
        },
        {
          compFieldName: 'value2',
          sourceFieldName: '',
        },
        {
          compFieldName: 'value3',
          sourceFieldName: '',
        },
      ],
    },
  },
  forms: {
    type: 'fragment',
    name: 'config',
    children: [
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
        type: 'array',
        name: 'columns[]',
        props: ({ getValue, setValue }) => {
          const fieldMapPath = 'dataConfig.fieldMap';
          const fieldMap: any[] = getValue(fieldMapPath);
          const fieldName = ['value', nanoid(4)].join('_');
          return {
            itemTitle: (item, index) => `文本-${index + 1}`,
            label: '系列文本设置',
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
                id: nanocode('id'),
                name: fieldName,
                FieldName: fieldName,
              };
            },
            onDelete: (item, index) => {
              const result = [...fieldMap];
              result.splice(index, 1);
              setValue(fieldMapPath, result);
            },
          };
        },
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
            type: 'number',
            name: 'marginLeft',
            label: '文本左间距',
            props: {
              muiProps: { step: 0 },
            },
          },
          {
            type: 'number',
            name: 'marginRight',
            label: '文本右间距',
            props: {
              muiProps: { step: 0 },
            },
          },
          { type: 'switch', name: 'isWrap', label: '前置换行' },
          {
            type: 'collapse',
            name: 'img',
            props: {
              label: '插入图片',
            },
            children: [
              {
                type: 'fragment',
                name: '',
                label: '上传图片',
                labelProps: {
                  vertical: true,
                  help: <div style={{ width: 160 }}>支持从数据配置中获取图片，优先读取数据配置中url内容。</div>,
                },
                children: [
                  {
                    type: 'component',
                    name: 'imgUrl',
                    props: ({ name }) => {
                      return {
                        render: () => <DropZone name={name} />,
                      };
                    },
                  },
                ],
              },
              { type: 'number', name: 'marginTop', label: '上间距', props: { muiProps: { step: 1 } } },
              { type: 'number', name: 'marginLeft', label: '左间距', props: { muiProps: { step: 1 } } },
              { type: 'number', name: 'marginRight', label: '右间距', props: { muiProps: { step: 1 } } },
              { type: 'number', name: 'width', label: '宽', props: { muiProps: { min: 0, step: 1 } } },
              { type: 'number', name: 'height', label: '高', props: { muiProps: { min: 0, step: 1 } } },
              {
                type: 'select',
                name: 'position',
                label: '插入位置',
                props: {
                  options: [
                    { label: '左侧', value: 'left' },
                    { label: '右侧', value: 'right' },
                  ],
                },
              },
            ],
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
              {
                type: 'text',
                name: 'textShadow',
                label: '文字阴影',
                labelProps: {
                  help: '可以为文字与text-decorations添加多个阴影，阴影值之间用逗号隔开。每个阴影值（如：10px 10px 20px #f00）由元素在X和Y方向的偏移量、模糊半径和颜色值组成。',
                  tipWidth: 180,
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
    ],
  },
  staticData: [
    {
      content: '富文本',
    },
  ],
};

export default config;
