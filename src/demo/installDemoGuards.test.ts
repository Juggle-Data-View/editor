import { isBlockedDemoRequest, requestTarget } from './installDemoGuards';

const customDomain = 'https://juggle.ashesborn.cloud/editor/canvas';
const workersDev = 'https://juggle-editor-demo.next-blog.workers.dev/editor/canvas';

describe('demo fetch guard', () => {
  test('allows same-origin GETs on a non-workers.dev host', () => {
    expect(isBlockedDemoRequest('/components/registry.json', 'GET', customDomain)).toBe(false);
    expect(isBlockedDemoRequest('/components/pie/1.0.0/index.js', 'GET', customDomain)).toBe(false);
    expect(isBlockedDemoRequest('/iconfont.js', 'GET', customDomain)).toBe(false);
    expect(isBlockedDemoRequest('https://juggle.ashesborn.cloud/components/registry.json', 'GET', customDomain)).toBe(
      false
    );
  });

  test('allows the workers.dev host the same way', () => {
    expect(isBlockedDemoRequest('/components/registry.json', 'GET', workersDev)).toBe(false);
    expect(isBlockedDemoRequest('https://example.com/', 'GET', workersDev)).toBe(true);
  });

  test('allows same-origin Cloudflare beacons and still blocks proxy and parse', () => {
    expect(isBlockedDemoRequest('/cdn-cgi/rum?', 'GET', customDomain)).toBe(false);
    expect(isBlockedDemoRequest('/cdn-cgi/rum', 'POST', customDomain)).toBe(false);
    expect(isBlockedDemoRequest('/api/proxy', 'GET', customDomain)).toBe(true);
    expect(isBlockedDemoRequest('/api/proxy', 'POST', customDomain)).toBe(true);
    expect(isBlockedDemoRequest('/parse/classes/Applications', 'GET', customDomain)).toBe(true);
  });

  test('keeps the x402 GET allowlist and blocks every other cross-origin call', () => {
    expect(isBlockedDemoRequest('https://pay.ashesborn.cloud/api/v1/telemetry', 'GET', customDomain)).toBe(false);
    expect(isBlockedDemoRequest('https://pay.ashesborn.cloud/api/v1/datasets', 'GET', customDomain)).toBe(false);
    expect(isBlockedDemoRequest('https://pay.ashesborn.cloud/api/v1/telemetry', 'POST', customDomain)).toBe(true);
    expect(isBlockedDemoRequest('https://pay.ashesborn.cloud/api/v1/telemetry?x=1', 'GET', customDomain)).toBe(true);
    expect(isBlockedDemoRequest('https://pay.ashesborn.cloud/api/v1/openapi.json', 'GET', customDomain)).toBe(true);
    expect(isBlockedDemoRequest('https://example.com/', 'GET', customDomain)).toBe(true);
    expect(isBlockedDemoRequest('https://ashesborn.cloud/', 'GET', customDomain)).toBe(true);
  });

  test('installed guard blocks fetch(new URL) on the custom domain and allows its own assets', async () => {
    const env = process.env as { REACT_APP_DEMO?: string };
    env.REACT_APP_DEMO = 'true';
    jest.resetModules();
    const { installDemoGuards: install } = require('./installDemoGuards') as typeof import('./installDemoGuards');
    const href = 'https://juggle.ashesborn.cloud/editor/canvas';
    const previous = window.location;
    Object.defineProperty(window, 'location', {
      configurable: true,
      value: { href, origin: 'https://juggle.ashesborn.cloud' },
    });
    const original = jest.fn(() => Promise.resolve(new Response('ok')));
    window.fetch = original as unknown as typeof window.fetch;
    install();
    const fetchWithUrl = window.fetch as (input: URL | string, init?: RequestInit) => Promise<Response>;
    await expect(fetchWithUrl(new URL('https://example.com/'))).rejects.toThrow(
      'Demo mode blocked request: https://example.com/'
    );
    await expect(fetchWithUrl(new URL('/components/registry.json', href))).resolves.toBeInstanceOf(Response);
    await expect(fetchWithUrl('/cdn-cgi/rum?')).resolves.toBeInstanceOf(Response);
    expect(original).toHaveBeenCalledTimes(2);
    Object.defineProperty(window, 'location', { configurable: true, value: previous });
    env.REACT_APP_DEMO = undefined;
  });

  test('normalizes URL and Request inputs', () => {
    expect(requestTarget(new URL('https://example.com/a'))).toEqual({
      url: 'https://example.com/a',
      method: 'GET',
    });
    expect(requestTarget(new Request('https://example.com/secret', { method: 'POST' }))).toEqual({
      url: 'https://example.com/secret',
      method: 'POST',
    });
    expect(requestTarget('/components/registry.json')).toEqual({
      url: '/components/registry.json',
      method: 'GET',
    });
  });
});
