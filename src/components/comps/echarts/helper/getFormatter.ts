import day from 'dayjs';
import numeral from 'numeral';
import notice from 'utils/notice';

const getFormatter = (formatter: string) => {
  try {
    if (typeof formatter === 'function') {
      return formatter;
    }
    // const formatterFunc: any = ''; //eslint-disable-line
    const formatterFunc = new Function(`try{ return ${formatter}} catch(error){console.log(error); throw ''}`); //eslint-disable-line
    if (typeof formatterFunc !== 'function') {
      return formatter;
    }
    return (data: any) => formatterFunc()(data, { day, numeral });
  } catch (error) {
    notice.error(error.message);
  }
};

export default getFormatter;
