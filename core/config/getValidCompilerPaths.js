const paths = require('./paths');
const path = require('path');
const fs = require('fs');
const resolve = require('resolve');
const { isEmpty } = require('lodash');

const { resolveAppsRoot } = require('./resolveAppsPath');

/**
 *
 * @typedef {object} Options
 * @property {string} options.baseUrl
 * @property {{
 *    [key: string]: string[]
 *  }} options.paths
 * Get webpack aliases based on the baseUrl of a compilerOptions object.
 *
 * @param {Options} options
 * @param {{
 *  rootPath: string;
 * }} extension
 */
function getWebpackAliases(options = {}, extension = {}) {
  const { baseUrl, paths: aliasPath } = options;
  const { rootPath } = extension;

  const appPath = rootPath ? rootPath : paths.appPath;
  const appSrc = rootPath ? path.join(rootPath, baseUrl) : paths.appSrc;

  if (!baseUrl) {
    return {};
  }

  const baseUrlResolved = path.resolve(appPath, baseUrl);

  if (path.relative(appPath, baseUrlResolved) === '') {
    return {
      src: appSrc,
    };
  }
  if (isEmpty(aliasPath)) {
    return {};
  }
  const aliasPathKeys = Object.keys(aliasPath);
  const result = aliasPathKeys.reduce((prev, curr) => {
    const aliasPathArr = aliasPath[curr];
    return {
      ...prev,
      [curr.replace('/*', '')]: path.resolve(appSrc, aliasPathArr[0].replace('/*', '')),
    };
  }, {});
  console.log(result);
  return result;
}

/**
 *
 * @param {string} rootPath
 * @returns {Record<string, string[]>}
 */
const getTSOption = (rootPath) => {
  const appTsConfig = path.join(rootPath, 'tsconfig.json');
  const hasTsConfig = fs.existsSync(appTsConfig);
  if (!hasTsConfig) {
    throw new Error('sub-project tsconfig is not exist');
  }
  const ts = require(resolve.sync('typescript', {
    basedir: paths.appNodeModules,
  }));
  const config = ts.readConfigFile(appTsConfig, ts.sys.readFile).config;
  return config.compilerOptions || {};
};

/**
 *
 * @param {string} rootPath
 * @returns {string}
 */
const handleTSAlias = (rootPath) => {
  return getWebpackAliases(getTSOption(rootPath), { rootPath });
};

/**
 *
 * @param {Record<string,string>} alias
 * @returns {Record<string,string>}
 */
const getValidCompilerPaths = (mainAlias) => {
  const appsRoot = resolveAppsRoot();
  return appsRoot.reduce((curr, next) => {
    const alias = handleTSAlias(next);
    return {
      ...alias,
      ...curr,
    };
  }, mainAlias);
};

/**
 *
 * @param {string[]} mainModulesPath
 * @returns {string[]}
 */
const getValidCompilerModulesPath = (mainModulesPath) => {
  const appsRoot = resolveAppsRoot();
  return mainModulesPath.concat(
    appsRoot.reduce((curr, rootPath) => {
      return [...curr, path.join(rootPath, 'src'), path.join(rootPath, 'node_modules')];
    }, [])
  );
};

const getTypeCheckPaths = () => {
  const appsRoot = resolveAppsRoot();
  const formatPaths = (aliasPath, appRoot) => {
    return Object.keys(aliasPath).reduce((curr, next) => {
      const item = aliasPath[next];
      return {
        ...curr,
        [next]: path.join(appRoot, item[0]),
      };
    }, {});
  };

  const result = appsRoot.reduce((curr, next) => {
    const { paths: aliasPath } = getTSOption(next);
    if (isEmpty(aliasPath)) {
      return curr;
    } else {
      return { ...curr, ...formatPaths(aliasPath, next) };
    }
  }, {});
  return result;
};

module.exports = {
  getWebpackAliases,
  getValidCompilerPaths,
  getValidCompilerModulesPath,
  getTypeCheckPaths,
};
