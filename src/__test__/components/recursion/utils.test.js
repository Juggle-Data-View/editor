import { state as data } from './MockData/utilsState';
import { resolveName, c2n } from '../../../components/recursion/utils';
import { utilsAccessData, utilsFailureData, configAccessData, configFailureData } from './MockData/expectData';

/**
 * resolveName test
 */

test('resolve name with path success when path=./d/e', () => {
  expect(resolveName(data.name, data.path[0])).toEqual(utilsAccessData[0]);
});

test('resolve name with path failure when path=./d/e', () => {
  expect(resolveName(data.name, data.path[0])).not.toEqual(utilsFailureData[0]);
});

test('resolve name with path success when path=/d/e', () => {
  expect(resolveName(data.name, data.path[1])).toEqual(utilsAccessData[1]);
});

test('resolve name with path failure when path=/d/e', () => {
  expect(resolveName(data.name, data.path[1])).not.toEqual(utilsFailureData[1]);
});

test('resolve name with path success when path=d/e', () => {
  expect(resolveName(data.name, data.path[2])).toEqual(utilsAccessData[2]);
});

test('resolve name with path failure when path=d/e', () => {
  expect(resolveName(data.name, data.path[2])).not.toEqual(utilsFailureData[2]);
});

test('resolve name with path success when path=#/d/e', () => {
  expect(resolveName(data.name, data.path[3])).toEqual(utilsAccessData[3]);
});

test('resolve name with path failure when path=#/d/e', () => {
  expect(resolveName(data.name, data.path[3])).not.toEqual(utilsFailureData[3]);
});

test('resolve name with path success when path=../d/e', () => {
  expect(resolveName(data.name, data.path[4])).toEqual(utilsAccessData[4]);
});

test('resolve name with path failure when path=../d/e', () => {
  expect(resolveName(data.name, data.path[4])).not.toEqual(utilsFailureData[4]);
});

test('resolve name with path success when path=../../d/e', () => {
  expect(resolveName(data.name, data.path[5])).toEqual(utilsAccessData[5]);
});

test('resolve name with path failure when path=../../d/e', () => {
  expect(resolveName(data.name, data.path[5])).not.toEqual(utilsFailureData[5]);
});

test('resolve name with path success when path=../../', () => {
  expect(resolveName(data.name, data.path[6])).toEqual(utilsAccessData[6]);
});

test('resolve name with path failure when path=../../', () => {
  expect(resolveName(data.name, data.path[6])).not.toEqual(utilsFailureData[6]);
});

/**
 * cn2
 */
test('config to node success when config is an array', () => {
  expect(c2n(data.config[0])).toEqual(configAccessData[0]);
});

test('config to node failure when config is an array', () => {
  expect(c2n(data.config[0])).not.toEqual(configFailureData[0]);
});

test('config to node success when config is not an array', () => {
  expect(c2n(data.config[1])).toEqual(configAccessData[1]);
});

test('config to node success when config is not an array', () => {
  expect(c2n(data.config[1])).not.toEqual(configFailureData[1]);
});
