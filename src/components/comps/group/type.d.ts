/**
 * 组件属性类型
 * 1. 定义所有模板配置的类型
 * 2. 导出 Index.tsx、Props.tsx 组件props的类型
 * @创建时间 2020-05-14 15:40:36
 */

// 引入`./templates`目录下的所有配置项
import index from './temps/index';

// 将所有配置项合并为基础配置类型
interface BaseTempsType extends AutoDV.Comp, index {}

export interface Config extends AutoDV.Config {
  // option: {
  groupItemCode: string[];
  // };
}

// for Index.tsx
export type IIndex = AutoDV.CompIndex<Config, any[]>;

// for temps/{config}.ts
export type IConfig = AutoDV.CompConfig<Config>;
