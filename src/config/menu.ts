import { isRelease } from 'utils';
// 独立出一个 menu_dev.json 的文件目的：
// 为了触发 yarn cc 时可对 menu_dev.json 进行修改。
import menu_dev from './menu_dev.json';

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
  groupIds: string[];
  groups: Record<string, Group>;
};

export type Menu = {
  categoryIds: string[];
  categories: Record<string, Category>;
  comps: Record<string, Comp>;
};

const menu: Menu = {
  categoryIds: ['echarts', 'text'],
  categories: {
    echarts: {
      alias: '图表',
      icon: 'chart',
      groupIds: ['bar', 'line', 'list', 'pie', 'else'],
      groups: {
        bar: {
          alias: '柱状图',
          compIds: [
            'echarts/base_bar',
            'echarts/multi_bar',
            'echarts/line_bar',
            'echarts/double_axis_line_bar',
            'echarts/horizontal_bar',
            'echarts/horizontal_bar_negative',
          ],
        },
        line: {
          alias: '折线图',
          compIds: ['echarts/base_line', 'echarts/multi_line'],
        },

        list: {
          alias: '列表',
          compIds: ['table/index'],
        },
        pie: {
          alias: '饼图',
          compIds: ['echarts/pie'],
        },
        else: {
          alias: '其他',
          compIds: ['echarts/radar', 'echarts/funnel', 'echarts/treeMap'],
        },
      },
    },
    text: {
      alias: '文本',
      icon: 'autoDV-text',
      groupIds: ['text'],
      groups: {
        text: {
          alias: '文本',
          compIds: ['commonTitle/index'],
        },
      },
    },
  },
  comps: {
    'echarts/base_bar': {
      alias: '基础柱状图',
      thumbnail: 'https://findicons.com/files/icons/1579/devine/48/file.png',
    },
    'echarts/multi_bar': {
      alias: '多系列柱状图',
      thumbnail: 'https://findicons.com/files/icons/1579/devine/48/file.png',
    },
    'echarts/line_bar': {
      alias: '折线柱状图',
      thumbnail: 'https://findicons.com/files/icons/1579/devine/48/file.png',
    },
    'echarts/double_axis_line_bar': {
      alias: '双轴折线柱图',
      thumbnail: 'https://findicons.com/files/icons/1579/devine/48/file.png',
    },
    'echarts/horizontal_bar': {
      alias: '条形图',
      thumbnail: 'https://findicons.com/files/icons/1579/devine/48/file.png',
    },
    'echarts/horizontal_bar_negative': {
      alias: '双向条形图',
      thumbnail: 'https://findicons.com/files/icons/1579/devine/48/file.png',
    },
    'echarts/base_line': {
      alias: '基础折线图',
      thumbnail: 'https://findicons.com/files/icons/1579/devine/48/file.png',
    },
    'echarts/pie': {
      alias: '环状饼图',
      thumbnail: 'https://findicons.com/files/icons/1579/devine/48/file.png',
    },
    'echarts/multi_line': {
      alias: '多系列折线图',
      thumbnail: 'https://findicons.com/files/icons/1579/devine/48/file.png',
    },

    'table/index': {
      alias: '基础表格',
      thumbnail: 'https://findicons.com/files/icons/1579/devine/48/file.png',
    },

    'echarts/radar': {
      alias: '雷达图',
      thumbnail: 'https://findicons.com/files/icons/1579/devine/48/file.png',
    },
    'echarts/funnel': {
      alias: '漏斗图',
      thumbnail: 'https://findicons.com/files/icons/1579/devine/48/file.png',
    },
    'echarts/treeMap': {
      alias: '矩形树图',
      thumbnail: 'https://findicons.com/files/icons/1579/devine/48/file.png',
    },

    'commonTitle/index': {
      alias: '普通文本',
      thumbnail: 'https://findicons.com/files/icons/1579/devine/48/file.png',
    },
  },
};

if (!isRelease) {
  // 非正式环境的组件菜单抽屉都包含“开发”菜单
  menu.comps = Object.assign({}, menu.comps, menu_dev.entities);
  menu.categoryIds.push('dev');
  menu.categories['dev'] = {
    alias: '开发',
    icon: 'lab-test',
    groupIds: ['default'],
    groups: {
      default: {
        alias: '默认分组',
        compIds: [],
      },
    },
  };
  menu_dev.ids.forEach((id) => {
    menu.categories['dev'].groups['default'].compIds.push(id);
  });
}

export default menu;
