'use strict';

/**
 * Bundle vendored visualization components the way Juggle-Data-View/cli does:
 * one CommonJS file per component, React/echarts left external, plus a JSON
 * manifest. Output is served as static assets next to the editor:
 *   /components/<name>/<version>/index.js
 *   /components/<name>/<version>/manifest.json
 *   /components/registry.json
 *
 * Sources live in ./components and should move back to
 * Juggle-Data-View/componetsStore (and be built by that repo's CLI) once the
 * store publishes this same layout. They are vendored here so the demo
 * builds from this repository alone.
 *
 * The sandbox that evaluates these files is src/runtime/sandbox.ts.
 * Keep the shadowed global list in sync with SHADOW_GLOBALS there.
 */

const fs = require('fs');
const path = require('path');
const esbuild = require('esbuild');

const root = path.resolve(__dirname, '..');
const sourceRoot = path.join(root, 'components');
const outRoot = path.join(root, 'public', 'components');

const SHADOW_GLOBALS = [
  'window',
  'self',
  'global',
  'globalThis',
  'document',
  'location',
  'navigator',
  'fetch',
  'XMLHttpRequest',
  'WebSocket',
  'localStorage',
  'sessionStorage',
  'indexedDB',
  'parent',
  'top',
  'frames',
  'opener',
];

const catalog = [
  { dir: 'pie' },
  { dir: 'base-bar' },
  { dir: 'base-line' },
  { dir: 'common-title' },
  { dir: 'broken-widget' },
  { dir: 'broken-load', emit: 'throw' },
];

function readManifest(dir) {
  const file = path.join(sourceRoot, dir, 'manifest.json');
  return JSON.parse(fs.readFileSync(file, 'utf8'));
}

function evaluateBundle(code, requireMap) {
  const module = { exports: {} };
  const localRequire = (id) => {
    if (!Object.prototype.hasOwnProperty.call(requireMap, id)) {
      throw new Error(`Shared dependency "${id}" is not provided by the host`);
    }
    return requireMap[id];
  };
  const fn = new Function('module', 'exports', 'require', ...SHADOW_GLOBALS, `"use strict";\n${code}\n`);
  fn(module, module.exports, localRequire, ...SHADOW_GLOBALS.map(() => undefined));
  return module.exports;
}

function exportComponent(exported) {
  if (typeof exported === 'function') return exported;
  if (exported && typeof exported.default === 'function') return exported.default;
  return null;
}

function assertBundle(manifest, code) {
  const requireMap = {};
  (manifest.shared || []).forEach((id) => {
    requireMap[id] = id === 'echarts' ? { init() { return { setOption() {}, resize() {}, dispose() {} }; } } : {};
  });
  if (manifest.emit === 'throw') {
    let threw = false;
    try {
      evaluateBundle(code, requireMap);
    } catch (error) {
      threw = true;
      if (!/broken bundle/i.test(String(error && error.message))) {
        throw new Error(`${manifest.name}: expected a broken-bundle error, got ${error.message}`);
      }
    }
    if (!threw) throw new Error(`${manifest.name}: broken bundle did not throw during evaluation`);
    return;
  }
  const exported = evaluateBundle(code, requireMap);
  if (!exportComponent(exported)) {
    throw new Error(`${manifest.name}: bundle did not export a component function`);
  }
}

function buildOne(entry) {
  const manifest = readManifest(entry.dir);
  const version = manifest.version;
  const outDir = path.join(outRoot, manifest.name, version);
  fs.mkdirSync(outDir, { recursive: true });

  const outfile = path.join(outDir, 'index.js');
  if (entry.emit === 'throw') {
    const message = manifest.error || 'deliberately broken bundle: evaluation failed';
    fs.writeFileSync(outfile, `throw new Error(${JSON.stringify(message)});\n`);
  } else {
    esbuild.buildSync({
      absWorkingDir: root,
      entryPoints: [path.join(sourceRoot, entry.dir, 'index.jsx')],
      outfile,
      bundle: true,
      format: 'cjs',
      platform: 'browser',
      target: 'es2018',
      jsx: 'transform',
      external: manifest.shared || ['react', 'react-dom', 'echarts'],
      minify: false,
      legalComments: 'none',
      define: {
        'process.env.NODE_ENV': '"production"',
      },
      banner: {
        js: '/* Juggle remote component. require() is injected by the editor sandbox. */',
      },
    });
  }

  const code = fs.readFileSync(outfile, 'utf8');
  assertBundle({ ...manifest, emit: entry.emit }, code);

  const publicManifest = {
    name: manifest.name,
    version,
    title: manifest.title,
    main: 'index.js',
    shared: manifest.shared,
    staticData: manifest.staticData || [],
    compConfig: manifest.compConfig,
  };
  fs.writeFileSync(path.join(outDir, 'manifest.json'), `${JSON.stringify(publicManifest, null, 2)}\n`);

  return {
    name: manifest.name,
    version,
    title: manifest.title,
    category: manifest.category,
    group: manifest.group,
    entry: `/components/${manifest.name}/${version}/index.js`,
    manifest: `/components/${manifest.name}/${version}/manifest.json`,
    shared: manifest.shared,
  };
}

fs.rmSync(outRoot, { recursive: true, force: true });
fs.mkdirSync(outRoot, { recursive: true });

const components = catalog.map(buildOne);
fs.writeFileSync(path.join(outRoot, 'registry.json'), `${JSON.stringify({ components }, null, 2)}\n`);
console.log(`remote components: ${components.map((item) => item.name).join(', ')}`);
