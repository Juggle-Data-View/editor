import { diff } from 'deep-diff';
import { set } from 'lodash';

/**
 * 根据Diff信息，返回第一层的payload信息
 * @param lhs
 * @param rhs
 */
export function getDiffPayload<T = any>(lhs: T, rhs: T) {
  const diffs = diff(lhs, rhs);
  if (!diffs) {
    return null;
  }
  const temp = {};
  diffs.forEach(({ path }) => {
    if (path && Array.isArray(path) && path.length) {
      set(temp, path, {});
    }
  });
  return (Object.keys(temp) as Array<keyof T>).map((key) => {
    return {
      key,
      value: rhs[key],
    };
  });
}
