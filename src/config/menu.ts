export type Comp = {
  alias: string;
  thumbnail: string;
  keywords?: string[];
  categoryIcon?: string;
};

export type GroupChildren = {
  id: string;
  name: string;
  sanpShotUrl?: string;
  publicPath?: string;
};

export type Group = {
  alias: string;
  children: GroupChildren[];
};

export type Category = {
  alias: string;
  icon: string;
  groups: Record<string, Group>;
};

export type MenuItemKey = 'echarts' | 'text';

export type Menu = {
  [key in MenuItemKey]: Category;
};

const menu: Menu = {
  echarts: {
    alias: 'ECharts图表',
    icon: 'chart',
    groups: {
      bar: {
        alias: '柱状图',
        children: [
          { id: 'base_bar', name: '基础柱状图' },
          { id: 'multi_bar', name: '多系列柱状图' },
          { id: 'line_bar', name: '折线柱状图' },
          { id: 'double_axis_line_bar', name: '双轴折线柱状图' },
          { id: 'horizontal_bar', name: '水平柱状图' },
          { id: 'horizontal_bar_negative', name: '双向柱状图' },
        ],
      },
      line: {
        alias: '折线图',
        children: [
          { id: 'base_line', name: '基础折线图' },
          { id: 'multi_line', name: '多系列折线图' },
        ],
      },

      list: {
        alias: '列表',
        children: [{ id: 'table', name: '基础表格', publicPath: 'table' }],
      },
      pie: {
        alias: '饼图',
        children: [{ id: 'pie', name: '基础饼图' }],
      },
      else: {
        alias: '其他',
        children: [
          { id: 'radar', name: '雷达图' },
          { id: 'funnel', name: '漏斗图' },
          { id: 'treeMap', name: '矩形统计' },
        ],
      },
    },
  },
  text: {
    alias: '文本',
    icon: 'autoDV-text',
    groups: {
      text: {
        alias: '基础文本',
        children: [{ id: 'index', name: '普通文本', publicPath: 'commonTitle' }],
      },
    },
  },
};

export default menu;
