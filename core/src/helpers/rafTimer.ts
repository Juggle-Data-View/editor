/**
 * requestanimationframe-timer
 * @from https://github.com/kambing86/requestanimationframe-timer
 */

enum MODE {
  MODE_TIMEOUT = 0,
  MODE_INTERVAL = 1,
}

interface Execution {
  fn: (...args: any[]) => void;
  ms: number;
  args: any[];
  mode: MODE;
}

interface NextExecution extends Execution {
  nextTick: number;
}

const fnMap = new Map<number, NextExecution>();
const executionSet = new Set<NextExecution>();
let rafStarted = false;
let startId = 0;

function getTimeStamp() {
  return new Date().getTime();
}

function executeFn(value: NextExecution) {
  const { fn, args } = value;
  fn(...args);
}

function runFunction() {
  if (executionSet.size === 0) return;
  executionSet.forEach(executeFn);
  executionSet.clear();
}

const checkTick = (currentTimeTick: number) => (value: NextExecution, id: number) => {
  const { nextTick, ms, mode } = value;
  if (currentTimeTick - nextTick >= 0) {
    executionSet.add(value);
    if (mode === MODE.MODE_TIMEOUT) {
      fnMap.delete(id);
    } else {
      fnMap.set(id, {
        ...value,
        nextTick: nextTick + ms,
      });
    }
  }
};

function loop() {
  if (fnMap.size === 0) {
    rafStarted = false;
    return;
  }
  const currentTimeTick = getTimeStamp();
  fnMap.forEach(checkTick(currentTimeTick));
  runFunction();
  if (fnMap.size === 0) {
    rafStarted = false;
    return;
  }
  window.requestAnimationFrame(loop);
}

function addId({ fn, ms, args, mode }: Execution) {
  if (!fn) return null;
  const currentId = startId;
  fnMap.set(currentId, {
    fn,
    ms,
    nextTick: getTimeStamp() + ms,
    args,
    mode,
  });
  if (!rafStarted) {
    rafStarted = true;
    window.requestAnimationFrame(loop);
  }
  startId += 1;
  return currentId;
}

function removeId(id?: number) {
  if (id == null) return;
  if (fnMap.has(id)) {
    fnMap.delete(id);
  }
}

export const setTimeout = (fn: () => void, ms = 0, ...args: any[]) => addId({ fn, ms, args, mode: MODE.MODE_TIMEOUT });

export const clearTimeout = removeId;

export const setInterval = (fn: () => void, ms = 0, ...args: any[]) =>
  addId({ fn, ms, args, mode: MODE.MODE_INTERVAL });

export const clearInterval = removeId;

/**
 * raf interval 的另外一种实现
 */
export const rafInterval = (callback: () => void, delay: number) => {
  const dateNow = Date.now;
  const requestAnimation = window.requestAnimationFrame;
  let start = dateNow(),
    stop: number;
  const intervalFunc = function () {
    if (dateNow() - start >= delay) {
      start += delay;
      callback();
    }
    stop || requestAnimation(intervalFunc);
  };
  requestAnimation(intervalFunc);
  return {
    clear: function () {
      stop = 1;
    },
  };
};
