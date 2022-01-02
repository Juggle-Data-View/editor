/**
 * Blueprint 自定义主题配置
 */

import { Colors } from '@blueprintjs/core';

// 深色主题
export const darkTheme = {
  iconColor: Colors.GRAY4,

  // gray色值为编排系统整体色调
  gray1: Colors.DARK_GRAY1,
  gray2: Colors.DARK_GRAY2,
  gray3: Colors.DARK_GRAY3, // 这个颜色为整体背景色
  gray4: Colors.DARK_GRAY4,
  gray5: Colors.DARK_GRAY5,

  primary: Colors.BLUE3,
  warning: Colors.ORANGE3,
  danger: Colors.RED3,
  success: Colors.GREEN3,
  hoverPrimary: Colors.BLUE1,

  ruler: {
    bgColor: '#CCC', // ruler bg color
    longfgColor: '#7D8694', // ruler longer mark color
    shortfgColor: '#7D8694', // ruler shorter mark color
    fontColor: '#222', // ruler font color
    lineColor: Colors.BLUE3,
    borderColor: '#000',
    cornerActiveColor: '#CCC',
  },
};

export type AutoDVTheme = typeof darkTheme;

// 浅色主题
export const lightTheme: AutoDVTheme = {
  iconColor: Colors.GRAY1,

  gray1: Colors.LIGHT_GRAY3,
  gray2: Colors.LIGHT_GRAY4,
  gray3: Colors.LIGHT_GRAY5, // 这个颜色为整体背景色
  gray4: Colors.LIGHT_GRAY1,
  gray5: Colors.LIGHT_GRAY2,

  primary: Colors.BLUE3,
  warning: Colors.ORANGE3,
  danger: Colors.RED3,
  success: Colors.GREEN3,
  hoverPrimary: Colors.BLUE1,

  ruler: {
    bgColor: Colors.LIGHT_GRAY4, // ruler bg color
    longfgColor: '#7D8694', // ruler longer mark color
    shortfgColor: '#7D8694', // ruler shorter mark color
    fontColor: '#7D8694', // ruler font color
    lineColor: Colors.BLUE3,
    borderColor: Colors.LIGHT_GRAY2,
    cornerActiveColor: Colors.LIGHT_GRAY1,
  },
};

const themes: Record<AutoDV.Editor['theme'], AutoDVTheme> = {
  light: lightTheme,
  dark: darkTheme,
};

export default themes;
