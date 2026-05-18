/**
 * createUIPrefsStore — Zustand store factory for UI preferences.
 *
 * Returns a fresh store per call. Apps instantiate one per AppShell, passing
 * the load/persist callbacks from their pd-ocr-ops backend integration.
 *
 * The store calls `config.load()` once on construction to hydrate from the
 * backend; `config.persistCommon` fires on theme/density changes;
 * `config.persistApp` fires on app-specific prefs changes.
 *
 * Hooks:
 *   useTheme()          → 'dark' | 'light'
 *   useDensity()        → 'compact' | 'normal' | 'comfortable'
 *   useFontScale()      → number (0.8–1.4)
 *   useLayerColor(layer) → string (CSS var fallback when not overridden)
 *   useStatusColor(status) → string
 *   useAccentColor()    → { fg: string; bg: string }
 *   useUIPrefs()        → UIPrefs
 */
import { createStore } from 'zustand/vanilla';
import type { UIPrefs, UIPrefsConfig } from '../shell/types.js';

// ─── Default CSS token fallbacks ──────────────────────────────────────────────

const LAYER_TOKEN_DEFAULTS: Record<'block' | 'para' | 'line' | 'word', string> = {
  block: 'var(--block)',
  para:  'var(--para)',
  line:  'var(--line)',
  word:  'var(--word)',
};

const STATUS_TOKEN_DEFAULTS: Record<'exact' | 'fuzzy' | 'mismatch' | 'ocr' | 'gt', string> = {
  exact:    'var(--exact)',
  fuzzy:    'var(--fuzzy)',
  mismatch: 'var(--mismatch)',
  ocr:      'var(--ocr)',
  gt:       'var(--gt)',
};

// ─── Store state ──────────────────────────────────────────────────────────────

export interface UIPrefsStoreState {
  /** Current preferences (reflects last successful load). */
  prefs: UIPrefs;
  /** True while the initial load() call is in-flight. */
  loading: boolean;

  /** Update theme and debounce-persist common prefs. */
  setTheme: (theme: UIPrefs['theme']) => void;
  /** Update density and debounce-persist common prefs. */
  setDensity: (density: UIPrefs['density']) => void;
  /** Update font scale (clamped to [0.8, 1.4]) and persist common prefs. */
  setFontScale: (scale: number) => void;
  /** Update an app-specific pref and debounce-persist. */
  setAppPref: (key: string, value: unknown) => void;

  // ── Derived helpers (stable references; computed inline for simplicity) ────
  /** Returns the CSS color for the given layer (override or token fallback). */
  getLayerColor: (layer: 'block' | 'para' | 'line' | 'word') => string;
  /** Returns the CSS color for the given status (override or token fallback). */
  getStatusColor: (status: 'exact' | 'fuzzy' | 'mismatch' | 'ocr' | 'gt') => string;
  /** Returns the accent fg/bg colors (override or token fallback). */
  getAccentColor: () => { fg: string; bg: string };
}

export function createUIPrefsStore(config: UIPrefsConfig) {
  const store = createStore<UIPrefsStoreState>()((set, get) => {
    // Bootstrap: load prefs async after creation.
    config.load().then((prefs) => {
      set({ prefs, loading: false });
    }).catch(() => {
      // Load failure is non-fatal: keep defaults.
      set({ loading: false });
    });

    return {
      prefs: { theme: 'dark', density: 'normal', fontScale: 1.0 },
      loading: true,

      setTheme: (theme) => {
        const prefs = { ...get().prefs, theme };
        set({ prefs });
        void config.persistCommon({ theme, density: prefs.density, fontScale: prefs.fontScale });
      },

      setDensity: (density) => {
        const prefs = { ...get().prefs, density };
        set({ prefs });
        void config.persistCommon({ theme: prefs.theme, density, fontScale: prefs.fontScale });
      },

      setFontScale: (scale) => {
        const fontScale = Math.min(1.4, Math.max(0.8, scale));
        const prefs = { ...get().prefs, fontScale };
        set({ prefs });
        void config.persistCommon({ theme: prefs.theme, density: prefs.density, fontScale });
      },

      setAppPref: (key, value) => {
        const prev = get().prefs.app ?? {};
        const app = { ...prev, [key]: value };
        const prefs = { ...get().prefs, app };
        set({ prefs });
        void config.persistApp(app);
      },

      getLayerColor: (layer) => {
        const override = get().prefs.layerColors?.[layer];
        return override ?? LAYER_TOKEN_DEFAULTS[layer];
      },

      getStatusColor: (status) => {
        const override = get().prefs.statusColors?.[status];
        return override ?? STATUS_TOKEN_DEFAULTS[status];
      },

      getAccentColor: () => {
        const prefs = get().prefs;
        return {
          fg: prefs.accentColor ?? 'var(--accent)',
          bg: prefs.accentInkColor ?? 'var(--accent-ink)',
        };
      },
    };
  });

  return store;
}

export type UIPrefsStore = ReturnType<typeof createUIPrefsStore>;
