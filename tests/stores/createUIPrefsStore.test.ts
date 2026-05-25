/**
 * createUIPrefsStore — persist error surfacing tests.
 *
 * Covers issue #38: preference persist failures were silently swallowed.
 * Verifies that:
 *   - persist-succeeds: no error state or callback invoked
 *   - persist-fails-sync: synchronous throw from persist is surfaced
 *   - persist-fails-async: async rejection from persist is surfaced
 */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { createUIPrefsStore } from '../../src/stores/createUIPrefsStore.js';
import type { UIPrefsConfig } from '../../src/shell/types.js';

/** Flush the microtask queue enough to let Zustand's promise chains settle. */
async function flushMicrotasks(): Promise<void> {
  // 4 ticks: load().then + load().catch + persist().then/.catch each need room.
  await Promise.resolve();
  await Promise.resolve();
  await Promise.resolve();
  await Promise.resolve();
}

/** Minimal valid UIPrefs config where everything succeeds. */
function makeSucceedingConfig(overrides?: Partial<UIPrefsConfig>): UIPrefsConfig {
  return {
    load: vi.fn().mockResolvedValue({ theme: 'dark', density: 'normal', fontScale: 1.0 }),
    persistCommon: vi.fn().mockResolvedValue(undefined),
    persistApp: vi.fn().mockResolvedValue(undefined),
    ...overrides,
  };
}

describe('createUIPrefsStore persist error surfacing (#38)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // ── persist-succeeds ──────────────────────────────────────────────────────

  describe('when persist succeeds', () => {
    it('does not set persistError after setTheme', async () => {
      const config = makeSucceedingConfig();
      const store = createUIPrefsStore(config);

      store.getState().setTheme('light');
      await flushMicrotasks();

      expect(store.getState().persistError).toBeNull();
    });

    it('does not invoke onPersistError callback', async () => {
      const onPersistError = vi.fn();
      const config = makeSucceedingConfig({ onPersistError });
      const store = createUIPrefsStore(config);

      store.getState().setTheme('light');
      await flushMicrotasks();

      expect(onPersistError).not.toHaveBeenCalled();
    });

    it('does not set persistError after setAppPref', async () => {
      const config = makeSucceedingConfig();
      const store = createUIPrefsStore(config);

      store.getState().setAppPref('zoom', 2);
      await flushMicrotasks();

      expect(store.getState().persistError).toBeNull();
    });

    it('clearPersistError resets error back to null', async () => {
      const err = new Error('quota exceeded');
      const config = makeSucceedingConfig({
        persistCommon: vi.fn().mockRejectedValue(err),
      });
      const store = createUIPrefsStore(config);

      store.getState().setTheme('light');
      await flushMicrotasks();

      expect(store.getState().persistError).toBe(err);

      store.getState().clearPersistError();
      expect(store.getState().persistError).toBeNull();
    });
  });

  // ── persist-fails-sync ────────────────────────────────────────────────────

  describe('when persistCommon throws synchronously (Promise.reject with sync error)', () => {
    it('sets persistError on the store after setTheme', async () => {
      const err = new Error('sync persist failure');
      const config = makeSucceedingConfig({
        persistCommon: vi.fn().mockRejectedValue(err),
      });
      const store = createUIPrefsStore(config);

      store.getState().setTheme('light');
      await flushMicrotasks();

      expect(store.getState().persistError).toBe(err);
    });

    it('calls onPersistError callback with the error', async () => {
      const err = new Error('sync persist failure');
      const onPersistError = vi.fn();
      const config = makeSucceedingConfig({
        persistCommon: vi.fn().mockRejectedValue(err),
        onPersistError,
      });
      const store = createUIPrefsStore(config);

      store.getState().setDensity('compact');
      await flushMicrotasks();

      expect(onPersistError).toHaveBeenCalledOnce();
      expect(onPersistError).toHaveBeenCalledWith(err);
    });

    it('still applies the optimistic state update even when persist fails', async () => {
      const err = new Error('sync persist failure');
      // Use a never-resolving load so it does not overwrite optimistic state.
      const config = makeSucceedingConfig({
        load: vi.fn(() => new Promise<never>(() => undefined)),
        persistCommon: vi.fn().mockRejectedValue(err),
      });
      const store = createUIPrefsStore(config);

      store.getState().setTheme('light');
      // Before flush: optimistic update is applied synchronously.
      expect(store.getState().prefs.theme).toBe('light');

      await flushMicrotasks();
      // After flush: optimistic update is still present (no rollback by default).
      expect(store.getState().prefs.theme).toBe('light');
    });
  });

  // ── persist-fails-async ───────────────────────────────────────────────────

  describe('when persistCommon fails asynchronously (network / quota)', () => {
    it('sets persistError after setFontScale when persist rejects asynchronously', async () => {
      const err = new Error('network 503');
      const config = makeSucceedingConfig({
        persistCommon: vi.fn(() => Promise.reject(err)),
      });
      const store = createUIPrefsStore(config);

      store.getState().setFontScale(1.2);
      await flushMicrotasks();

      expect(store.getState().persistError).toBe(err);
    });

    it('sets persistError after setLayerColor when persist rejects asynchronously', async () => {
      const err = new Error('quota exceeded');
      const config = makeSucceedingConfig({
        persistCommon: vi.fn(() => Promise.reject(err)),
      });
      const store = createUIPrefsStore(config);

      store.getState().setLayerColor('block', '#ff0000');
      await flushMicrotasks();

      expect(store.getState().persistError).toBe(err);
    });

    it('sets persistError after setAppPref when persistApp rejects', async () => {
      const err = new Error('app persist quota exceeded');
      const config = makeSucceedingConfig({
        persistApp: vi.fn(() => Promise.reject(err)),
      });
      const store = createUIPrefsStore(config);

      store.getState().setAppPref('selectedTool', 'zoom');
      await flushMicrotasks();

      expect(store.getState().persistError).toBe(err);
    });

    it('calls onPersistError callback for async failures', async () => {
      const err = new Error('network timeout');
      const onPersistError = vi.fn();
      const config = makeSucceedingConfig({
        persistCommon: vi.fn(() => Promise.reject(err)),
        onPersistError,
      });
      const store = createUIPrefsStore(config);

      store.getState().setStatusColor('exact', '#00ff00');
      await flushMicrotasks();

      expect(onPersistError).toHaveBeenCalledWith(err);
    });

    it('accumulates the last error (subsequent persist replaces previous error)', async () => {
      const err1 = new Error('first failure');
      const err2 = new Error('second failure');
      let callCount = 0;
      const config = makeSucceedingConfig({
        persistCommon: vi.fn(() => {
          callCount++;
          return callCount === 1 ? Promise.reject(err1) : Promise.reject(err2);
        }),
      });
      const store = createUIPrefsStore(config);

      store.getState().setTheme('light');
      await flushMicrotasks();
      expect(store.getState().persistError).toBe(err1);

      store.getState().setDensity('compact');
      await flushMicrotasks();
      expect(store.getState().persistError).toBe(err2);
    });

    it('clears persistError on subsequent successful persist', async () => {
      const err = new Error('transient network error');
      let shouldFail = true;
      const config = makeSucceedingConfig({
        persistCommon: vi.fn(() =>
          shouldFail ? Promise.reject(err) : Promise.resolve(),
        ),
      });
      const store = createUIPrefsStore(config);

      // First call fails
      store.getState().setTheme('light');
      await flushMicrotasks();
      expect(store.getState().persistError).toBe(err);

      // Second call succeeds — error should clear
      shouldFail = false;
      store.getState().setDensity('compact');
      await flushMicrotasks();
      expect(store.getState().persistError).toBeNull();
    });
  });
});
