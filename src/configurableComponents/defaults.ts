import { JuggleDV } from '@juggle-data-view/types';
import { DataSourceType } from './const';
/**
 * 默认数据
 */

export const defaultCompData: JuggleDV.Comp = {
  alias: '',
  compCode: '',
  version: '',
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
    dataSourceType: DataSourceType.Static,
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

export const defaultRect: JuggleDV.Rect = {
  left: 0,
  top: 0,
  width: 0,
  height: 0,
};
