/*
 * @Author: ashes
 * @Date: 2021-09-01 14:51:24
 * @LastEditTime: 2021-09-02 15:27:41
 * @LastEditors: your name
 * @Description: 获取动态参数
 * @FilePath: /autoDV5-react/src/components/views/center/useDynamicParams.ts
 * 可以输入预定的版权声明、个性签名、空行等
 */

import { useEffect, useState } from 'react';

const useDynamicParams = (decoratorObj: any, getData: any, reciver?: AutoDV.Reciver[]) => {
  const [params, setParams] = useState<any>();

  // dynamicParams = decoratorData + handle
  useEffect(() => {
    const { config, decorator } = decoratorObj;
    if (!config || decorator.type !== 'params') {
      setParams(reciver);
      return;
    }
    const { handle, type } = decorator;
    const { dataConfig, code } = config;
    if (dataConfig) {
      getData(code, dataConfig, reciver || [])
        .then((data: any) => {
          setParams(handle(type)(data, reciver) || []);
        })
        .catch((err: any) => {
          console.log('decorator fetch data error:', err);
        });
    } else {
      setParams(handle(type)(reciver) || []);
    }
  }, [decoratorObj, reciver]); // eslint-disable-line

  return params;
};

export default useDynamicParams;
