import { isDemo } from './isDemo';

/** The only cross-origin reads the demo may make. Exact URL, GET, no query. */
const ALLOWED_GET = new Set([
  'https://pay.ashesborn.cloud/api/v1/telemetry',
  'https://pay.ashesborn.cloud/api/v1/datasets',
]);

const pageURL = (explicit?: string) => explicit || (typeof window !== 'undefined' ? window.location.href : '');

const isProxyOrParse = (pathname: string) =>
  pathname.includes('/api/proxy') || pathname === '/parse' || pathname.startsWith('/parse/');

const isCdnCgi = (pathname: string) => pathname === '/cdn-cgi' || pathname.startsWith('/cdn-cgi/');

/**
 * Block demo traffic except:
 * - same-origin GET/HEAD (whatever host the page was deployed on)
 * - same-origin /cdn-cgi/ (Cloudflare's own beacon; any method, so it is not an uncaught error)
 * - GET https://pay.ashesborn.cloud/api/v1/telemetry and /datasets
 * /api/proxy and /parse stay blocked even on the page origin.
 *
 * `pageHref` overrides `window.location` in tests.
 */
export function isBlockedDemoRequest(rawUrl: string, method = 'GET', pageHref?: string): boolean {
  const base = pageURL(pageHref);
  let url: URL;
  let pageOrigin = '';
  try {
    pageOrigin = new URL(base).origin;
    url = new URL(rawUrl, base);
  } catch (error) {
    return true;
  }
  if (url.protocol === 'data:' || url.protocol === 'blob:') {
    return false;
  }
  if (pageOrigin && url.origin === pageOrigin) {
    if (isProxyOrParse(url.pathname)) {
      return true;
    }
    if (isCdnCgi(url.pathname)) {
      return false;
    }
    const verb = (method || 'GET').toUpperCase();
    return verb !== 'GET' && verb !== 'HEAD';
  }
  const verb = (method || 'GET').toUpperCase();
  if (verb === 'GET' && !url.search && !url.hash && !url.username) {
    const exact = `${url.origin}${url.pathname.replace(/\/$/, '')}`;
    if (ALLOWED_GET.has(exact)) {
      return false;
    }
  }
  return true;
}

/** True when a blocked call is Cloudflare's own same-origin beacon and should not surface. */
export function isQuietDemoBlock(rawUrl: string, pageHref?: string): boolean {
  try {
    const base = pageURL(pageHref);
    const url = new URL(rawUrl, base);
    return url.origin === new URL(base).origin && isCdnCgi(url.pathname);
  } catch (error) {
    return false;
  }
}

type FetchInput = RequestInfo | { href?: string; url?: string; method?: string };

/** String, URL, and Request all become a URL string. Unreadable input stays empty so the caller blocks it. */
export function requestTarget(input: FetchInput, init?: RequestInit): { url: string; method: string } {
  let method = (init && init.method) || '';
  let url = '';
  if (typeof input === 'string') {
    url = input;
  } else if (typeof URL !== 'undefined' && input instanceof URL) {
    url = input.href;
  } else if (typeof Request !== 'undefined' && input instanceof Request) {
    url = input.url;
    method = method || input.method;
  } else if (input && typeof (input as { href?: string }).href === 'string') {
    url = (input as { href: string }).href;
  } else if (input && typeof (input as { url?: string }).url === 'string') {
    url = (input as { url: string }).url;
  }
  return { url, method: method || 'GET' };
}

export function installDemoGuards(): void {
  if (!isDemo || typeof window === 'undefined') {
    return;
  }

  const originalFetch = window.fetch.bind(window);
  window.fetch = ((input: RequestInfo, init?: RequestInit) => {
    const target = requestTarget(input as FetchInput, init);
    if (!target.url || isBlockedDemoRequest(target.url, target.method)) {
      if (target.url && isQuietDemoBlock(target.url)) {
        return Promise.resolve(new Response(null, { status: 204 }));
      }
      return Promise.reject(new Error(`Demo mode blocked request: ${target.url || String(input)}`));
    }
    return originalFetch(input, init);
  }) as typeof window.fetch;

  const originalOpen = XMLHttpRequest.prototype.open;
  XMLHttpRequest.prototype.open = function open(
    method: string,
    url: string,
    async?: boolean,
    username?: string | null,
    password?: string | null
  ) {
    const target = requestTarget(url as unknown as FetchInput, { method });
    if (!target.url || isBlockedDemoRequest(target.url, target.method)) {
      if (target.url && isQuietDemoBlock(target.url)) {
        return;
      }
      throw new Error(`Demo mode blocked request: ${target.url || String(url)}`);
    }
    return originalOpen.call(this, method, url, async === undefined ? true : async, username, password);
  };

  const OriginalWebSocket = window.WebSocket;
  const PatchedWebSocket = function WebSocketGuard(this: WebSocket, url: string, protocols?: string | string[]) {
    const target = requestTarget(url as unknown as FetchInput, { method: 'WEBSOCKET' });
    if (!target.url || isBlockedDemoRequest(target.url, target.method)) {
      throw new Error(`Demo mode blocked websocket: ${target.url || String(url)}`);
    }
    return new OriginalWebSocket(url, protocols);
  } as unknown as typeof WebSocket;
  PatchedWebSocket.prototype = OriginalWebSocket.prototype;
  window.WebSocket = PatchedWebSocket;
}
