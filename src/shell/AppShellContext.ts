/**
 * AppShell context — provides shell metadata to all descendants.
 *
 * Usage:
 *   const { deployMode, appId } = useAppShell();
 *
 * Throws if used outside an <AppShell>.
 */
import * as React from 'react';
import type { AppShellContextValue } from './types.js';

export const AppShellContext = React.createContext<AppShellContextValue | null>(null);

/**
 * Returns the AppShell context value. Must be called from a component
 * rendered inside an `<AppShell>` — throws if the context is missing.
 */
export function useAppShell(): AppShellContextValue {
  const ctx = React.useContext(AppShellContext);
  if (ctx === null) {
    throw new Error('useAppShell() must be used inside an <AppShell>');
  }
  return ctx;
}
