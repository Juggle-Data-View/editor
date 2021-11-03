export interface Config {
  title: string;
  style: React.CSSProperties;
  link: {
    url: string;
    isBlank: boolean;
  };
}

export interface Data {
  /**
   * 注意：
   * `dataConfig.filedMap.compFieldName`的值对应了这里的`value`
   */
  value: string;
}

export type IIndex = AutoDV.CompIndex<Config, Data[]>;

export type IConfig = AutoDV.CompConfig<Config>;
