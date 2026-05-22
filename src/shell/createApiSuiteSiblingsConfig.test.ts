/**
 * Tests for createApiSuiteSiblingsConfig (#6).
 *
 * Documents and verifies the /api/suite/* REST contract helper used by
 * SuiteSiblingsProvider.
 */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { createApiSuiteSiblingsConfig } from './createApiSuiteSiblingsConfig.js';
import type { InstalledApp } from './types.js';

const MOCK_APPS: InstalledApp[] = [
  { id: 'pd-ocr-labeler-spa', displayName: 'Labeler', launchUrl: 'http://localhost:8001' },
  { id: 'pd-prep-for-pgdp', displayName: 'PGDP Prep', launchUrl: 'http://localhost:8002' },
];

describe('createApiSuiteSiblingsConfig (#6)', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('returns an object with fetchInstalled and postLaunch callbacks', () => {
    const cfg = createApiSuiteSiblingsConfig();
    expect(cfg).toHaveProperty('fetchInstalled');
    expect(cfg).toHaveProperty('postLaunch');
    expect(typeof cfg.fetchInstalled).toBe('function');
    expect(typeof cfg.postLaunch).toBe('function');
  });

  it('fetchInstalled() issues a GET to /api/suite/installed', async () => {
    const fetchSpy = vi.spyOn(globalThis, 'fetch').mockResolvedValue(
      new Response(JSON.stringify(MOCK_APPS), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }),
    );
    const cfg = createApiSuiteSiblingsConfig();
    const apps = await cfg.fetchInstalled();

    expect(fetchSpy).toHaveBeenCalledOnce();
    const [url, init] = fetchSpy.mock.calls[0] as [string, RequestInit | undefined];
    expect(url).toBe('/api/suite/installed');
    expect(init?.method ?? 'GET').toBe('GET');
    expect(apps).toEqual(MOCK_APPS);
  });

  it('fetchInstalled() returns [] on fetch error', async () => {
    vi.spyOn(globalThis, 'fetch').mockRejectedValue(new Error('Network error'));
    const cfg = createApiSuiteSiblingsConfig();
    const apps = await cfg.fetchInstalled();
    expect(apps).toEqual([]);
  });

  it('fetchInstalled() returns [] on non-2xx response', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue(
      new Response('Service Unavailable', { status: 503 }),
    );
    const cfg = createApiSuiteSiblingsConfig();
    const apps = await cfg.fetchInstalled();
    expect(apps).toEqual([]);
  });

  it('postLaunch() issues a POST to /api/suite/launch with the app id', async () => {
    const fetchSpy = vi.spyOn(globalThis, 'fetch').mockResolvedValue(
      new Response(JSON.stringify({ kind: 'opened', url: 'http://localhost:8001' }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }),
    );
    const cfg = createApiSuiteSiblingsConfig();
    const result = await cfg.postLaunch('pd-ocr-labeler-spa');

    expect(fetchSpy).toHaveBeenCalledOnce();
    const [url, init] = fetchSpy.mock.calls[0] as [string, RequestInit];
    expect(url).toBe('/api/suite/launch');
    expect(init.method).toBe('POST');
    const body = JSON.parse(init.body as string) as Record<string, unknown>;
    expect(body).toMatchObject({ id: 'pd-ocr-labeler-spa' });
    expect(result).toMatchObject({ kind: 'opened' });
  });

  it('postLaunch() returns requires-host-config on non-2xx', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue(
      new Response('Not Implemented', { status: 501 }),
    );
    const cfg = createApiSuiteSiblingsConfig();
    const result = await cfg.postLaunch('pd-ocr-labeler-spa');
    expect(result).toMatchObject({ kind: 'requires-host-config', siblingId: 'pd-ocr-labeler-spa' });
  });

  it('postLaunch() returns requires-host-config on fetch error', async () => {
    vi.spyOn(globalThis, 'fetch').mockRejectedValue(new Error('Network error'));
    const cfg = createApiSuiteSiblingsConfig();
    const result = await cfg.postLaunch('pd-prep-for-pgdp');
    expect(result).toMatchObject({ kind: 'requires-host-config', siblingId: 'pd-prep-for-pgdp' });
  });

  it('accepts custom base URLs', async () => {
    const fetchSpy = vi.spyOn(globalThis, 'fetch').mockResolvedValue(
      new Response(JSON.stringify([]), { status: 200 }),
    );
    const cfg = createApiSuiteSiblingsConfig({
      installedUrl: 'http://localhost:9000/api/suite/installed',
      launchUrl: 'http://localhost:9000/api/suite/launch',
    });
    await cfg.fetchInstalled();
    expect((fetchSpy.mock.calls[0] as [string])[0]).toBe('http://localhost:9000/api/suite/installed');
  });
});
