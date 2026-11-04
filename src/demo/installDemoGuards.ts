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

export function installDemoGuards(): void {
  if (!isDemo || typeof window === 'undefined') {
    return;
  }

  const originalFetch = window.fetch.bind(window);
  window.fetch = ((input: RequestInfo, init?: RequestInit) => {
    const raw = typeof input === 'string' ? input : input.url;
    const method = (init && init.method) || 'GET';
    if (isBlockedDemoRequest(raw, method)) {
      return Promise.reject(new Error(`Demo mode blocked request: ${raw}`));
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
    if (isBlockedDemoRequest(String(url), method)) {
      throw new Error(`Demo mode blocked request: ${String(url)}`);
    }
    return originalOpen.call(this, method, url, async === undefined ? true : async, username, password);
  };

  const OriginalWebSocket = window.WebSocket;
  const PatchedWebSocket = function WebSocketGuard(this: WebSocket, url: string, protocols?: string | string[]) {
    if (isBlockedDemoRequest(String(url), 'WEBSOCKET')) {
      throw new Error(`Demo mode blocked websocket: ${String(url)}`);
    }
    return new OriginalWebSocket(url, protocols);
  } as unknown as typeof WebSocket;
  PatchedWebSocket.prototype = OriginalWebSocket.prototype;
  window.WebSocket = PatchedWebSocket;
}
