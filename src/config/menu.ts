export type Comp = {
  alias: string;
  thumbnail: string;
  keywords?: string[]; // 可被搜索的关键词

  // 无需设置，程序自动生产
  categoryIcon?: string;
};

export type Group = {
  alias: string;
  compIds: string[];
};

export type Category = {
  alias: string;
  icon: string;
  groups: Record<string, Group>;
};

export type Menu = {
  [key: string]: Category;
};

const menu: Menu = {
  echarts: {
    alias: '图表',
    icon: 'chart',
    groups: {
      bar: {
        alias: '柱状图',
        compIds: [
          'base_bar',
          'multi_bar',
          'line_bar',
          'double_axis_line_bar',
          'horizontal_bar',
          'horizontal_bar_negative',
        ],
      },
      line: {
        alias: '折线图',
        compIds: ['base_line', 'multi_line'],
      },

      list: {
        alias: '列表',
        compIds: ['table/index'],
      },
      pie: {
        alias: '饼图',
        compIds: ['pie'],
      },
      else: {
        alias: '其他',
        compIds: ['radar', 'funnel', 'treeMap'],
      },
    },
  },
  text: {
    alias: '文本',
    icon: 'autoDV-text',
    groups: {
      text: {
        alias: '文本',
        compIds: ['commonTitle/index'],
      },
    },
  },
};

export default menu;
