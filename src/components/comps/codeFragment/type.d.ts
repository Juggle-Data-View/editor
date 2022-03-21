import { AutoDV } from 'auto-dv-type';
/**
 * 组件属性类型
 * 1. 定义所有模板配置的类型
 * 2. 导出 Index.tsx、Props.tsx 组件props的类型
 * @创建时间 2020-05-14 15:40:36
 */

// 导入React，子类型可能会用到React中的类型

/**
 * Step1: 声明组件模板配置的类型
 */
export interface Config extends AutoDV.Config {
  style: React.CSSProperties;
  option: {
    html: string;
    css: string;
  };
  placeholder: {
    size: number;
    color: string;
  };
}

// for Index.tsx
export type IIndex = AutoDV.CompIndex<Config>;

// for temps/{config}.ts
export type IConfig = AutoDV.CompConfig<Config>;
