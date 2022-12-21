/**
 * 格式化 工具
 */
import numeral from 'numeral';

type Func = (num: number, isThousand?: boolean, isDecimal?: boolean) => string;

/**
 * 转换数字为 千分位 或 含小数点 的字符串.
 *
 * 默认都转换。
 */
export const num2ThousandOrDecimal: Func = (num, isThousand = true, isDecimal = true) => {
  let formater = '';
  const str = isThousand.toString() + ',' + isDecimal.toString();
  switch (str) {
    case 'true,true':
      formater = '0,0.[00]';
      break;
    case 'true,false':
      formater = '0,0';
      break;
    case 'false,false':
      formater = '00';
      break;
    case 'false,true':
      formater = '0.[00]';
      break;
    default:
      formater = '0.[00]';
  }

  return numeral(num).format(formater);
};
