/**
 * color utils
 */

import tinycolor from 'tinycolor2';

const parseColor = (hexStr: string) => {
  return hexStr.length === 4
    ? hexStr
        .substr(1)
        .split('')
        .map(function (s) {
          return 0x11 * parseInt(s, 16);
        })
    : [hexStr.substr(1, 2), hexStr.substr(3, 2), hexStr.substr(5, 2)].map(function (s) {
        return parseInt(s, 16);
      });
};

// zero-pad 1 digit to 2
const pad = function (s: string) {
  return s.length === 1 ? '0' + s : s;
};

export const gradientColors = function (start: string, end: string, steps: number, gamma = 1) {
  let i, j, ms, me;
  const output = [];
  const so = [];
  const normalize = function (channel: number) {
    return Math.pow(channel / 255, gamma);
  };
  const startColor = parseColor(start).map(normalize);
  const endColor = parseColor(end).map(normalize);
  for (i = 0; i < steps; i++) {
    ms = i / (steps - 1);
    me = 1 - ms;
    for (j = 0; j < 3; j++) {
      so[j] = pad(Math.round(Math.pow(startColor[j] * me + endColor[j] * ms, 1 / gamma) * 255).toString(16));
    }
    output.push('#' + so.join(''));
  }
  return output;
};

const color = {
  darken: (color: string, amount: number) => {
    return tinycolor(color).darken(amount).toHexString();
  },
  lighten: (color: string, amount: number) => {
    return tinycolor(color).lighten(amount).toHexString();
  },
};

export default color;
