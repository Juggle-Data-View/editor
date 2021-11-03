/**
 * notice 页面通知
 */

import alert from 'components/common/AutoDVAlert';
import { Position, Toaster, IToaster, IToastProps } from '@blueprintjs/core';

const toaster: IToaster = Toaster.create({
  position: Position.TOP,
});

const notice = {
  alert,
  toast(props: IToastProps) {
    toaster.show({
      timeout: 3000,
      ...props,
    });
  },
  error(message: React.ReactNode, props?: IToastProps) {
    toaster.show({
      timeout: 3000,
      intent: 'danger',
      message,
      ...props,
    });
  },
  warn(message: React.ReactNode, props?: IToastProps) {
    toaster.show({
      timeout: 3000,
      intent: 'warning',
      message,
      ...props,
    });
  },
  success(message: React.ReactNode, props?: IToastProps) {
    toaster.show({
      timeout: 3000,
      intent: 'success',
      message,
      ...props,
    });
  },
};

export default notice;

// export const noticeError =
