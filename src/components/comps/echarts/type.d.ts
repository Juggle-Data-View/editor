import { AutoDV } from 'auto-dv-type';
/**
 * 组件属性类型
 * @创建时间 2020-06-30 9:00:00
 */

/**
  option: { echarts: any; };
 * Step1: 声明组件模板配置的类型
 */
export interface Config extends AutoDV.Config, EchartsOption {}

// for Index.tsx
export type IIndex = AutoDV.CompIndex<Config>;

// for temps/{config}.ts
export type IConfig = AutoDV.CompConfig<Config>;
