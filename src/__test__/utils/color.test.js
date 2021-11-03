import color, { gradientColors } from '../../utils/color';
import { state as data } from './MockData/color';
import {
  getDarkenColorAccessData,
  geDarkentColorFailureData,
  getLightenColorAccessData,
  getLightenColorFailureData,
  getGradientColorAccessData,
  getGradientColorFailureData,
} from './MockData/expectData';

test('get darken color when success', () => {
  expect(color.darken(data.initColor.color, data.initColor.amount)).toEqual(getDarkenColorAccessData);
});
test('get darken color when failed', () => {
  expect(color.darken(data.initColor.color, data.initColor.amount)).not.toEqual(geDarkentColorFailureData);
});
test('get lighten color when success', () => {
  expect(color.lighten(data.initColor.color, data.initColor.amount)).toEqual(getLightenColorAccessData);
});
test('get lighten color when failed', () => {
  expect(color.lighten(data.initColor.color, data.initColor.amount)).not.toEqual(getLightenColorFailureData);
});
test('get gradient color when success', () => {
  expect(gradientColors(data.color.start, data.color.end, data.color.steps)).toEqual(getGradientColorAccessData);
});
test('get gradient color when failed', () => {
  expect(gradientColors(data.color.start, data.color.end, data.color.steps)).not.toEqual(getGradientColorFailureData);
});
