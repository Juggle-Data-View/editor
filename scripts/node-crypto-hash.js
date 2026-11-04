/**
 * Webpack 5.72 still calls crypto.createHash('md4'). Node 17+ OpenSSL 3
 * rejects md4 unless the legacy provider is enabled. Rewriting that call
 * keeps `npm run build:demo` working on current Node LTS without a flag.
 */
const crypto = require('crypto');

const createHash = crypto.createHash;
crypto.createHash = function createHashCompat(algorithm, options) {
  const name = algorithm === 'md4' ? 'sha256' : algorithm;
  return createHash.call(this, name, options);
};
