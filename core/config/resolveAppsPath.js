/**
 * 1. need resolve link package in dev.
 * 2. only modify `module.rules.oneOf.include`.
 * 3. get extension 'src/' folder in 'common/'
 */

const fs = require('fs');
const path = require('path');

/**
 * @param {string} appSrc
 * @returns {string[]}
 */
const resolveAppsSrc = (appSrc) => {
  const commonPath = path.resolve('../common');
  const deps = fs.readdirSync(path.resolve('../common'));
  return [
    appSrc,
    ...deps.map((pathVal) => {
      return path.join(commonPath, pathVal, 'src');
    }),
  ];
};

/**
 * @returns {string[]}
 */
const resolveAppsRoot = () => {
  const commonPath = path.resolve('../common');
  const deps = fs.readdirSync(path.resolve('../common'));
  return deps.map((pathVal) => {
    return path.join(commonPath, pathVal);
  });
};

module.exports = {
  resolveAppsSrc,
  resolveAppsRoot,
};
