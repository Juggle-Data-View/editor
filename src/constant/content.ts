const content = {
  back: ['后退', 'back'],
  forward: ['前进', 'forward'],
  history: ['历史记录', 'history'],
  confirm: ['确定', 'confirm'],
  cancel: ['取消', 'cancel'],
  export: ['导出', 'export'],
  import: ['导入', 'import'],
  exportAll: ['导出全部', 'export all'],
  preview: ['预览', 'preview'],
  library: ['组件库', 'library'],
  add: ['增加', 'add'],
  delete: ['删除', 'delete'],
  group: ['分组', 'group'],
  ungroup: ['解除分组', 'ungroup'],
  top: ['置顶', 'top'],
  bottom: ['置底', 'bottom'],
  moveUp: ['上移', 'moveUp'],
  moveDown: ['下移', 'moveDown'],
  lock: ['锁定', 'lock'],
  unlock: ['解锁', 'unlock'],
  hidden: ['隐藏', 'hidden'],
  visible: ['可见', 'visible'],
};

type Keys = keyof typeof content;

type LanguageType = { [key in Keys]: string };

const Language = ((language: 'Chinese' | 'English') => {
  return (Object.keys(content) as Keys[]).reduce<LanguageType>(
    (prev: LanguageType, current: Keys) => ({
      ...prev,
      [current]: content[current][language === 'Chinese' ? 0 : 1],
    }),
    {} as LanguageType
  );
})('Chinese');

export default Language;
