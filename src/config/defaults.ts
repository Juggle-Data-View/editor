import { AutoDV } from 'auto-dv-type';
/**
 * 默认数据
 */

/**
 * 组件完整配置项，包含所有属性
 * ⚠️ 此对象第1层的 key 是与后端约定形成的，若删减，需与后端协商。
 */
export const defaultCompData: AutoDV.Comp = {
  alias: '',
  compCode: '',
  compTempCode: '',
  title: '',
  createTime: NaN,
  attr: {
    left: 0,
    top: 0,
    width: 0,
    height: 0,
    angle: 0,
    scale: [1, 1],
    lock: false,
    opacity: 1,
  },
  config: {},
  dataConfig: {
    dataSourceId: '',
    fieldMap: [],
    frequency: 1,
    autoRefresh: false,
    sourceData: [],
  },
  code: '',
  locked: false,
  hided: false,
  compThumb: '',
};

export const defaultRect: AutoDV.Rect = {
  left: 0,
  top: 0,
  width: 0,
  height: 0,
};
