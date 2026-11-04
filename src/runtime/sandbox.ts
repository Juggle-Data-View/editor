import type { ComponentType } from 'react';
import { SHARED_DEPS } from './sharedDeps';

/**
 * Names bound as function parameters so a bundle cannot read host globals
 * through the scope chain. `new Function` runs in the global scope; shadowing
 * is what keeps window/document/fetch out of the bundle.
 *
 * This is a cooperative loader for first-party component bundles, not a
 * hardened isolation boundary (a bundle can still reach the realm via
 * constructor tricks). Keep this list aligned with scripts/build-remote-components.js.
 */
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

export type RemoteComponent = ComponentType<Record<string, unknown>>;

function asComponent(exported: unknown): RemoteComponent {
  if (typeof exported === 'function') {
    return exported as RemoteComponent;
  }
  if (exported && typeof exported === 'object' && typeof (exported as { default?: unknown }).default === 'function') {
    return (exported as { default: RemoteComponent }).default;
  }
  throw new Error('Remote bundle did not export a component');
}

/**
 * Evaluate a CommonJS component bundle with an injected require().
 * Only SHARED_DEPS (plus anything passed in) can be required.
 */
export function evaluateComponentBundle(
  code: string,
  requireMap: Record<string, unknown> = SHARED_DEPS
): RemoteComponent {
  const module = { exports: {} as unknown };
  const localRequire = (id: string) => {
    if (!Object.prototype.hasOwnProperty.call(requireMap, id)) {
      throw new Error(`Shared dependency "${id}" is not provided by the host`);
    }
    return requireMap[id];
  };
  // Bundles are CommonJS text fetched at runtime; the host injects require and shadows globals.
  // eslint-disable-next-line no-new-func
  const fn = new Function('module', 'exports', 'require', ...SHADOW_GLOBALS, `"use strict";\n${code}\n`);
  fn(module, module.exports, localRequire, ...SHADOW_GLOBALS.map(() => undefined));
  return asComponent(module.exports);
}
