/**
 * AppShell — top-level 5-zone CSS grid layout wrapper for pd-* SPAs.
 *
 * Grid template:
 *   "header header header header"
 *   "rail   drawer  main   right"
 *
 * Columns: var(--shell-rail-w, 64px) | var(--shell-drawer-w, 0px) | 1fr | var(--shell-right-w, 0px)
 * Rows:    var(--shell-header-h, 0px) | 1fr
 *
 * When `header` is undefined (the default), AppShell renders its own built-in
 * AppShellHeader: app icon + app name + spacer + LauncherSlot + SettingsSlot.
 * Pass a custom `header` node as an escape hatch for apps that need full control.
 *
 * Optional zone slots (rail, drawer, rightPanel) render their wrapper divs only
 * when content is provided — absent zones collapse via CSS variable defaults.
 *
 * Provides AppShellContext so nested components can call useAppShell().
 * UIPrefsApplicator applies UIPrefs changes to the DOM (data-density, zoom, data-theme).
 */
import * as React from 'react';
import { AppShellContext } from './AppShellContext.js';
import { UIPrefsStoreProvider } from '../stores/StoreContexts.js';
import { createUIPrefsStore } from '../stores/createUIPrefsStore.js';
import { LauncherSlot } from './LauncherSlot.js';
import { SettingsSlot } from './SettingsSlot.js';
import { UIPrefsApplicator } from './UIPrefsApplicator.js';
import { TopNav } from './TopNav.js';
import type { AppShellProps, AppShellContextValue } from './types.js';

// ─── Built-in header ──────────────────────────────────────────────────────────

interface AppShellHeaderProps {
  appIconUrl?: string;
  appDisplayName: string;
}

function AppShellHeader({ appIconUrl, appDisplayName }: AppShellHeaderProps) {
  return (
    <TopNav>
      {appIconUrl && (
        <img
          src={appIconUrl}
          alt=""
          width={20}
          height={20}
          style={{ borderRadius: 4, flexShrink: 0 }}
        />
      )}
      <span
        style={{
          fontSize: 13,
          fontWeight: 600,
          color: 'var(--ink-1)',
          letterSpacing: '-0.01em',
          whiteSpace: 'nowrap',
        }}
      >
        {appDisplayName}
      </span>
      <div style={{ flex: 1 }} />
      <LauncherSlot />
      <SettingsSlot />
    </TopNav>
  );
}

AppShellHeader.displayName = 'AppShellHeader';

// ─── AppShell ─────────────────────────────────────────────────────────────────

export function AppShell({
  appId,
  appDisplayName,
  appIconUrl,
  header,
  rail,
  drawer,
  main,
  rightPanel,
  footer,
  launcherSlot = 'header',
  uiPrefsConfig,
  deployMode = 'local',
  children,
}: AppShellProps & { children?: React.ReactNode }) {
  // Stable store instance: created once per AppShell mount.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const uiPrefsStore = React.useMemo(() => createUIPrefsStore(uiPrefsConfig), []);

  const ctx: AppShellContextValue = React.useMemo(
    () => ({ appId, appDisplayName, appIconUrl, deployMode, launcherSlot }),
    [appId, appDisplayName, appIconUrl, deployMode, launcherSlot],
  );

  // Determine the resolved header content.
  // When `header` is undefined, use the built-in AppShellHeader.
  const resolvedHeader: React.ReactNode =
    header !== undefined
      ? header
      : <AppShellHeader appIconUrl={appIconUrl} appDisplayName={appDisplayName} />;

  return (
    <UIPrefsStoreProvider value={uiPrefsStore}>
      <AppShellContext.Provider value={ctx}>
        <UIPrefsApplicator />
        <div
          data-testid="app-shell"
          style={{
            display: 'grid',
            gridTemplateAreas: footer
              ? '"header header header header" "rail drawer main right" "footer footer footer footer"'
              : '"header header header header" "rail drawer main right"',
            gridTemplateColumns:
              'var(--shell-rail-w, 0px) var(--shell-drawer-w, 0px) 1fr var(--shell-right-w, 0px)',
            gridTemplateRows: footer
              ? 'var(--shell-header-h, 56px) 1fr var(--shell-footer-h, auto)'
              : 'var(--shell-header-h, 56px) 1fr',
            height: '100%',
            width: '100%',
            overflow: 'hidden',
          }}
        >
          {/* Header zone — always rendered (built-in or custom) */}
          <div
            data-testid="app-shell-header"
            style={{ gridArea: 'header' }}
            className="min-w-0 overflow-hidden"
          >
            {resolvedHeader}
          </div>

          {/* Rail zone */}
          <div
            data-testid="app-shell-rail"
            style={{ gridArea: 'rail' }}
            className="min-w-0 overflow-hidden"
          >
            {rail}
          </div>

          {/* Drawer zone */}
          <div
            data-testid="app-shell-drawer"
            style={{ gridArea: 'drawer' }}
            className="min-w-0 overflow-hidden"
          >
            {drawer}
          </div>

          {/* Main content zone (required) */}
          <div
            data-testid="app-shell-main"
            style={{ gridArea: 'main' }}
            className="min-w-0 min-h-0 overflow-hidden"
          >
            {main}
          </div>

          {/* Right panel zone */}
          <div
            data-testid="app-shell-right"
            style={{ gridArea: 'right' }}
            className="min-w-0 overflow-hidden"
          >
            {rightPanel}
          </div>

          {/* Footer zone (issue #14) — only rendered when footer prop is provided */}
          {footer !== undefined && (
            <div
              data-testid="app-shell-footer"
              style={{ gridArea: 'footer' }}
              className="min-w-0 overflow-hidden"
            >
              {footer}
            </div>
          )}
        </div>

        {/* children slot — for context consumers rendered outside the grid zones */}
        {children}
      </AppShellContext.Provider>
    </UIPrefsStoreProvider>
  );
}

AppShell.displayName = 'AppShell';
