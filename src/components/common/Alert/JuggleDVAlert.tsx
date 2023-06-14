import { useState, SyntheticEvent, useEffect, useRef } from 'react';
import Alert, { AlertColor } from '@mui/material/Alert';
import { Button } from '@mui/material';
import { createRoot } from 'react-dom/client';
import AlertProcessor from './AlertQueue';

interface CustomAlertEvent {
  onOpening(node: HTMLElement): void;
  onConfirm(evt?: SyntheticEvent<HTMLElement>): void;
  onCancel(evt?: SyntheticEvent<HTMLElement>): void;
  onClose?(evt?: SyntheticEvent<HTMLElement> | KeyboardEvent): void;
  onHover?(evt?: SyntheticEvent<HTMLElement>): void;
  onLeave?(evt?: SyntheticEvent<HTMLElement>): void;
}

const {
  pushAlertQueue,
  pauseAlertQueue,
  resumeAlertQueue,
} = new AlertProcessor();

export interface CustomAlertProps extends Partial<CustomAlertEvent> {
  portalContainer?: HTMLElement;
  canEnterKeyConfirm?: boolean; // default true
  canEscapeKeyCancel?: boolean; // default false
  intent?: AlertColor;
  cancelButtonText?: string;
  confirmButtonText?: string;
  icon?: string;
  isAutoClose?: boolean;
}

type AlertCallback = (content: any, options?: CustomAlertProps) => void;

const CustomAlert: FC<CustomAlertProps> = (props) => {
  const [isOpen, setIsOpen] = useState<boolean>(true);
  const {
    onClose,
    onOpening,
    onCancel,
    onConfirm,
    onHover,
    onLeave,
    portalContainer,
    cancelButtonText,
    confirmButtonText,
    isAutoClose,
    intent,
  } = props;
  const alertRef = useRef<ReturnType<typeof pauseAlertQueue> | null>(null);
  const bindEnter = (e: KeyboardEvent) => {
    if (e.code === 'Enter') {
      onConfirm && onConfirm();
      onClose && onClose(e);
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

  const handleHover = () => {
    alertRef.current && pauseAlertQueue(alertRef.current);
    onHover && onHover();
  }

  const handleLeave = () => {
    alertRef.current && resumeAlertQueue(alertRef.current);
    onLeave && onLeave();
  }

  useEffect(() => {
    if (portalContainer) newProps.onOpening(portalContainer);
    alertRef.current = (isAutoClose ? pushAlertQueue(handleClose, {
      isAutoClose: true,
    }) : pushAlertQueue(handleClose, {
      isAutoClose: false,
    })) as unknown as ReturnType<typeof pauseAlertQueue>;
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
    <div onClick={(e: SyntheticEvent) => e.stopPropagation()} onMouseEnter={handleHover}
      onMouseLeave={handleLeave}
    >
      <Alert variant="filled" onClose={handleClose} severity={intent} action={getAction()}>
        {props.children}
      </Alert>
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

export default alert;
