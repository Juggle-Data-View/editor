import React from 'react';
import { OptionProps } from '@blueprintjs/core';

/**
 * 将React.children组件转换为option对象
 */
export function children2option(children: React.ReactNode) {
  return React.Children.toArray(children).map((child) => {
    if (!React.isValidElement(child)) {
      return null;
    }
    const { children, label, value, ...rest } = child.props;
    return {
      ...rest,
      label: children || label,
      value,
    };
  }) as OptionProps[];
}

export const s2o = (options: (OptionProps | string)[]): OptionProps[] => {
  return options.map((option) => {
    if (typeof option === 'string') {
      return { label: option, value: option };
    }
    return option;
  });
};
