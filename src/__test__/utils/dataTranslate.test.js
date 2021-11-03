import dataTranslater from '../../utils/dataTranslate';
import { state as data } from './MockData/dataTranslate';
import { dataTranslateAccessData, dataTranslateFailureData } from './MockData/expectData';

test('get data translater when success', () => {
  expect(dataTranslater(data.mockData, data.fieldMap)).toEqual(dataTranslateAccessData);
});

test('get data translater when failed', () => {
  expect(dataTranslater(data.mockData, data.fieldMap)).not.toEqual(dataTranslateFailureData);
});
