/**
 * 定义系统通用的状态
 */

import { Intent, Colors, IconProps } from '@blueprintjs/core';

type Status = {
  [k in Intent]: {
    color: string;
    icon: IconProps['icon'];
  };
};

export const AutoDVStatus: Status = {
  none: {
    color: Colors.WHITE,
    icon: null,
  },
  danger: {
    color: Colors.RED3,
    icon: 'error',
  },
  warning: {
    color: Colors.ORANGE3,
    icon: 'warning-sign',
  },
  primary: {
    color: Colors.BLUE3,
    icon: null,
  },
  success: {
    color: Colors.GREEN3,
    icon: 'tick-circle',
  },
};
