/**
 * 异步加载组件or数据
 */
import notice from 'utils/notice';
import { AutoDV } from 'auto-dv-type';

/**
 * 异步加载本地静态数据
 * 从`@/components/comps/{comp}/temps/{compTemp}`中加载导出的`staticData`变量
 * @param compCode 组件类型
 * @param compTempCode 组件模板类型
 */
export const asyncLoadStaticData = async (compCode: string, compTempCode: string) => {
  try {
    const res = await import(`components/comps/${compCode}/temps/${compTempCode}`);
    if (res.staticData) {
      if (!Array.isArray(res.staticData)) {
        throw new Error('类型错误，静态数据必须是数组类型');
      }
      return res.staticData;
    } else {
      throw new Error(`请检查temps/${compTempCode}下是否导出了staticData`);
    }
  } catch (error: any) {
    notice.warn(`加载静态数据失败: ${error.message}`);
  }
};

const getConfigName = (compTempCode: string) => {
  if (compTempCode === 'index') {
    return 'config';
  }
  return ['config', compTempCode].join('_');
};

/**
 * 异步加载组件配置
 */
export const asyncLoadCompConfig = async (compCode: string, compTempCode: string): Promise<AutoDV.CompConfig> => {
  try {
    const name = getConfigName(compTempCode);
    const { default: config } = await import(`components/comps/${compCode}/${name}`);
    return config;
  } catch (error) {
    throw error;
  }
};
