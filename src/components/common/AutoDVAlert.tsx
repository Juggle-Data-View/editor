import React, { useState, SyntheticEvent } from 'react';
import ReactDOM from 'react-dom';
import { Alert, IAlertProps } from '@blueprintjs/core';
// import emitter from 'utils/events';

interface ICustomAlert extends Omit<IAlertProps, 'isOpen'> {
  canEnterKeyConfirm?: boolean; // 使用回车键触发确认
}

export type AlertCallback = (content: React.ReactNode, options: ICustomAlert) => void;

const CustomAlert = (props: ICustomAlert & { children: React.ReactNode }) => {
  const [isOpen, setIsOpen] = useState<boolean>(true);
  const { portalContainer, onCancel, onConfirm, onClosed, onOpening, onClose } = props;

  const bindEnter = (e: KeyboardEvent) => {
    if (e.code === 'Enter') {
      onConfirm && onConfirm();
      onClose && onClose(true);
      setIsOpen(false);
    }
  };

  const newProps = {
    ...props,
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
    onClosed(node: HTMLElement) {
      onClosed && onClosed(node);
      if (portalContainer) {
        document.body.removeChild(portalContainer);
      }

      document.removeEventListener('keydown', bindEnter);
    },
  };

  return (
    <div onClick={(e: SyntheticEvent) => e.stopPropagation()}>
      <Alert isOpen={isOpen} {...newProps}>
        {props.children}
      </Alert>
    </div>
  );
};

const alert: AlertCallback = (content, options) => {
  const tempDiv: HTMLElement = document.createElement('div');
  tempDiv.id = `alert-${+new Date()}`;
  document.body.appendChild(tempDiv);

  const alertProps = {
    portalContainer: tempDiv,
    cancelButtonText: '取消',
    confirmButtonText: '确定',
    canEscapeKeyCancel: true,
    ...options,
  };

  ReactDOM.render(<CustomAlert {...alertProps}>{content}</CustomAlert>, tempDiv);
};

export default alert;
