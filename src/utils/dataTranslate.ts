/**
 * 数据转换纯函数.
 * 将服务端下发数据通过`fieldMap`加工后生成新的数据供业务组件使用。
 * 转换公式：`sourceData = fn(originData, fieldMap)`
 */
import { JuggleDV } from '@juggle-data-view/types';

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

/** Read a field. Dotted paths use lodash get; a plain key stays a direct lookup. */
const readField = (sourceItem: any, path: string) => {
  if (!path) {
    return undefined;
  }
  if (sourceItem && Object.prototype.hasOwnProperty.call(sourceItem, path)) {
    return sourceItem[path];
  }
  return get(sourceItem, path);
};

/**
 * `payments.recent_mainnet[].network` selects each row of that array.
 * A plain path (`corpus.papers`) reads one field, including dotted paths.
 */
const listPathOf = (fieldMap: JuggleDV.Field[]) => {
  const marked = fieldMap.find((field) => String(field.sourceFieldName).includes('[]'));
  if (!marked) {
    return '';
  }
  return String(marked.sourceFieldName).slice(0, String(marked.sourceFieldName).indexOf('[]')).replace(/\.$/, '');
};

const fieldOnRow = (sourceFieldName: string) => {
  const mark = sourceFieldName.indexOf('[]');
  if (mark === -1) {
    return sourceFieldName;
  }
  return sourceFieldName.slice(mark + 2).replace(/^\./, '');
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
  const result = isPlainObject(data) ? [data] : data;
  // 保证输出的值一定为数组
  return !Array.isArray(result) ? [] : result;
};

/**
 * 通过`fieldMap`的映射关系，将服务端下发数据转换为组件可用的数据
 * @param data 服务端下发数据(originData) 或 静态数据源数据(mockData)
 * @param fieldMap 数据源字段映射关系
 * @return {any[]}
 */
const dataTranslater = (data: any, fieldMap: JuggleDV.Field[]) => {
  if (!fieldMapFormatVerify(fieldMap)) {
    return [];
  }
  const listPath = listPathOf(fieldMap);
  const rows = listPath
    ? decorateData2array(get(Array.isArray(data) ? data[0] : data, listPath))
    : decorateData2array(data);
  return rows.map((item: any) => {
    return fieldMap.reduce((acc: any, field) => {
      acc[field.compFieldName] = readField(item, fieldOnRow(field.sourceFieldName));
      return acc;
    }, Object.create(null));
  });
};

/**
 * 将数据源组组件的原始数据转换成当前组件使用的原始数据
 * @param jsonMap json源转换的辅助结构
 * @param originData 数据源组组件的原始数据
 */
export const translateFromAux = (jsonMap: JuggleDV.Field[], originData: any) => {
  const restult: any = {};
  for (const item of jsonMap) {
    const { sourceFieldName, compFieldName } = item;
    const value = get(originData, sourceFieldName);
    restult[compFieldName] = value;
  }
  return restult;
};

export default dataTranslater;
