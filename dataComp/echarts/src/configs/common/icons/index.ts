/* eslint-disable @typescript-eslint/no-explicit-any */

/**
 * 返回新对象
 * key => 文件相对路径
 * value => 文件webpack打包后的真实路径
 */
const requireAll: (v: any) => any = (requireContext: any) => {
  const obj: any = {};
  requireContext.keys().forEach((key: string) => (obj[key] = requireContext(key)));
  return obj;
};

/**
 * require.context 参数
 * 1. 要搜索的文件夹目录
 * 2. 是否还应该搜索它的子目录，
 * 3. 以及一个匹配文件的正则表达式。
 */
const svgs = (require as any).context('./', false, /\.svg$/);
const allModels = requireAll(svgs);

const obj = Object.keys(allModels).reduce((acc: any, cur: any) => {
  acc[cur] = allModels[cur].default;
  return acc;
}, {});

/**
 * 返回对象，格式如：
 * ```
 * {
 *   './icon01.svg': '/static/media/icon01.9540e9bc.svg',
 *   './icon02.svg': '/static/media/icon01.1ec88e82.svg',
 *   ...
 * }
 * ```
 * key：当前文件下svg资源的相对路径
 * value：绝对路径
 */
export default obj;
