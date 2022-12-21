import { EventEmitter } from 'events';

const ee = new EventEmitter();

ee.setMaxListeners(1000);

export default ee;

export const eventName = {
  compHover: 'compHover',
  compDrag: 'compDrag',
  updateOriginData: 'updateOriginData',
  autoDVEventUpdate: 'autoDVEventUpdate',
  notifyCompMounted: 'notifyCompMounted',
};

export const areaSelectEventName = {
  startPoint: 'startPoint',
  offsetPoint: 'offsetPoint',
  moveDirection: 'moveDirection',
  mouseUp: 'mouseUp',
  cancelRaf: 'cancelRaf',
};
