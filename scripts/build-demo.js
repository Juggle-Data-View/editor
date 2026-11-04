'use strict';

/**
 * Demo production build: remote component bundles, then the CRA editor
 * with REACT_APP_DEMO=true so Parse / the open proxy are never called.
 */
process.env.REACT_APP_DEMO = 'true';
process.env.BABEL_ENV = 'production';
process.env.NODE_ENV = 'production';

require('./build-remote-components');
require('./build');
