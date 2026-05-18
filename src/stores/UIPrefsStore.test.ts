/**
 * createUIPrefsStore tests — covering #164.
 */
import { describe, it, expect, vi } from 'vitest';
import { createUIPrefsStore } from './createUIPrefsStore.js';
import type { UIPrefs, UIPrefsConfig } from '../shell/types.js';

function makeConfig(prefs: Partial<UIPrefs> = {}): UIPrefsConfig {
  return {
    load: vi.fn(() => Promise.resolve({
      theme: 'dark' as const,
      density: 'normal' as const,
      fontScale: 1.0,
      ...prefs,
    })),
    persistCommon: vi.fn(() => Promise.resolve()),
    persistApp: vi.fn(() => Promise.resolve()),
  };
}

describe('createUIPrefsStore (#164)', () => {
  it('returns a new store each call', () => {
    const a = createUIPrefsStore(makeConfig());
    const b = createUIPrefsStore(makeConfig());
    expect(a).not.toBe(b);
  });

  it('initial state has loading=true', () => {
    const store = createUIPrefsStore(makeConfig());
    expect(store.getState().loading).toBe(true);
  });

  it('hydrates prefs after load() resolves', async () => {
    const config = makeConfig({ theme: 'light', density: 'compact' });
    const store = createUIPrefsStore(config);
    // Wait for the promise to resolve
    await new Promise((r) => setTimeout(r, 0));
    expect(store.getState().prefs.theme).toBe('light');
    expect(store.getState().prefs.density).toBe('compact');
    expect(store.getState().loading).toBe(false);
  });

  it('setTheme() updates prefs.theme and calls persistCommon', async () => {
    const config = makeConfig();
    const store = createUIPrefsStore(config);
    await new Promise((r) => setTimeout(r, 0));
    store.getState().setTheme('light');
    expect(store.getState().prefs.theme).toBe('light');
    expect(config.persistCommon).toHaveBeenCalledWith(
      expect.objectContaining({ theme: 'light' }),
    );
  });

  it('setDensity() updates prefs.density and calls persistCommon', async () => {
    const config = makeConfig();
    const store = createUIPrefsStore(config);
    await new Promise((r) => setTimeout(r, 0));
    store.getState().setDensity('compact');
    expect(store.getState().prefs.density).toBe('compact');
    expect(config.persistCommon).toHaveBeenCalledWith(
      expect.objectContaining({ density: 'compact' }),
    );
  });

  it('setAppPref() updates app prefs and calls persistApp', async () => {
    const config = makeConfig();
    const store = createUIPrefsStore(config);
    await new Promise((r) => setTimeout(r, 0));
    store.getState().setAppPref('show_diff', true);
    expect(store.getState().prefs.app?.['show_diff']).toBe(true);
    expect(config.persistApp).toHaveBeenCalledWith(
      expect.objectContaining({ show_diff: true }),
    );
  });

  it('getLayerColor() returns CSS var fallback when no override', async () => {
    const store = createUIPrefsStore(makeConfig());
    await new Promise((r) => setTimeout(r, 0));
    expect(store.getState().getLayerColor('block')).toBe('var(--block)');
    expect(store.getState().getLayerColor('word')).toBe('var(--word)');
  });

  it('getLayerColor() returns override when set in prefs', async () => {
    const config = makeConfig({ layerColors: { block: '#ff0000' } });
    const store = createUIPrefsStore(config);
    await new Promise((r) => setTimeout(r, 0));
    expect(store.getState().getLayerColor('block')).toBe('#ff0000');
  });

  it('getStatusColor() returns CSS var fallback when no override', async () => {
    const store = createUIPrefsStore(makeConfig());
    await new Promise((r) => setTimeout(r, 0));
    expect(store.getState().getStatusColor('exact')).toBe('var(--exact)');
    expect(store.getState().getStatusColor('mismatch')).toBe('var(--mismatch)');
  });

  it('getAccentColor() returns CSS var fallbacks by default', async () => {
    const store = createUIPrefsStore(makeConfig());
    await new Promise((r) => setTimeout(r, 0));
    const { fg, bg } = store.getState().getAccentColor();
    expect(fg).toBe('var(--accent)');
    expect(bg).toBe('var(--accent-ink)');
  });

  it('getAccentColor() returns override when set', async () => {
    const config = makeConfig({ accentColor: '#ff6600', accentInkColor: '#ffffff' });
    const store = createUIPrefsStore(config);
    await new Promise((r) => setTimeout(r, 0));
    const { fg, bg } = store.getState().getAccentColor();
    expect(fg).toBe('#ff6600');
    expect(bg).toBe('#ffffff');
  });

  it('survives load() failure and sets loading=false', async () => {
    const config: UIPrefsConfig = {
      load: vi.fn(() => Promise.reject(new Error('network error'))),
      persistCommon: vi.fn(() => Promise.resolve()),
      persistApp: vi.fn(() => Promise.resolve()),
    };
    const store = createUIPrefsStore(config);
    await new Promise((r) => setTimeout(r, 0));
    expect(store.getState().loading).toBe(false);
    // Prefs kept at defaults
    expect(store.getState().prefs.theme).toBe('dark');
  });
});
