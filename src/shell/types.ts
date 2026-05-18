/**
 * AppShell type contract.
 *
 * Matches the surface defined in spec §6 of 2026-05-16-cross-cut-design.md.
 * `SuiteApp`, `InstalledApp`, `UIPrefs` live in /types once pd-ocr-ops codegen
 * lands (M4 re-enable). Until then they are defined here as minimal local types
 * used only within the shell and stores subpaths.
 */
import type * as React from 'react';

// ─── Suite types (local stubs — will be replaced by codegen from pd-ocr-ops) ─

/** An app that is part of the pd-suite (registered in pd-suite.json). */
export interface SuiteApp {
  id: string;
  displayName: string;
  iconUrl?: string;
  url?: string;
}

/** An app that is currently installed and running on this machine. */
export interface InstalledApp extends SuiteApp {
  pid?: number;
  launchUrl: string;
}

/** User interface preferences stored in the per-app prefs file. */
export interface UIPrefs {
  theme: 'dark' | 'light';
  density: 'compact' | 'normal' | 'comfortable';
  /** Font scale multiplier applied via CSS zoom. Range [0.8, 1.4]. Default 1.0. */
  fontScale: number;
  /** Layer colors keyed by layer name. Falls back to CSS token defaults when absent. */
  layerColors?: Partial<Record<'block' | 'para' | 'line' | 'word', string>>;
  /** Status colors keyed by status name. Falls back to CSS token defaults when absent. */
  statusColors?: Partial<Record<'exact' | 'fuzzy' | 'mismatch' | 'ocr' | 'gt', string>>;
  /** Accent override (optional). When absent, the CSS `--accent` token is used. */
  accentColor?: string;
  /** Accent foreground override. When absent `--accent-ink` is used. */
  accentInkColor?: string;
  /** App-specific arbitrary preferences. */
  app?: Record<string, unknown>;
}

// ─── UIPrefsConfig ────────────────────────────────────────────────────────────

/** Callbacks wired into createUIPrefsStore. */
export interface UIPrefsConfig {
  /** Async loader; called once on first subscribe. */
  load: () => Promise<UIPrefs>;
  /** Called when common prefs (theme, density, fontScale) change. */
  persistCommon: (prefs: Pick<UIPrefs, 'theme' | 'density' | 'fontScale'>) => Promise<void>;
  /** Called when app-specific prefs change. */
  persistApp: (appPrefs: Record<string, unknown>) => Promise<void>;
}

// ─── NavItem ──────────────────────────────────────────────────────────────────

/** A single entry in the application navigation. */
export interface NavItem {
  id: string;
  label: string;
  /** Icon node to render in the rail / nav. */
  icon?: React.ReactNode;
  /** Optional click handler. */
  onClick?: () => void;
  /** Mark as currently active. */
  active?: boolean;
  /** Optional href for anchor-based nav. */
  href?: string;
}

// ─── LaunchResult ─────────────────────────────────────────────────────────────

export type LaunchResult =
  | { kind: 'opened'; url: string }
  | { kind: 'requires-host-config'; siblingId: string };

// ─── AppShell props ───────────────────────────────────────────────────────────

/**
 * Props for `<AppShell>` — the top-level layout wrapper for every pd-* SPA.
 *
 * Grid zones:
 *   "header header header header"
 *   "rail   drawer  main   right"
 *
 * All zone props are `ReactNode` slot fills. Absent optional zones collapse
 * to zero width/height without shifting others.
 */
export interface AppShellProps {
  /** Stable app identifier matching pd-suite.json (e.g. 'pd-ocr-labeler-spa'). */
  appId: string;
  /** Human-readable name shown in the header. */
  appDisplayName: string;
  /** URL of the app's icon (SVG or raster). */
  appIconUrl: string;
  /** Content for the top header zone. */
  header?: React.ReactNode;
  /** Content for the 64px wide left rail zone. */
  rail?: React.ReactNode;
  /** Content for the collapsible drawer zone. */
  drawer?: React.ReactNode;
  /** Content for the main content area (required). */
  main: React.ReactNode;
  /** Content for the right panel zone. */
  rightPanel?: React.ReactNode;
  /**
   * Where to inject the suite launcher.
   * - `'header'` (default) — launcher tiles appear inside the header zone.
   * - `'rail'`   — launcher tiles are appended at the bottom of the rail.
   * - `'off'`    — launcher is not rendered.
   */
  launcherSlot?: 'header' | 'rail' | 'off';
  /** UIPrefs load/persist callbacks (wired into createUIPrefsStore). */
  uiPrefsConfig: UIPrefsConfig;
  /**
   * Deployment context. Default `'local'`.
   * `'hosted'` gates local-only affordances (desktop shortcuts, etc.).
   * pd-ui itself never branches on this for real logic — adapters live in pd-ocr-ops.
   */
  deployMode?: 'local' | 'hosted';
}

// ─── AppShell context value ────────────────────────────────────────────────────

/** Value exposed via `useAppShell()` to all descendants inside an AppShell. */
export interface AppShellContextValue {
  appId: string;
  appDisplayName: string;
  appIconUrl: string;
  deployMode: 'local' | 'hosted';
  launcherSlot: 'header' | 'rail' | 'off';
}
