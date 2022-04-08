/*
 * @Author: ashes
 * @Date: 2021-02-23 10:49:21
 * @LastEditTime: 2021-09-02 15:28:45
 * @LastEditors: your name
 * @Description:
 * @FilePath: /autoDV5-react/src/utils/getDecoration.ts
 * 可以输入预定的版权声明、个性签名、空行等
 */
/**
 * 2020-09-17
 * author: dushihua2
 * description: Getting component decoration,if the component have a decoration
 */

import notice from './notice';
import { JuggleDV } from '@juggle-data-view/types';

/**
 * get component decoration that is first matched
 * @param code component code
 * @param type 装饰器类型
 */
const getDecoration = (comps: JuggleDV.Comp[], code: string) => {
  const codes = comps.map((comp) => comp.code);
  const datas = comps.reduce((acc: { [code: string]: JuggleDV.Comp }, comp) => {
    acc[comp.code] = comp;
    return acc;
  }, {});
  const decorationId: any = codes
    .filter((code) => code.indexOf('decoration') === 0)
    .find((_code) => (datas[_code].config as any).connectionIds.includes(code));

  const decoration: JuggleDV.Comp<any> | undefined = decorationId ? datas[decorationId] : undefined;
  const handle = decoration ? decoration.config.handle : undefined;

  return handle && decoration
    ? {
        handle: (type: 'data' | 'config' | 'ui' | 'params' = 'data') => {
          try {
            return handle ? new Function(`return ${handle[type]}`)() : undefined; //eslint-disable-line
          } catch (error) {
            notice.error('装饰器编写错误');
            console.warn(error);
            return undefined;
          }
        },
        decoratorId: decoration.code,
        type: decoration.config.type,
      }
    : undefined;
};

export default getDecoration;
