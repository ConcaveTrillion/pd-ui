/**
 * createUIPrefsStore color setter tests (#18).
 *
 * Tests for the new setLayerColor/setStatusColor/setAccentColor/setAccentInkColor
 * setters added as part of the UIPrefsConfig.persistCommon widening.
 *
 * Widening: persistCommon now receives Omit<UIPrefs,'app'> instead of
 * Pick<UIPrefs,'theme'|'density'|'fontScale'>.
 */
import { describe, it, expect, vi } from 'vitest';
import { createUIPrefsStore } from './createUIPrefsStore.js';
import type { UIPrefs, UIPrefsConfig } from '../shell/types.js';

function makeConfig(prefs: Partial<UIPrefs> = {}): UIPrefsConfig {
  return {
    load: vi.fn(() =>
      Promise.resolve({
        theme: 'dark' as const,
        density: 'normal' as const,
        fontScale: 1.0,
        ...prefs,
      }),
    ),
    persistCommon: vi.fn(() => Promise.resolve()),
    persistApp: vi.fn(() => Promise.resolve()),
  };
}

describe('createUIPrefsStore color setters (#18)', () => {
  it('setLayerColor() updates layerColors in prefs', async () => {
    const config = makeConfig();
    const store = createUIPrefsStore(config);
    await new Promise((r) => setTimeout(r, 0));
    store.getState().setLayerColor('block', '#aabbcc');
    expect(store.getState().prefs.layerColors?.['block']).toBe('#aabbcc');
  });

  it('setLayerColor() calls persistCommon with updated layerColors', async () => {
    const config = makeConfig();
    const store = createUIPrefsStore(config);
    await new Promise((r) => setTimeout(r, 0));
    store.getState().setLayerColor('para', '#112233');
    const lastCall = (config.persistCommon as ReturnType<typeof vi.fn>).mock.calls.at(-1) as [
      Omit<UIPrefs, 'app'>,
    ];
    expect(lastCall[0].layerColors?.['para']).toBe('#112233');
  });

  it('setLayerColor() preserves existing layerColor overrides', async () => {
    const config = makeConfig({ layerColors: { block: '#ff0000' } });
    const store = createUIPrefsStore(config);
    await new Promise((r) => setTimeout(r, 0));
    store.getState().setLayerColor('word', '#00ff00');
    expect(store.getState().prefs.layerColors?.['block']).toBe('#ff0000');
    expect(store.getState().prefs.layerColors?.['word']).toBe('#00ff00');
  });

  it('setStatusColor() updates statusColors in prefs', async () => {
    const config = makeConfig();
    const store = createUIPrefsStore(config);
    await new Promise((r) => setTimeout(r, 0));
    store.getState().setStatusColor('exact', '#22ff44');
    expect(store.getState().prefs.statusColors?.['exact']).toBe('#22ff44');
  });

  it('setStatusColor() calls persistCommon with updated statusColors', async () => {
    const config = makeConfig();
    const store = createUIPrefsStore(config);
    await new Promise((r) => setTimeout(r, 0));
    store.getState().setStatusColor('fuzzy', '#445566');
    const lastCall = (config.persistCommon as ReturnType<typeof vi.fn>).mock.calls.at(-1) as [
      Omit<UIPrefs, 'app'>,
    ];
    expect(lastCall[0].statusColors?.['fuzzy']).toBe('#445566');
  });

  it('setStatusColor() preserves existing statusColor overrides', async () => {
    const config = makeConfig({ statusColors: { exact: '#aaaaaa' } });
    const store = createUIPrefsStore(config);
    await new Promise((r) => setTimeout(r, 0));
    store.getState().setStatusColor('mismatch', '#bbbbbb');
    expect(store.getState().prefs.statusColors?.['exact']).toBe('#aaaaaa');
    expect(store.getState().prefs.statusColors?.['mismatch']).toBe('#bbbbbb');
  });

  it('setAccentColor() updates accentColor in prefs', async () => {
    const config = makeConfig();
    const store = createUIPrefsStore(config);
    await new Promise((r) => setTimeout(r, 0));
    store.getState().setAccentColor('#ff6600');
    expect(store.getState().prefs.accentColor).toBe('#ff6600');
  });

  it('setAccentColor() calls persistCommon with accentColor', async () => {
    const config = makeConfig();
    const store = createUIPrefsStore(config);
    await new Promise((r) => setTimeout(r, 0));
    store.getState().setAccentColor('#aa0000');
    expect(config.persistCommon).toHaveBeenCalledWith(
      expect.objectContaining({ accentColor: '#aa0000' }),
    );
  });

  it('setAccentInkColor() updates accentInkColor in prefs', async () => {
    const config = makeConfig();
    const store = createUIPrefsStore(config);
    await new Promise((r) => setTimeout(r, 0));
    store.getState().setAccentInkColor('#ffffff');
    expect(store.getState().prefs.accentInkColor).toBe('#ffffff');
  });

  it('setAccentInkColor() calls persistCommon with accentInkColor', async () => {
    const config = makeConfig();
    const store = createUIPrefsStore(config);
    await new Promise((r) => setTimeout(r, 0));
    store.getState().setAccentInkColor('#000000');
    expect(config.persistCommon).toHaveBeenCalledWith(
      expect.objectContaining({ accentInkColor: '#000000' }),
    );
  });

  it('persistCommon receives full Omit<UIPrefs,"app"> shape after color setter', async () => {
    const config = makeConfig({ theme: 'light', density: 'compact', fontScale: 1.2 });
    const store = createUIPrefsStore(config);
    await new Promise((r) => setTimeout(r, 0));
    store.getState().setLayerColor('line', '#334455');
    const call = (config.persistCommon as ReturnType<typeof vi.fn>).mock.calls.at(
      -1,
    )?.[0] as Record<string, unknown>;
    // Should include all non-app fields
    expect(call).toHaveProperty('theme', 'light');
    expect(call).toHaveProperty('density', 'compact');
    expect(call).toHaveProperty('fontScale', 1.2);
    expect(call).toHaveProperty('layerColors');
    // Should NOT include app
    expect(call).not.toHaveProperty('app');
  });
});
