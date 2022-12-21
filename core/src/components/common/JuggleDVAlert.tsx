import React, { useState, SyntheticEvent, useEffect } from 'react';
import Alert, { AlertColor } from '@mui/material/Alert';
import Snackbar, { SnackbarProps } from '@mui/material/Snackbar';
import { Button } from '@mui/material';
import { createRoot } from 'react-dom/client';

interface CustomAlertEvent {
  onOpening(node: HTMLElement): void;
  onConfirm(evt?: SyntheticEvent<HTMLElement>): void;
  onCancel(evt?: SyntheticEvent<HTMLElement>): void;
}

export interface CustomAlertProps extends Partial<CustomAlertEvent>, SnackbarProps {
  portalContainer?: HTMLElement;
  canEnterKeyConfirm?: boolean; // default true
  canEscapeKeyCancel?: boolean; // default false
  intent?: AlertColor;
  cancelButtonText?: string;
  confirmButtonText?: string;
  icon?: string;
}

type AlertCallback = (content: any, options?: CustomAlertProps) => void;

const CustomAlert: React.FC<CustomAlertProps> = (props) => {
  const [isOpen, setIsOpen] = useState<boolean>(true);
  const {
    onClose,
    onOpening,
    onCancel,
    onConfirm,
    portalContainer,
    cancelButtonText,
    confirmButtonText,
    anchorOrigin,
    intent,
  } = props;

  const bindEnter = (e: KeyboardEvent) => {
    if (e.code === 'Enter') {
      onConfirm && onConfirm();
      onClose && onClose(e as any, 'clickaway');
      setIsOpen(false);
    }
  };

  const newProps: CustomAlertEvent = {
    onOpening(node: HTMLElement) {
      onOpening && onOpening(node);
      document.addEventListener('keydown', bindEnter);
    },
    onCancel(evt?: SyntheticEvent<HTMLElement>) {
      onCancel && onCancel(evt);
      setIsOpen(false);
    },
    onConfirm(evt?: SyntheticEvent<HTMLElement>) {
      onConfirm && onConfirm(evt);
      setIsOpen(false);
    },
  };

  useEffect(() => {
    if (portalContainer) newProps.onOpening(portalContainer);
  }, []); //eslint-disable-line

  const getAction = () => {
    const result = [];
    if (onConfirm) {
      result.push(
        <Button onClick={newProps.onConfirm} key="onConfirm" color="inherit" size="small">
          {confirmButtonText}
        </Button>
      );
    }
    if (onCancel) {
      result.push(
        <Button onClick={newProps.onCancel} key="onCancel" color="inherit" size="small">
          {cancelButtonText}
        </Button>
      );
    }
    return <>{result}</>;
  };

  const handleClose = () => {
    if (portalContainer && isOpen) {
      // It will be run twice, if `isOpen` is not in condition
      document.body.removeChild(portalContainer);
    }
    document.removeEventListener('keydown', bindEnter);
    setIsOpen(false);
  };

  return (
    <div onClick={(e: SyntheticEvent) => e.stopPropagation()}>
      <Snackbar open={isOpen} autoHideDuration={3000} anchorOrigin={anchorOrigin} onClose={handleClose}>
        <Alert variant="filled" severity={intent} action={getAction()}>
          {props.children}
        </Alert>
      </Snackbar>
    </div>
  );
};

const alert: AlertCallback = (content, options) => {
  const tempDiv: HTMLElement = document.createElement('div');
  tempDiv.id = `alert-${+new Date()}`;
  document.body.appendChild(tempDiv);
  const container = createRoot(tempDiv);

  const alertProps: CustomAlertProps = {
    portalContainer: tempDiv,
    cancelButtonText: '取消',
    confirmButtonText: '确定',
    canEscapeKeyCancel: true,
    intent: 'info',
    ...options,
  };

  container.render(<CustomAlert {...alertProps}>{content || ''}</CustomAlert>);
};

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
