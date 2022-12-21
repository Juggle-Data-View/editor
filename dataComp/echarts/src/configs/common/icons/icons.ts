import styled from 'styled-components';

export interface IItem {
  /** 名称 */
  name: string;
  /** icon的路径是相对于icon当前目录下index文件 */
  icon: string;
  /** 使用的值 */
  value: 'none' | 'circle' | 'rect' | 'roundRect' | 'triangle' | 'diamond' | 'pin' | 'arrow' | 'none';
}

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

export const svgItems: IItem[] = [
  { name: '无', icon: '', value: 'none' },
  { name: '圆形', icon: './icon01.svg', value: 'circle' },
  { name: '矩形', icon: './icon02.svg', value: 'rect' },
  { name: '圆角矩形', icon: './icon03.svg', value: 'roundRect' },
  { name: '三角形', icon: './icon04.svg', value: 'triangle' },
  { name: '钻石', icon: './icon05.svg', value: 'diamond' },
  { name: 'pin', icon: './icon06.svg', value: 'pin' },
  { name: '箭头', icon: './icon07.svg', value: 'arrow' },
];

export const SVGDropDownStyled = styled.div`
  .dropdown-item,
  .dropdown-list-item {
    padding: 0 30px 0 10px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 30px;
  }
  .dropdown-list-item {
    padding: 0 22px 0 10px;
    &.--selected,
    &:hover {
      background-color: #eee;
    }
  }
  .icon svg {
    fill: currentColor;
    width: 10px;
    height: 10px;
    color: #fff;
  }
`;
