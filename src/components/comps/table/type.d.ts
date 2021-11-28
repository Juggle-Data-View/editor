/**
 * 组件属性类型
 * 1. 定义所有模板配置的类型
 * 2. 导出 Index.tsx、Props.tsx 组件props的类型
 * @创建时间 2020-05-14 15:40:36
 */

// 导入React，子类型可能会用到React中的类型

// 引入`./templates`目录下的所有配置项
import index from './temps/index';
import index2 from './temps/index2';
import { LimitTrigger } from 'config/form/limitTrigger';

// 将所有配置项合并为基础配置类型
interface BaseTempsType extends AutoDV.Comp, index, index2 {}

type SigleSideInterval = 'over' | 'less' | 'noMoreThan' | 'noLessThan' | 'equle';

type DoubleSideInterval = 'close' | 'open' | 'rightOpen' | 'leftOpen';

type IntervalType = SigleSideInterval | DoubleSideInterval;

export interface Trend {
  hasTrend?: boolean;
  icon: string;
  size: number;
  marginRight: number;
  color: {
    up: string;
    equal: string;
    down: string;
  };
  number: {
    base: number;
    suffix: string;
    isThousands: boolean;
    isIconColor: boolean;
  };
}

export interface Global {
  maxNumberOfRow: number;
  fontFamily: string;
  autoScroll: boolean;
  scrollTime: string;
  autoSuitable?: boolean;
  borderStyle: {
    columnBorder: boolean;
    columnBorderColor: string;
    columnBorderWidth: number;
    rowBorder: boolean;
    rowBorderColor: string;
    rowBorderWidth: number;
  };
}

export interface TableHeader {
  lineHeight: number;
  rowHeight: number;
  backgroundColor: string;
  fontFamily: string;
  fontSize: number;
  color: string;
  fontWeight: string;
  justifyContent: string;
  isShow: boolean;
}

export interface Row {
  oddBackgroudColor: string;
  evenBackgroudColor: string;
}

export interface Column {
  name: string;
  columnName: string;
  width: number;
  justifyContent: string;
  whiteSpace: string;
  fontSize: number;
  color: string;
  fontWeight: string;
  fontFamily: string;
  textAlign: string;
  trend: Trend;
  formatter: string;
  limitOption?: LimitTrigger;
}

export interface TableOption {
  global: Global;
  tableHeader: TableHeader;
  column: Column[];
  row: Row;
}

// 如果需要，可以自定义处理类型
interface ITable extends BaseTempsType {
  config: {
    style: React.CSSProperties; // 重新定义 style 类型
    option: TableOption;
  };
}

/**
 * Step1: 声明组件模板配置的类型
 */
export interface Config extends AutoDV.Config {
  style: React.CSSProperties; // 重新定义 style 类型
  option: TableOption;
}

/**
 * Step2: 声明数据源数据类型
 * 如果组件没有数据，可不用声明
 */
export interface SourceData {
  /** 注意：`value` 对应了 `dataConfig.filedMap.compFieldName` 的值 */
  svalue1: string;
  svalue2: string;
}

// for Index.tsx
export type IIndex = AutoDV.CompIndex<Config, SourceData[]>;

// for temps/{config}.ts
export type IConfig = AutoDV.CompConfig<Config>;
