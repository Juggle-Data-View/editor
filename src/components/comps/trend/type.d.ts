/**
 * 组件类型 声明文件.
 * 1. 声明 Index.tsx config.tsx 组件的属性类型
 * 2. 声明 组件模板 配置项 类型，可约束 Index.tsx 中的 compData 类型
 * 3. 声明 组件数据源 的数据类型
 *
 * @author longchan
 * @createTime 2020-08-19 12:49:50
 */
import { LimitTrigger } from 'config/form/limitTrigger';

/**
 * Step1: 声明组件模板配置的类型
 */
export interface Config extends AutoDV.Config {
  global: {
    align: React.CSSProperties['justifyContent'];
    layout: React.CSSProperties['flexDirection'];
    gap: number;
  };
  icon: {
    /**
     * 图标地址使用相对路径，相对的是：assets/svg/trend
     * 如：./icon05.svg
     */
    name: string;
    size: number;
  };
  color: {
    up: string;
    equal: string;
    down: string;
  };
  number: {
    base: number;
    prefix: string;
    suffix: string;
    isThousands: boolean;
    isIconColor: boolean;
    textStyle: React.CSSProperties;
    formatter: string;
  };
  limitOption: LimitTrigger;
}

/**
 * Step2: 声明数据源数据类型
 * 如果组件没有数据，可不用声明
 */
export interface SourceData {
  /** 注意：`value` 对应了 `dataConfig.filedMap.compFieldName` 的值 */
  value: number;
  base: number;
}

export interface DropDownItem {
  /** icon的路径是相对于icon当前目录下index文件 */
  icon: string;
}

// for Index.tsx
export type IIndex = AutoDV.CompIndex<Config, SourceData[]>;

// for config.ts
export type IConfig = AutoDV.CompConfig<Config>;
