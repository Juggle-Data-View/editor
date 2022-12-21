const getSeriesFieldName = (lastFieldName: string) => {
  const regx = /\d+/;
  if (!lastFieldName) {
    return '';
  }
  const result = lastFieldName.match(regx);
  if (result) {
    return `y${Number(result[0]) + 1}`;
  } else {
    return `${lastFieldName}0`;
  }
};

export default getSeriesFieldName;
