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
 * Optional zone slots (header, rail, drawer, rightPanel) render their wrapper
 * divs only when content is provided — absent zones collapse automatically via
 * their CSS variable defaults.
 *
 * Provides AppShellContext so nested components can call useAppShell().
 */
import * as React from 'react';
import { AppShellContext } from './AppShellContext.js';
import { UIPrefsStoreProvider } from '../stores/StoreContexts.js';
import { createUIPrefsStore } from '../stores/createUIPrefsStore.js';
import type { AppShellProps, AppShellContextValue } from './types.js';

export function AppShell({
  appId,
  appDisplayName,
  appIconUrl,
  header,
  rail,
  drawer,
  main,
  rightPanel,
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

  return (
    <UIPrefsStoreProvider value={uiPrefsStore}>
    <AppShellContext.Provider value={ctx}>
      <div
        data-testid="app-shell"
        style={{
          display: 'grid',
          gridTemplateAreas: header
            ? '"header header header header" "rail drawer main right"'
            : '"rail drawer main right"',
          gridTemplateColumns:
            'var(--shell-rail-w, 0px) var(--shell-drawer-w, 0px) 1fr var(--shell-right-w, 0px)',
          gridTemplateRows: header
            ? 'var(--shell-header-h, 56px) 1fr'
            : '1fr',
          height: '100%',
          width: '100%',
          overflow: 'hidden',
        }}
      >
        {/* Header zone — rendered only when content provided */}
        {header !== undefined && (
          <div
            data-testid="app-shell-header"
            style={{ gridArea: 'header' }}
            className="min-w-0 overflow-hidden"
          >
            {header}
          </div>
        )}

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
      </div>

      {/* children slot — for context consumers rendered outside the grid zones */}
      {children}
    </AppShellContext.Provider>
    </UIPrefsStoreProvider>
  );
}

AppShell.displayName = 'AppShell';
