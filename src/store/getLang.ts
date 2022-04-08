import { JuggleDV } from '@juggle-data-view/types';
const zh: ALang = {
  createComp: '新建组件',
  deleteComp: '删除组件',
  updateComp: '更新组件',
  renameComp: '重名组件',
  moveComp: '移动组件',
  sortComp: '排序组件',
  copy: '复制',
  lock: '锁定',
  hidden: '隐藏',
  downOne: '下移一层',
  upOne: '上移一层',
  goTop: '置顶',
  goBottom: '置底',
  group: '分组',
  unGroup: '取消分组',
  createDatasource: '新建数据源',
  updateDatasource: '更新数据源',
  deleteDatasource: '删除数据源',
  previewDatasource: '预览数据源',
  fieldMap: '字段映射',
  export: '导出',
  exportAll: '导出全部',
  globalSetting: '全局设置',
  preview: '预览',
  scale: '缩放',
  suit: '自适应',
  suitWidth: '宽度自适应',
  suitHeight: '高度自适应',
  cover: '全屏铺满',
  history: '历史记录',
  undo: '上一步',
  redo: '下一步',
  clearAuxLine: '清除参考线',
  showAuxLIne: '展示参考线',
  refreshComp: '更新组件版本',
  layerList: '图层列表',
  datasourcesList: '数据源',
  import: '导入',
};

const en: ALang = {
  createComp: 'New Comp',
  deleteComp: 'Delete component',
  updateComp: 'Update component',
  renameComp: 'Rename component',
  moveComp: 'Move component',
  sortComp: 'Sort component',
  copy: 'copy',
  lock: 'lock',
  hidden: 'hidden',
  downOne: 'Move down one level',
  upOne: 'Move up one level',
  goTop: 'Top',
  goBottom: 'Bottom',
  group: 'Group',
  unGroup: 'Cancel group',
  createDatasource: 'Create datasource',
  updateDatasource: 'Update datasource',
  deleteDatasource: 'Delete datasource',
  previewDatasource: 'Preview datasource',
  fieldMap: 'Fileds mapping',
  export: 'Export',
  exportAll: 'Export all',
  globalSetting: 'Global setting',
  preview: 'preview',
  scale: 'scal',
  suit: 'auto suit',
  suitWidth: 'Width adaption',
  suitHeight: 'Height adaption',
  cover: 'Cover',
  history: 'History',
  undo: 'undo',
  redo: 'redo',
  clearAuxLine: 'Clear aux line',
  showAuxLIne: 'Show aux line',
  refreshComp: 'Update component version',
  layerList: 'Layer List',
  datasourcesList: 'data list',
  import: 'import',
};

const getLang = (lang: JuggleDV.Editor['lang']) => {
  switch (lang) {
    case 'zh':
      return zh;

    default:
      return en;
  }
};

export default getLang;
