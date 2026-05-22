/**
 * SettingsModal context — provides programmatic open/close/panel control
 * to any descendant of AppShell.
 *
 * Usage:
 *   const { openModal, closeModal, openPanel } = useSettingsModal();
 *
 * Throws if used outside an <AppShell>.
 */
import * as React from 'react';

export interface SettingsModalContextValue {
  /** Whether the modal is currently open. */
  open: boolean;
  /** Active panel id. 'appearance' is the built-in default. */
  activePanel: string;
  /** Open the modal without changing the active panel. */
  openModal: () => void;
  /** Close the modal. */
  closeModal: () => void;
  /** Open the modal with a specific panel active. */
  openPanel: (panelId: string) => void;
}

export const SettingsModalContext =
  React.createContext<SettingsModalContextValue | null>(null);

/**
 * Returns the SettingsModal context value. Must be called from a component
 * rendered inside an `<AppShell>` — throws if the context is missing.
 */
export function useSettingsModal(): SettingsModalContextValue {
  const ctx = React.useContext(SettingsModalContext);
  if (ctx === null) {
    throw new Error('useSettingsModal() must be used inside an <AppShell>');
  }
  return ctx;
}
