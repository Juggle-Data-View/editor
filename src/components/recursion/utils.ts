import { INodeConfig } from 'auto-dv-type/src/form';
import { set, toPath } from 'lodash';

/**
 * 根据 path 处理 name 的路径
 * @param name 配置项中的name字段，用 "." 分隔开
 * @param path 路径
 * Example:
 *  resolveName('a.b.c', './d/e');      // "a.b.c.d.e"
 *  resolveName('a.b.c', '/d/e');       // "a.b.c.d.e"
 *  resolveName('a.b.c', 'd/e');        // "a.b.c.d.e"
 *  resolveName('a.b.c', '#/d/e');      // "d.e"
 *  resolveName('a.b.c', '../d/e');     // "a.b.d.e"
 *  resolveName('a.b.c', '../../d/e');  // "a.d.e"
 *  resolveName('a.b.c', '../../');     // "a"
 */
export const resolveName = (name: string, path: string): string => {
  const arrPath = path.split('/');
  const newPath = toPath(name); // name是一串用 "." 分隔的路径
  if (arrPath.length) {
    arrPath.forEach((str) => {
      // 处理 "/a/b" 、 "a//b/c" 、 "./a/b" 的情况
      if (!str || str === '.') return;

      // 如果匹配的`path`中包含`[]`结尾的字符串，替换为空
      // 这种匹配方式是为了初始化数据时设置默认值
      str = str.replace(/\[\]$/g, '');

      switch (str) {
        case '#': // 绝对路径
          newPath.length = 0;
          break;
        case '..': // 向上回退
          newPath.length = Math.max(newPath.length - 1, 0);
          break;
        default:
          newPath.push(str);
          break;
      }
    });
  }
  return newPath.join('.');
};

/**
 * config to node
 * 统一config的入口格式
 * @param config 配置项
 */
export function c2n(config: INodeConfig | INodeConfig[]): INodeConfig {
  return Array.isArray(config) ? { type: 'fragment', name: '', children: config } : config;
}

/**
 * 根据配置信息转换为包含值的对象，值来自对象的default字段
 * @param config
 */
export function getDefaultValues(config: INodeConfig | INodeConfig[]) {
  const data = {};
  const process = (node: INodeConfig, parentName: string) => {
    // 如果当前节点的name匹配的是`[]`，需要将name匹配成第0项
    const _name = node.name.replace(/\[\]$/g, '[0]');
    const fullyName = resolveName(parentName, _name);
    if (node.children) {
      node.children.forEach((node) => process(node, fullyName));
    } else {
      const defaultValue = typeof node.default !== 'undefined' ? node.default : '';
      set(data, fullyName, defaultValue);
    }
  };
  process(c2n(config), '');
  return data;
}
