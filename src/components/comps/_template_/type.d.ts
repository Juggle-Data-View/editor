/**
 * 组件类型定义
 * @author TEMPLATE_AUTHOR
 * @createTime TEMPLATE_CREATED_TIME
 */

interface Config extends AutoDV.Config {
  placeholder: {
    size: number;
    color: string;
  };
  text: {
    content: string;
    style: React.CSSProperties;
  };
}

type SourceData = Array<{
  /** 注意：此处的`value`对应`compFieldName`的值 */
  value: string;
}>;

// for Index.tsx
export type IIndex = AutoDV.CompIndex<Config, SourceData>;

// for
export type IConfig = AutoDV.CompConfig<Config>;
