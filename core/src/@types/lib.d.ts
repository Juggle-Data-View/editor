declare module 'codemirror';
declare module 'jsonlint-mod';
declare module 'react-linear-gradient-picker';
declare module 'react-simple-flex-grid';

// 在 Array 原型上扩展自定义方法
interface Array<T> {
  /**
   * 获取`sourceData`数组第`0`个对象key对应的value值，取不到就取传入的`subValue`
   * @param key `sourceData`数组对象的`key`
   * @param subValue 替补值
   */
  getSourceDataValue(key: keyof T, subValue?: any): any;
}

interface RouterParams {
  userPage: 'auth' | 'profile';
  page: 'user' | 'canvas';
}
