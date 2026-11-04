import { isDemo } from './isDemo';

const BLOCKED_HOSTS = [
  'ashesborn.cloud',
  'alicdn.com',
  'googletagmanager.com',
  'google-analytics.com',
  'findicons.com',
];

/** The only cross-origin reads the demo may make. Exact URL, GET, no query. */
const ALLOWED_GET = new Set([
  'https://pay.ashesborn.cloud/api/v1/telemetry',
  'https://pay.ashesborn.cloud/api/v1/datasets',
]);

/**
 * Demo builds must not reach Parse, the open /api/proxy, or any other origin.
 * Same-origin static files (including /components/*) stay allowed.
 * GET https://pay.ashesborn.cloud/api/v1/telemetry and /datasets are the exception.
 */
export function isBlockedDemoRequest(rawUrl: string, method = 'GET'): boolean {
  let url: URL;
  try {
    url = new URL(rawUrl, window.location.href);
  } catch (error) {
    return false;
  }
  if (url.protocol === 'data:' || url.protocol === 'blob:') {
    return false;
  }
  const verb = (method || 'GET').toUpperCase();
  if (verb === 'GET' && !url.search && !url.hash && !url.username) {
    const exact = `${url.origin}${url.pathname.replace(/\/$/, '')}`;
    if (ALLOWED_GET.has(exact)) {
      return false;
    }
  }
  const host = url.hostname;
  if ((host === 'localhost' || host === '127.0.0.1') && url.port === '3002') {
    return true;
  }
  if (BLOCKED_HOSTS.some((blocked) => host === blocked || host.endsWith(`.${blocked}`))) {
    return true;
  }
  if (url.origin === window.location.origin) {
    return url.pathname.includes('/api/proxy') || url.pathname === '/parse' || url.pathname.startsWith('/parse/');
  }
  return true;
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
