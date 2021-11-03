/**
 * 组件属性类型
 * 1. 定义所有模板配置的类型
 * 2. 导出 Index.tsx、Props.tsx 组件props的类型
 * @创建时间 2020-07-23 17:23:04
 */

/**
 * Step1: 声明组件模板配置的类型
 */
export interface Config extends AutoDV.Config {
  url: string;
  isAuto: boolean;
  isLoop: boolean;
  isMute: boolean;
}

/**
 * Step2: 声明数据源数据类型
 * 如果组件没有数据，可不用声明
 */
export interface SourceData {
  /** 注意：`value` 对应了 `dataConfig.filedMap.compFieldName` 的值 */
  url: string;
}

// for Index.tsx
export type IIndex = AutoDV.CompIndex<Config, SourceData[]>;

// for temps/{config}.ts
export type IConfig = AutoDV.CompConfig<Config>;
