/**
 * 数据转换纯函数.
 * 将服务端下发数据通过`fieldMap`加工后生成新的数据供业务组件使用。
 * 转换公式：`sourceData = fn(originData, fieldMap)`
 */

import { get, isPlainObject } from 'lodash';

/**
 * 获取`sourceData`数据
 * 使用方法：sourceData.getSourceDataValue()
 * defaultValue: 取不到时使用的值
 */
// eslint-disable-next-line
Array.prototype.getSourceDataValue = function (key, defaultValue) {
  if (this.length && this[0] && typeof this[0][key] !== 'undefined') {
    return this[0][key];
  }
  return defaultValue;
};

const fieldMap2Obj = (fieldMap: AutoDV.Field[]) => {
  return fieldMap.reduce((acc: any, cur) => {
    acc[cur.compFieldName] = cur.sourceFieldName;
    return acc;
  }, Object.create(null));
};

/**
 * 以`fieldMap`为标准，重组对象
 * @param sourceItem {label: "item-1", value: 1}
 * @param fieldMap {option: "label", value: "value"}
 * @return {object}  {option: "item-1", value: 1 }
 */
const getFieldValue = (sourceItem: any, fieldMap: any) => {
  return Object.keys(fieldMap).reduce((acc: any, cur: any) => {
    acc[cur] = sourceItem[fieldMap[cur]];
    return acc;
  }, Object.create(null));
};

const fieldMapFormatVerify = (fieldMap: any) => {
  if (!Array.isArray(fieldMap)) {
    console.warn('fieldMap is not Array');
    return false;
  }

  if (fieldMap.length < 1) {
    console.warn('fieldMap was empty');
    return false;
  }

  const isFormat = fieldMap
    .map((item) => (item ? 'compFieldName' in item && 'sourceFieldName' in item : false))
    .reduce((prev, next) => next && prev);

  if (!isFormat) {
    console.warn('fieldMap formatter was warning');
    return false;
  }
  return true;
};

/**
 * 包装数据，始终返回数组类型的数据
 * @param data 服务端数据 or 静态数据
 */
export const decorateData2array = (data: any) => {
  /**
   * 产品大哥大姐说要支持老系统中对象的接口格式,
   * 先判断接口获取的数据格式，如果是对象，强制戴个帽子+穿个鞋子：👒 + 👠
   */
  const _data = isPlainObject(data) ? [data] : data;
  // 保证输出的值一定为数组
  return !Array.isArray(_data) ? [] : _data;
};

/**
 * 通过`fieldMap`的映射关系，将服务端下发数据转换为组件可用的数据
 * @param data 服务端下发数据(originData) 或 静态数据源数据(mockData)
 * @param fieldMap 数据源字段映射关系
 * @return {any[]}
 */
const dataTranslater = (data: any, fieldMap: AutoDV.Field[]) => {
  if (!fieldMapFormatVerify(fieldMap)) {
    return [];
  }
  return decorateData2array(data).map((item: any) => {
    return getFieldValue(item, fieldMap2Obj(fieldMap));
  });
};

/**
 * 将数据源组组件的原始数据转换成当前组件使用的原始数据
 * @param jsonMap json源转换的辅助结构
 * @param originData 数据源组组件的原始数据
 */
export const translateFromAux = (jsonMap: AutoDV.Field[], originData: any) => {
  const restult: any = {};
  for (const item of jsonMap) {
    const { sourceFieldName, compFieldName } = item;
    const value = get(originData, sourceFieldName);
    restult[compFieldName] = value;
  }
  return restult;
};

export default dataTranslater;
