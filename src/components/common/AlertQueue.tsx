type AlertCloser = () => void;

interface AutoCloseAlertQueueOption {
  autoHidenDuration: number;
  isAutoClose: true;
  isRunning: boolean;
  isClosed: boolean;
  timer: ReturnType<typeof setTimeout>;
}

interface ManualCloseAlertQueueOption {
  autoHidenDuration: -1;
  isAutoClose: false;
}

interface BaseAlertQueue {
  alertCloser: AlertCloser;
  date: number;
}

interface AutoCloseAlertQueue extends BaseAlertQueue {
  options: AutoCloseAlertQueueOption
}
interface ManualCloseAlertQueue extends BaseAlertQueue {
  options: ManualCloseAlertQueueOption
}
type AlertQueue = AutoCloseAlertQueue | ManualCloseAlertQueue;
type AlertQueueOptions = AutoCloseAlertQueueOption | ManualCloseAlertQueueOption;
interface ConstructorParam {
  maxAutoAlertCount?: number, maxManualAlertCount?: number, autoHidenDuration?: number
}
export default class AlertProcessor {
  private autoCloseAlertQueue: AutoCloseAlertQueue[] = [];
  private overLimitAlertQueue: AutoCloseAlertQueue[] = [];
  private overLimitManualAlertQueue: ManualCloseAlertQueue[] = [];
  private manualCloseAlertQueue: ManualCloseAlertQueue[] = [];
  private maxAutoAlertCount = 3;
  private maxManualAlertCount = 3;
  private autoHidenDuration = 3000;

  constructor(parmas?: ConstructorParam) {
    if (!parmas) {
      return;
    }
    const {
      maxAutoAlertCount,
      maxManualAlertCount,
      autoHidenDuration
    } = parmas;
    if (maxAutoAlertCount) {
      this.maxAutoAlertCount = maxAutoAlertCount;
    }
    if (maxManualAlertCount) {
      this.maxManualAlertCount = maxManualAlertCount;
    }
    if (autoHidenDuration) {
      this.autoHidenDuration = autoHidenDuration;
    }
  }

  private getPushResult(alert: AlertQueue, waitAlert: number) {
    return {
      alert,
      waitAlert
    }
  }

  public pushAlertQueue = (alertCloser: AlertCloser, options: AlertQueueOptions): {
    alert: AlertQueue,
    waitAlert: number
  } => {
    const date = Date.now();
    //TODO fix logic
    if (!options.isAutoClose) {
      if (this.manualCloseAlertQueue.length >= this.maxManualAlertCount) {
        const reuslt = { alertCloser, options, date }
        return this.getPushResult(reuslt, this.overLimitManualAlertQueue.push(reuslt));
      }
      const reuslt = { alertCloser, options, date }
      const waitAlert = this.manualCloseAlertQueue.push(reuslt);
      return {
        alert: this.manualAlertCloseHandler() as AlertQueue,
        waitAlert
      };
    } else {

      if (this.autoCloseAlertQueue.length >= this.maxAutoAlertCount) {
        const reusltParams = { alertCloser, options, date }
        return this.getPushResult(reusltParams, this.overLimitAlertQueue.push(reusltParams));
      }
      const reusltParams = { alertCloser, options, date }
      this.autoCloseAlertQueue.push(reusltParams);
      const result = this.getPushResult(reusltParams, 0);
      this.autoAlertCloserHandler();
      return result;
    }
  }

  public pauseAlertQueue = (alert: AutoCloseAlertQueue) => {
    const { options } = alert;
    if (options.isAutoClose) {
      options.isRunning = false;
      clearTimeout(options.timer);
    }
    return alert;
  }

  public resumeAlertQueue = (alert: AutoCloseAlertQueue) => {
    const { options } = alert;
    if (options.isAutoClose) {
      options.isRunning = true;
      this.autoAlertRunner(alert);
    }
    return alert;
  }

  private autoAlertRunner(autoCloseAlertQueue: AutoCloseAlertQueue) {
    const { options, alertCloser } = autoCloseAlertQueue
    const { isRunning, autoHidenDuration, isClosed } = options;
    const delay = autoHidenDuration || this.autoHidenDuration;
    if (!isRunning && !isClosed) {
      options.isRunning = true;
      options.timer = setTimeout(() => {
        alertCloser();
        options.isClosed = true;
      }, delay)
    }
  }

  private autoAlertCloserHandler = () => {
    const runnerLen = this.autoCloseAlertQueue.length;
    if (runnerLen < this.maxAutoAlertCount && this.overLimitAlertQueue.length > 0) {
      for (let i = 0; i < this.maxAutoAlertCount - runnerLen; i++) {
        const alert = this.overLimitAlertQueue.pop();
        if (alert) {
          this.autoCloseAlertQueue.push(alert);
        }
      }
    }
    this.autoCloseAlertQueue.forEach(this.autoAlertRunner)

  }

  private manualAlertCloseHandler = () => {
    const runnerLen = this.manualCloseAlertQueue.length;
    if (runnerLen < this.maxManualAlertCount && this.overLimitManualAlertQueue.length > 0) {
      for (let i = 0; i < this.maxManualAlertCount - runnerLen; i++) {
        const alert = this.overLimitManualAlertQueue.pop();
        if (alert) {
          this.manualCloseAlertQueue.push(alert);
        }
      }
    }
    return this.manualCloseAlertQueue.shift();
  }
}