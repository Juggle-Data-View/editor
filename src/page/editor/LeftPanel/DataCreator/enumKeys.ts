interface EnumKeysReturnType {
  path: string;
  value: any;
  level: number;
}
const enumKeys = (obj: any, result = [] as EnumKeysReturnType[]) => {
  const travel = (obj: any, path = '', level = 0): any => {
    if (Array.isArray(obj)) {
      result.push({
        path,
        value: obj,
        level: level,
      });
      return obj.forEach((item, index) => {
        return travel(item, path + `[${index}]`, level + 1);
      });
    }

    if (typeof obj === 'object') {
      result.push({
        path,
        value: obj,
        level: level,
      });
      return Object.keys(obj).forEach((key) => {
        return travel(obj[key], path + `.${key}`, level + 1);
      });
    }

    result.push({
      path,
      value: obj,
      level: level,
    });
  };
  return travel(obj);
};

export default enumKeys;
