/**
 * pd-ui/shell subpath export.
 *
 * Re-exports all public shell API:
 *   - AppShell component + context hook
 *   - LauncherSlot + LauncherTile
 *   - SuiteSiblingsProvider + useSuiteSiblings (M8.4)
 *   - Sub-shell layout primitives (Breadcrumb, TopNav, Drawer, Rail, RightPanel)
 *   - All shell types (AppShellProps, NavItem, UIPrefsConfig, etc.)
 */

// ─── Types ────────────────────────────────────────────────────────────────────
export type {
  AppShellProps,
  AppShellContextValue,
  NavItem,
  UIPrefsConfig,
  UIPrefs,
  SuiteApp,
  InstalledApp,
  LaunchResult,
} from './types.js';

// ─── AppShell ─────────────────────────────────────────────────────────────────
export { AppShell } from './AppShell.js';
export { useAppShell } from './AppShellContext.js';

// ─── LauncherSlot + LauncherTile ──────────────────────────────────────────────
export { LauncherSlot } from './LauncherSlot.js';
export { LauncherTile } from './LauncherTile.js';
export type { LauncherTileProps } from './LauncherTile.js';

// ─── SettingsSlot ─────────────────────────────────────────────────────────────
export { SettingsSlot } from './SettingsSlot.js';

// ─── UIPrefsApplicator ────────────────────────────────────────────────────────
export { UIPrefsApplicator } from './UIPrefsApplicator.js';

// ─── UIPrefsConfig factory ────────────────────────────────────────────────────
export { createApiUIPrefsConfig } from './createApiUIPrefsConfig.js';

// ─── SuiteSiblings (M8.4) ─────────────────────────────────────────────────────
export { SuiteSiblingsContext, useSuiteSiblingsContext } from './SuiteSiblingsContext.js';
export type { SuiteSiblingsContextValue } from './SuiteSiblingsContext.js';

export { SuiteSiblingsProvider } from './SuiteSiblingsProvider.js';
export type { SuiteSiblingsProviderProps } from './SuiteSiblingsProvider.js';

// ─── Sub-shell layout primitives ──────────────────────────────────────────────
export { Breadcrumb } from './Breadcrumb.js';
export type { BreadcrumbProps } from './Breadcrumb.js';

export { TopNav } from './TopNav.js';
export type { TopNavProps } from './TopNav.js';

export { Drawer } from './Drawer.js';
export type { DrawerProps } from './Drawer.js';

export { Rail } from './Rail.js';
export type { RailProps } from './Rail.js';

export { RightPanel } from './RightPanel.js';
export type { RightPanelProps } from './RightPanel.js';
