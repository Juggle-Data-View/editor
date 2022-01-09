/**
 * 数据源参数 组件
 */

import React, { useEffect } from 'react';
import styled from 'styled-components';
import * as Api from 'utils/api';
import { Button, ControlGroup } from '@blueprintjs/core';
import { FieldLabel } from 'components/form';
import { useFormikContext } from 'formik';
import { useRequest } from 'ahooks';
import { HttpMethod } from 'config/const';

const ParamKeyButton = styled(Button)`
  flex: none !important;
  > span {
    display: block;
    text-align: center;
    min-width: 70px;
    max-width: 120px;
    text-overflow: ellipsis;
    overflow: hidden;
  }
`;

/**
 * 取出dataParams的值 + params的key，合并新的params
 * @param params 数据源信息config下的params字段
 * @param dataParams dataConfig下的dataParams字段
 */
const mergeParams = (params: string[], dataParams: AutoDV.DataParam[]) => {
  return params.map((p) => {
    const item = dataParams.find((dp) => dp.name === p);
    return {
      name: p,
      value: item ? item.value : '',
    };
  });
};

/**
 * 比较`params`的值是否与`dataParams`的`name`匹配
 */
const equalParams = (params: string[], dataParams: AutoDV.DataParam[]) => {
  const _params = dataParams.map((obj) => obj.name);
  // dataParams是根据params生成的 所以可以使用toString判断
  return params.toString() === _params.toString();
};

// const InputWithTooltips = ({ name }: { name: string }) => {
//   const [field] = useField(name);
//   const getIntent = (value: string): Intent => {
//     if (!autoDVEvent.isEventVar(value)) return 'none';
//     return autoDVEvent.hasTrigger(value.slice(1)) ? 'success' : 'danger';
//   };
//   const validate: FieldValidator = (value) => {
//     return getIntent(value) !== 'danger' ? undefined : '变量未设置，请先创建再使用';
//   };

//   const err = getIntent(field.value) === 'danger';
//   const intent = getIntent(field.value);

//   if (typeof field.value === 'undefined') {
//     return null;
//   }

//   return (
//     <Tooltip isOpen={err} content="变量未设置，请先创建再使用" intent={intent}>
//       <Control.InputText name={name} muiProps={{ fill: true, intent }} useMeta={false} validate={validate} />
//     </Tooltip>
//   );
// };
interface IBaseParams {
  paramNames: string[];
  dataParams: AutoDV.DataParam[];
  dataParamsName: string;
}

/**
 * TODO: 逻辑很怪，还是要修改
 */
export const BaseParams = (props: IBaseParams) => {
  const { paramNames, dataParams, dataParamsName } = props;
  const { setFieldValue, isSubmitting } = useFormikContext();

  useEffect(() => {
    // 如果params和dataParams几乎相同，就不更新
    if (!equalParams(paramNames, dataParams)) {
      const newDataParams = mergeParams(paramNames, dataParams);
      if (!isSubmitting) {
        setFieldValue(dataParamsName, newDataParams);
      }
    }
  }, [paramNames, isSubmitting]); // eslint-disable-line

  return (
    <FieldLabel label="参数">
      {dataParams.map((item, index) => {
        return (
          <ControlGroup key={item.name} style={{ marginBottom: 5 }} fill={true}>
            <ParamKeyButton text={item.name} />
            {/* <InputWithTooltips name={`${dataParamsName}[${index}].value`} /> */}
          </ControlGroup>
        );
      })}
    </FieldLabel>
  );
};

interface ApiParamsProps {
  dataSourceId: AutoDV.DataSourceId;
  children: (params: string[]) => JSX.Element;
}

const fetchParams = async (dataSourceId: AutoDV.DataSourceId) => {
  try {
    if (!dataSourceId) return [];
    const res = await Api.fetchDataSourceDetail(dataSourceId);

    // 如果传入了错误的 dataSourceId，返回的数据中是没有res的
    if (!res || !res.config) throw new Error('没有找到数据源信息');

    const { config, apiType } = res;

    // 判断是否使用jsonParam处理参数
    // 优先判断jsf和apiType的原因是存量数据在这个函数一定会返回false，使用params处理
    const hasJsonParam = () => {
      // 如果是jsf协议
      if (apiType === 2) return true;
      // 如果是http 且 为post方法时
      if (apiType === 1 && config.method === HttpMethod.POST) {
        return true;
      }
      return false;
    };

    if (hasJsonParam()) {
      return matcher(/\$\{(\w+)\}/g, config.jsonParam || '');
    }

    /**
     * 1. 获取动态参数名
     * 2. 清空动态参数名中 [""] 这样的值
     */
    if (config.method === HttpMethod.GET && Array.isArray(config.params)) {
      return config.params.filter((p: string) => p && p.length);
    }
    return [];
  } catch (error) {
    throw error;
  }
};

export const ApiParams = (props: ApiParamsProps) => {
  const { dataSourceId, children } = props;
  const { data: params } = useRequest(() => fetchParams(dataSourceId), {
    refreshDeps: [dataSourceId],
    initialData: [],
  });

  if (!params || !params.length) {
    return null;
  }

  return children(params);
};

/**
 * string to array
 *
 * ```
 * matcher(/\$\{(\w+)\}/g, '{name: "${name}", age: "${age}"}')
 * => [name, age]
 * ```
 * @param reg like:  /\[:(\w+)\]/g
 * @param str
 */
function matcher(reg: RegExp, str: string) {
  const matches = [];
  let myArray: any;
  while ((myArray = reg.exec(str)) !== null) {
    matches.push(myArray[1]);
  }
  return matches;
}

// const result = matcher(
//   /\$\{(\w+)\}/g,
//   '{"apiName":"getUserInfo","apiGroupName":"ezd-test-api","appToken":"938c3c31d630c6001263d26f0f65bb7d","requestId":"938c3c31d6","params":{"emplyName":"${emplyName}"}}'
// );
// console.log(result);
