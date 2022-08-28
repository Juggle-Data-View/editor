const getFormatBody = (value: string) => {
  try {
    if (typeof value === 'object') {
      return value;
    }

    const func = new Function(`return ${value}`)(); //eslint-disable-line

    if (typeof func === 'function') {
      return value;
    }
    if (typeof func === 'object') {
      return func;
    }
  } catch (error) {
    console.log(error);
    throw new Error('Data body has error');
  }
};

export default getFormatBody;
