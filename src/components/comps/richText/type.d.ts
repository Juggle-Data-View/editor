interface Rich {
  id: string;
  title: string;
  style: React.CSSProperties;
  marginLeft: number;
  marginRight: number;
  isWrap: boolean;
  img: Img;
  link: {
    url: string;
    isBlank: boolean;
  };
}

export interface Img {
  imgUrl: string;
  marginTop: number;
  marginLeft: number;
  marginRight: number;
  width: number;
  height: number;
  position: string;
}

export interface Config {
  textAlign: React.CSSProperties['textAlign'];
  writingMode: React.CSSProperties['writingMode'];
  columns: Rich[];
}

export interface Data {
  /**
   * 注意：
   * `dataConfig.filedMap.compFieldName`的值对应了这里的`value`
   */
  value1: string;
  value2: string;
  value3: string;
}

export type IIndex = AutoDV.CompIndex<Config, Data[]>;

export type IConfig = AutoDV.CompConfig<Config>;
