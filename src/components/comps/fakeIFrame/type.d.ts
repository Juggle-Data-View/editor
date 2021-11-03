/**
 * 组件属性类型
 * 1. 定义所有模板配置的类型
 * 2. 导出 Index.tsx、Props.tsx 组件props的类型
 * @创建时间 2020-06-01 17:12:15
 */

// 导入React，子类型可能会用到React中的类型
import React from 'react';

export interface TabAddress {
  title: string;
  url: string;
  type: string;
}

interface tabAddressOption {
  tabAddress: TabAddress[];
  carouselCycle: number;
}

interface tabTitleStyle {
  height: number;
  margin: number;
  isShowTitle: boolean;
}

interface active {
  fontSize: number;
  color: string;
  backgroundColor: string;
}

export interface Config extends AutoDV.Config {
  title: string;
  style: React.CSSProperties;
  option: {
    tabAddressOption: tabAddressOption;
    tabTitleStyle: tabTitleStyle;
    activeTab: active;
    inactivedTab: active;
    animationType: 'carousel' | 'direct';
    animationVelocity: 'Linear' | 'Cubic.easeIn' | 'Cubic.easeOut' | 'Cubic.easeInOut';
    animationDuration: number;
    isAutoChange: boolean;
  };
}

// for Index.tsx
export type IIndex = AutoDV.IndexCompProps<Config, any[]>;

// for Props.tsx
export type IProps = AutoDV.PropsCompProps<Config>;

// for temps/{config}.ts
export type IConfig = AutoDV.CompTemp<Config>;
