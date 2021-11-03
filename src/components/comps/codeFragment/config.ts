import { Config } from './type';

const config: AutoDV.CompConfig<Config> = {
  version: '1.0.0',
  tab: {
    config: true,
    dataset: false,
  },
  template: {
    title: '代码片段',
    attr: {
      left: 0,
      top: 0,
      width: 200,
      height: 200,
      angle: 0,
      scale: [1, 1],
    },
    config: {
      style: {
        color: '#fff',
        fontSize: 100,
        lineHeight: 1.5,
        fontFamily: 'FZLTTHJW',
        fontWeight: 'bold',
      },
      option: {
        html: '<!--code here--> ',
        css: '/** code here*/',
      },
      placeholder: {
        size: 40,
        color: '#fff',
      },
    },
  },
  forms: {
    name: 'config',
    type: 'fragment',
    children: [
      {
        name: 'placeholder',
        type: 'collapse',
        props: {
          label: '占位块设置',
        },
        children: [
          {
            name: 'size',
            type: 'number',
            label: '大小',
            props: {
              bp: {
                min: 0,
              },
            },
          },
          {
            name: 'color',
            type: 'color',
            label: '颜色',
          },
        ],
      },
      {
        name: 'option',
        type: 'fragment',
        children: [
          {
            name: 'html',
            label: 'html 代码片段',
            type: 'formatter',
            labelProps: {
              vertical: true,
            },
            props: {
              codeType: 'htmlmixed',
            },
          },
          {
            name: 'css',
            label: 'css 代码片段',
            type: 'formatter',
            labelProps: {
              vertical: true,
            },
            props: {
              codeType: 'css',
            },
          },
        ],
      },
    ],
  },
};

export default config;
