const reg = /\[\S*?\]/;

const isArray = (item: string) => {
  return reg.test(item);
};

const setValueByModel = (model: string, obj: any, value: any) => {
  const modelArr = model.split('.');
  modelArr.forEach((item, index) => {
    if (index === modelArr.length - 1) {
      obj[item] = value;
      return;
    }
    if (obj[item]) {
      console.log(item.match(reg));
      obj = obj[item.replace(reg, '')];
    } else {
      if (isArray(item)) {
        obj = [];
      } else {
        obj = {};
      }
    }
  });
};

export default setValueByModel;
