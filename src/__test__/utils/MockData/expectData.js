export const SublistAccessData = [
  { code: 'commonTitle_9157df' },
  { code: 'commonTitle_3d6872' },
  { code: 'commonTitle_7a3c3d' },
  {
    code: 'group_70b806',
    children: [
      { code: 'commonTitle_25d4b1' },
      { code: 'commonTitle_b7c173' },
      { code: 'commonTitle_6f7972' },
      { code: 'commonTitle_075924' },
      {
        code: 'group_d245cd',
        children: [{ code: 'commonTitle_75db0d' }, { code: 'commonTitle_6ffc63' }, { code: 'commonTitle_2dbb9f' }],
      },
    ],
  },
  { code: 'commonTitle_4f0acb' },
  { code: 'group_2b918d', children: [{ code: 'commonTitle_358d2d' }, { code: 'commonTitle_4836c3' }] },
  { code: 'commonTitle_5ad21d' },
  { code: 'commonTitle_fd092b' },
];

export const SublistFailureData = [
  { code: 'commonTitle_9157df' },
  { code: 'commonTitle_3d6872' },
  { code: 'commonTitle_7a3c3d' },
  { code: 'commonTitle_25d4b1' },
  {
    code: 'group_70b806',
    children: [
      { code: 'commonTitle_b7c173' },
      { code: 'commonTitle_6f7972' },
      { code: 'commonTitle_075924' },
      {
        code: 'group_d245cd',
        children: [{ code: 'commonTitle_75db0d' }, { code: 'commonTitle_6ffc63' }, { code: 'commonTitle_2dbb9f' }],
      },
    ],
  },
  { code: 'commonTitle_4f0acb' },
  { code: 'group_2b918d', children: [{ code: 'commonTitle_358d2d' }, { code: 'commonTitle_4836c3' }] },
  { code: 'commonTitle_5ad21d' },
  { code: 'commonTitle_fd092b' },
];

export const getAllChildrenAccessData = [
  'commonTitle_25d4b1',
  'commonTitle_b7c173',
  'commonTitle_6f7972',
  'commonTitle_075924',
  'group_d245cd',
  'commonTitle_75db0d',
  'commonTitle_6ffc63',
  'commonTitle_2dbb9f',
];

export const sortListItemAccessData = [
  'group_cb1409',
  'commonTitle_f698a3',
  'commonTitle_675b47',
  'commonTitle_67f82d',
  'commonTitle_ed6e20',
  'commonTitle_0268f0',
  'commonTitle_c13c4a',
  'commonTitle_8a4743',
];

export const getAllChildrenfailureata = [
  'commonTitle_b7c173',
  'commonTitle_6f7972',
  'commonTitle_075924',
  'group_d245cd',
  'commonTitle_75db0d',
  'commonTitle_6ffc63',
  'commonTitle_2dbb9f',
];

export const sortListItemfailureata = [
  'group_cb1409',
  'commonTitle_675b47',
  'commonTitle_67f82d',
  'commonTitle_f698a3',
  'commonTitle_ed6e20',
  'commonTitle_0268f0',
  'commonTitle_c13c4a',
  'commonTitle_8a4743',
];

export const getRealValueAccessData = [
  [1, 1],
  [1.00001, Infinity],
  [1, Infinity],
  [-Infinity, 0.9999],
  [-Infinity, 1],
  [1.00001, 1.99999],
  [1.00001, 2],
  [1, 1.99999],
  [1, 2],
];

export const getRealValueFailureData = [
  [1, Infinity],
  [1, Infinity],
  [1.00001, Infinity],
  [-Infinity, 1],
  [-Infinity, 0.9999],
  [1, 2],
  [1, 2],
  [1, 2],
  [1, 1],
];

export const getNotificationContentAccessData = [
  '等于,1',
  '大于,1',
  '大于等于,1',
  '小于,2',
  '小于等于,2',
  '开区间,左边界：1，右边界：2',
  '左开右闭,左边界：1，右边界：2',
  '右开左闭,左边界：1，右边界：2',
  '闭区间,左边界：1，右边界：2',
];

export const getNotificationContentFailureData = [
  '左开右闭,左边界：1，右边界：2',
  '等于,1',
  '大于,1',
  '小于等于,2',
  '大于等于,1',
  '右开左闭,左边界：1，右边界：2',
  '开区间,左边界：1，右边界：2',
  '闭区间,左边界：1，右边界：1',
  '小于,2',
];

export const getTriggerConditionAccessData = [
  {
    color: '#222',
    conditionCode: 'table_5725b0',
    index: 3,
    intervalType: 'less',
    isTrigger: false,
    left: 300,
    right: 1500,
    time: 10000,
    timeUnit: 'sec',
  },
  {
    color: '#222',
    conditionCode: 'table_5725b0',
    index: 1,
    intervalType: 'over',
    isTrigger: false,
    left: 300,
    right: 1500,
    time: 10000,
    timeUnit: 'sec',
  },
];

export const getTriggerConditionFailureData = [undefined, undefined];

export const getValueByModalAccessData = {
  appId: 886,
  backgroundColor: '#0D2A41',
  backgroundImg: '',
  createTime: 1626837177000,
  createUser: 'longchan',
  height: 2160,
  id: 1118,
  modifyTime: 1630636950000,
  modifyUser: 'longchan',
  thumbnail: '',
  width: 4800,
  zoomType: 1,
};
export const getValueByModalFailureData = null;

/**
 * color.ts
 */

export const getDarkenColorAccessData = '#808080';

export const getDarkenColorFailureData = '#000000';

export const getLightenColorAccessData = '#ffffff';

export const getLightenColorFailureData = '#000000';

export const getGradientColorAccessData = ['#ffffff', '#bfbfbf', '#808080', '#404040', '#000000'];

export const getGradientColorFailureData = ['#ffffff', '#cccccc', '#808080', '#404040', '#000000'];

/**
 * dataTranslate.ts
 */

export const dataTranslateAccessData = [
  { from: [116.404844, 39.91405], text: undefined, to: [84.9023, 42.148] },
  { from: [116.404844, 39.91405], text: undefined, to: [87.8695, 31.6846] },
  { from: [116.404844, 39.914], text: undefined, to: [112.5977, 41.3408] },
  { from: [116.404844, 39.91405], text: undefined, to: [101.9199, 30.1904] },
  { from: [116.404844, 39.91405], text: undefined, to: [126.1445, 48.7156] },
];

export const dataTranslateFailureData = [];
