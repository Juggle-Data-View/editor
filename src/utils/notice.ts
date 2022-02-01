/**
 * notice 页面通知
 */

import alert, { CustomAlertProps } from 'components/common/AutoDVAlert';

const topAlert = (message: React.ReactNode, props?: CustomAlertProps) => {
  return alert(message, {
    ...props,
    anchorOrigin: {
      vertical: 'top',
      horizontal: 'center',
    },
  });
};

const notice = {
  alert: topAlert,
  error(message: React.ReactNode, props?: CustomAlertProps) {
    topAlert(message, {
      intent: 'error',
      ...props,
    });
  },
  warn(message: React.ReactNode, props?: CustomAlertProps) {
    topAlert(message, {
      intent: 'warning',
      ...props,
    });
  },
  success(message: React.ReactNode, props?: CustomAlertProps) {
    topAlert(message, {
      intent: 'success',

      ...props,
    });
  },
};

export default notice;

// export const noticeError =
