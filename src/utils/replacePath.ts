const replacePath = (source: string, target: string) => {
  const sourceArr = source.split('.');
  const targetArr = target.split('.');
  const reg = /{\S*?}/;
  return targetArr
    .map((item, index) => {
      if (reg.test(item)) {
        const sourceItemIndex = item.search(reg);
        item = item.replace(reg, sourceArr[index][sourceItemIndex]);
      }
      return item;
    })
    .join('.');
};
export default replacePath;
