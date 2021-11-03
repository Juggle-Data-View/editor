/**
 * Field-level Validation
 */
import { FieldValidator } from 'formik';
import tinycolor from 'tinycolor2';
import { isFinite, isInteger } from 'lodash';

export const validator = {
  required: (v: any) => (v && v.length ? undefined : '字段不能为空'),
  positive: (v: number) => (v < 0 ? '数字不能为负数' : undefined),
  isColor: (v: string) => (tinycolor(v).isValid() ? undefined : `${v}必须是个颜色值`),
  isNumber: (v: any) => (isFinite(v) ? undefined : '必须是数字'),
  // 有效的全局变量
  isValidVar: (v: any) =>
    /^[:a-zA-Z0-9_-]{1,32}$/.test(v) ? undefined : '只能包含字母、数字、下划线(_)，中线(-)且长度不超过32个字符',
  isURL: (v: any) => {
    const pattern = new RegExp(
      '^(https?:\\/\\/)?' + // protocol
        '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + // domain name
        '((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ip (v4) address
        '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // port and path
        '(\\?[;&a-z\\d%_.~+=-]*)?' + // query string
        '(\\#[-a-z\\d_]*)?$',
      'i'
    );
    return !!pattern.test(v) ? undefined : '不是一个有效的URL';
  },
  isFieldName: (v: any) =>
    /^[a-zA-Z0-9_-]{1,10}$/.test(v) ? undefined : '只能包含字母、数字、下划线(_)、中线(-)，且长度不超过10个字符',

  range: (range: [number, number]) => (v: number) => v >= range[0] && v <= range[1] ? undefined : '超出范围限制',
  maxLength: (len: number) => (v: string) => v && v.length > len ? `字符串长度超过${len}个` : undefined,
  min: (n: number) => (v: number) => v < n ? `数值不能小于${n}` : undefined,
  max: (n: number) => (v: number) => v > n ? `数值不能大于${n}` : undefined,
  isInteger: (n: number) => (isInteger(n) ? undefined : '数值必须为整数'),
};

/**
 * 合并校验函数，可以批量处理
 */
export const validateMerge = (validator: (FieldValidator | undefined)[]) => {
  return (value: any) => {
    const fn = async () => {
      let r = undefined;
      for (const v of validator) {
        if (!v) continue;
        if (typeof r !== 'undefined') break;
        r = await v(value);
      }
      return r;
    };
    return fn().then((res) => res);
  };
};
