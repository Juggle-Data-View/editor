import { state as data } from './MockData/limitNotificationState';
import { getRealValue, getTriggerCondition, getNotificationContent } from '../../utils/limitNotification';
import {
  getRealValueAccessData,
  getRealValueFailureData,
  getNotificationContentAccessData,
  getNotificationContentFailureData,
  getTriggerConditionAccessData,
  getTriggerConditionFailureData,
} from './MockData/expectData';

/**
 * getRealValue test
 */

test('get real value success when type=equle', () => {
  expect(getRealValue(data.limitData, data.type[0])).toEqual(getRealValueAccessData[0]);
});

test('get real value failed when type=equle', () => {
  expect(getRealValue(data.limitData, data.type[0])).not.toEqual(getRealValueFailureData[0]);
});

test('get real value success when type=over', () => {
  expect(getRealValue(data.limitData, data.type[1])).toEqual(getRealValueAccessData[1]);
});

test('get real value failed when type=over', () => {
  expect(getRealValue(data.limitData, data.type[1])).not.toEqual(getRealValueFailureData[1]);
});

test('get real value success when type=noLessThan', () => {
  expect(getRealValue(data.limitData, data.type[2])).toEqual(getRealValueAccessData[2]);
});

test('get real value failed when type=noLessThan', () => {
  expect(getRealValue(data.limitData, data.type[2])).not.toEqual(getRealValueFailureData[2]);
});

test('get real value success when type=less', () => {
  expect(getRealValue(data.limitData, data.type[3])).toEqual(getRealValueAccessData[3]);
});

test('get real value failed when type=less', () => {
  expect(getRealValue(data.limitData, data.type[3])).not.toEqual(getRealValueFailureData[3]);
});

test('get real value success when type=noMoreThan', () => {
  expect(getRealValue(data.limitData, data.type[4])).toEqual(getRealValueAccessData[4]);
});

test('get real value failed when type=noMoreThan', () => {
  expect(getRealValue(data.limitData, data.type[4])).not.toEqual(getRealValueFailureData[4]);
});

test('get real value success when type=open', () => {
  expect(getRealValue(data.limitData, data.type[5])).toEqual(getRealValueAccessData[5]);
});

test('get real value failed when type=open', () => {
  expect(getRealValue(data.limitData, data.type[5])).not.toEqual(getRealValueFailureData[5]);
});

test('get real value success when type=leftOpen', () => {
  expect(getRealValue(data.limitData, data.type[6])).toEqual(getRealValueAccessData[6]);
});

test('get real value failed when type=leftOpen', () => {
  expect(getRealValue(data.limitData, data.type[6])).not.toEqual(getRealValueFailureData[6]);
});

test('get real value success when type=rightOpen', () => {
  expect(getRealValue(data.limitData, data.type[7])).toEqual(getRealValueAccessData[7]);
});

test('get real value failed when type=rightOpen', () => {
  expect(getRealValue(data.limitData, data.type[7])).not.toEqual(getRealValueFailureData[7]);
});

test('get real value success when type=close', () => {
  expect(getRealValue(data.limitData, data.type[8])).toEqual(getRealValueAccessData[8]);
});

test('get real value failed when type=close', () => {
  expect(getRealValue(data.limitData, data.type[8])).not.toEqual(getRealValueFailureData[8]);
});

/**
 * getTriggerCondition test
 */
test('get trigger condition success when value out of limit', () => {
  expect(getTriggerCondition(data.limitTrigger, data.rowItem[0])).toEqual(getTriggerConditionAccessData[0]);
});
test('get trigger condition failed when value out of limit', () => {
  expect(getTriggerCondition(data.limitTrigger, data.rowItem[0])).not.toEqual(getTriggerConditionFailureData[0]);
});
test('get trigger condition success when value in limit', () => {
  expect(getTriggerCondition(data.limitTrigger, data.rowItem[1])).toEqual(getTriggerConditionAccessData[1]);
});
test('get trigger condition failed when value in limit', () => {
  expect(getTriggerCondition(data.limitTrigger, data.rowItem[1])).not.toEqual(getTriggerConditionFailureData[1]);
});

/**
 * getNotificationContent test
 */
test('get notification content success when type=equle', () => {
  expect(getNotificationContent(data.type[0], data.limitData[0], data.limitData[1])).toEqual(
    getNotificationContentAccessData[0]
  );
});

test('get notification content failed when type=equle', () => {
  expect(getNotificationContent(data.type[0], data.limitData[0], data.limitData[1])).not.toEqual(
    getNotificationContentFailureData[0]
  );
});

test('get notification content success when type=over', () => {
  expect(getNotificationContent(data.type[1], data.limitData[0], data.limitData[1])).toEqual(
    getNotificationContentAccessData[1]
  );
});

test('get notification content failed when type=over', () => {
  expect(getNotificationContent(data.type[1], data.limitData[0], data.limitData[1])).not.toEqual(
    getNotificationContentFailureData[1]
  );
});

test('get notification content success when type=noLessThan', () => {
  expect(getNotificationContent(data.type[2], data.limitData[0], data.limitData[1])).toEqual(
    getNotificationContentAccessData[2]
  );
});

test('get notification content failed when type=noLessThan', () => {
  expect(getNotificationContent(data.type[2], data.limitData[0], data.limitData[1])).not.toEqual(
    getNotificationContentFailureData[2]
  );
});

test('get notification content success when type=less', () => {
  expect(getNotificationContent(data.type[3], data.limitData[0], data.limitData[1])).toEqual(
    getNotificationContentAccessData[3]
  );
});

test('get notification content failed when type=less', () => {
  expect(getNotificationContent(data.type[3], data.limitData[0], data.limitData[1])).not.toEqual(
    getNotificationContentFailureData[3]
  );
});

test('get notification content success when type=noMoreThan', () => {
  expect(getNotificationContent(data.type[4], data.limitData[0], data.limitData[1])).toEqual(
    getNotificationContentAccessData[4]
  );
});

test('get notification content failed when type=noMoreThan', () => {
  expect(getNotificationContent(data.type[4], data.limitData[0], data.limitData[1])).not.toEqual(
    getNotificationContentFailureData[4]
  );
});

test('get notification content success when type=open', () => {
  expect(getNotificationContent(data.type[5], data.limitData[0], data.limitData[1])).toEqual(
    getNotificationContentAccessData[5]
  );
});

test('get notification content failed when type=open', () => {
  expect(getNotificationContent(data.type[5], data.limitData[0], data.limitData[1])).not.toEqual(
    getNotificationContentFailureData[5]
  );
});

test('get notification content success when type=leftOpen', () => {
  expect(getNotificationContent(data.type[6], data.limitData[0], data.limitData[1])).toEqual(
    getNotificationContentAccessData[6]
  );
});

test('get notification content failed when type=leftOpen', () => {
  expect(getNotificationContent(data.type[6], data.limitData[0], data.limitData[1])).not.toEqual(
    getNotificationContentFailureData[6]
  );
});

test('get notification content success when type=rightOpen', () => {
  expect(getNotificationContent(data.type[7], data.limitData[0], data.limitData[1])).toEqual(
    getNotificationContentAccessData[7]
  );
});

test('get notification content failed when type=rightOpen', () => {
  expect(getNotificationContent(data.type[7], data.limitData[0], data.limitData[1])).not.toEqual(
    getNotificationContentFailureData[7]
  );
});

test('get notification content success when type=close', () => {
  expect(getNotificationContent(data.type[8], data.limitData[0], data.limitData[1])).toEqual(
    getNotificationContentAccessData[8]
  );
});

test('get notification content failed when type=close', () => {
  expect(getNotificationContent(data.type[8], data.limitData[0], data.limitData[1])).not.toEqual(
    getNotificationContentFailureData[8]
  );
});
