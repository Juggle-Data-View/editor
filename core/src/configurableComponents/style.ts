/**
 * 全局样式配置
 */

import { OptionProps } from '@juggle-data-view/recursion-form/src/forms/utils';

export const fontFamily: OptionProps[] = [{ label: '微软雅黑', value: 'Microsoft YaHei' }];

export const fontWeight: OptionProps[] = [
  { label: '更细', value: 'lighter' },
  { label: '正常', value: 'normal' },
  { label: '加粗', value: 'bold' },
  { label: '更粗', value: 'bolder' },
];

export const writingMode: OptionProps[] = [
  { label: '水平', value: 'horizontal-tb' },
  { label: '垂直', value: 'vertical-rl' },
];

export const textAlign: OptionProps[] = [
  { label: '左对齐', value: 'left' },
  { label: '居中', value: 'center' },
  { label: '右对齐', value: 'right' },
];

export type IBorderStyleItem = {
  label: string;
  value: React.CSSProperties['borderStyle'];
};

export const borderStyle: IBorderStyleItem[] = [
  { label: '实线', value: 'solid' },
  { label: '虚线1', value: 'dashed' },
  { label: '虚线2', value: 'dotted' },
];

export const verticalTextAlign: OptionProps[] = [
  { label: '上对齐', value: 'left' },
  { label: '居中', value: 'center' },
  { label: '下对齐', value: 'right' },
];

export const fontStyle: OptionProps[] = [
  { label: '正常', value: 'normal' },
  { label: '斜体', value: 'italic' },
  { label: '倾斜体', value: 'oblique' },
];

export const flexAlign: (isVertical?: boolean) => OptionProps[] = (isVertical = false) => {
  return [
    { label: isVertical ? '上对齐' : '左对齐', value: 'flex-start' },
    { label: '居中', value: 'center' },
    { label: isVertical ? '下对齐' : '右对齐', value: 'flex-end' },
  ];
};

// 计时器结束效果中的动画效果
export const animation: OptionProps[] = [];

// 计时器文本样式中的文本动画
export const textAnimation: OptionProps[] = [];

// 计时器文本样式中的背景类型
export const backgroundTypes: OptionProps[] = [];
