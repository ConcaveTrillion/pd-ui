/**
 * Tests for createApiUIPrefsConfig (#5).
 *
 * Documents and verifies the /api/ui-prefs GET/PUT contract helper.
 * Uses vitest's fetchMock to intercept requests without a real server.
 */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { createApiUIPrefsConfig } from './createApiUIPrefsConfig.js';
import type { UIPrefs } from './types.js';

const DEFAULT_PREFS: UIPrefs = {
  theme: 'dark',
  density: 'normal',
  fontScale: 1.0,
};

describe('createApiUIPrefsConfig (#5)', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('returns a UIPrefsConfig object with load and persist callbacks', () => {
    const cfg = createApiUIPrefsConfig('/api/ui-prefs');
    expect(cfg).toHaveProperty('load');
    expect(cfg).toHaveProperty('persistCommon');
    expect(cfg).toHaveProperty('persistApp');
    expect(typeof cfg.load).toBe('function');
    expect(typeof cfg.persistCommon).toBe('function');
    expect(typeof cfg.persistApp).toBe('function');
  });

  it('load() issues a GET request to the configured URL', async () => {
    const fetchSpy = vi.spyOn(globalThis, 'fetch').mockResolvedValue(
      new Response(JSON.stringify(DEFAULT_PREFS), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }),
    );

    const cfg = createApiUIPrefsConfig('/api/ui-prefs');
    const prefs = await cfg.load();

    expect(fetchSpy).toHaveBeenCalledOnce();
    const [url, init] = fetchSpy.mock.calls[0] as [string, RequestInit | undefined];
    expect(url).toBe('/api/ui-prefs');
    expect(init?.method ?? 'GET').toBe('GET');
    expect(prefs).toEqual(DEFAULT_PREFS);
  });

  it('load() falls back to default prefs on fetch error', async () => {
    vi.spyOn(globalThis, 'fetch').mockRejectedValue(new Error('Network error'));
    const cfg = createApiUIPrefsConfig('/api/ui-prefs');
    const prefs = await cfg.load();
    // Should not throw; should return some valid UIPrefs
    expect(prefs).toHaveProperty('theme');
    expect(prefs).toHaveProperty('density');
    expect(prefs).toHaveProperty('fontScale');
  });

  it('load() falls back to default prefs on non-2xx response', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue(new Response('Not Found', { status: 404 }));
    const cfg = createApiUIPrefsConfig('/api/ui-prefs');
    const prefs = await cfg.load();
    expect(prefs).toHaveProperty('theme');
  });

  it('persistCommon() issues a PATCH request with common prefs', async () => {
    const fetchSpy = vi
      .spyOn(globalThis, 'fetch')
      .mockResolvedValue(new Response('{}', { status: 200 }));
    const cfg = createApiUIPrefsConfig('/api/ui-prefs');
    const common = { theme: 'light' as const, density: 'compact' as const, fontScale: 0.9 };
    await cfg.persistCommon(common);

    expect(fetchSpy).toHaveBeenCalledOnce();
    const [url, init] = fetchSpy.mock.calls[0] as [string, RequestInit];
    expect(url).toBe('/api/ui-prefs');
    expect(init.method).toBe('PATCH');
    const body = JSON.parse(init.body as string) as Record<string, unknown>;
    expect(body).toMatchObject({ theme: 'light', density: 'compact', fontScale: 0.9 });
  });

  it('persistApp() issues a PATCH request with app prefs nested under app key', async () => {
    const fetchSpy = vi
      .spyOn(globalThis, 'fetch')
      .mockResolvedValue(new Response('{}', { status: 200 }));
    const cfg = createApiUIPrefsConfig('/api/ui-prefs');
    await cfg.persistApp({ rightPanelOpen: true });

    expect(fetchSpy).toHaveBeenCalledOnce();
    const [url, init] = fetchSpy.mock.calls[0] as [string, RequestInit];
    expect(url).toBe('/api/ui-prefs');
    expect(init.method).toBe('PATCH');
    const body = JSON.parse(init.body as string) as Record<string, unknown>;
    expect(body).toMatchObject({ app: { rightPanelOpen: true } });
  });

  it('accepts a custom base URL', async () => {
    const fetchSpy = vi
      .spyOn(globalThis, 'fetch')
      .mockResolvedValue(new Response(JSON.stringify(DEFAULT_PREFS), { status: 200 }));
    const cfg = createApiUIPrefsConfig('http://localhost:8000/api/ui-prefs');
    await cfg.load();
    expect((fetchSpy.mock.calls[0] as [string])[0]).toBe('http://localhost:8000/api/ui-prefs');
  });
});
