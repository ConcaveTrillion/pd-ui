/**
 * UIPrefsApplicator — side-effect component that applies UIPrefs to the DOM.
 *
 * - Writes `data-density` onto the `[data-testid="app-shell"]` element.
 * - Writes CSS `zoom` onto `document.documentElement` for font scale.
 * - Writes `data-theme` onto `document.documentElement`.
 *
 * Must be rendered inside both UIPrefsStoreProvider and AppShellContext.
 * Returns null — no visual output.
 */
import * as React from 'react';
import { useDensity, useFontScale, useTheme } from '../stores/StoreContexts.js';

export function UIPrefsApplicator() {
  const density = useDensity();
  const fontScale = useFontScale();
  const theme = useTheme();

  // Apply data-density to the app-shell root element.
  React.useEffect(() => {
    const el = document.querySelector<HTMLElement>('[data-testid="app-shell"]');
    if (el) el.setAttribute('data-density', density);
  }, [density]);

  // Apply font scale via CSS zoom on the document root.
  React.useEffect(() => {
    if (fontScale === 1.0) {
      document.documentElement.style.removeProperty('zoom');
    } else {
      document.documentElement.style.zoom = String(fontScale);
    }
    return () => {
      document.documentElement.style.removeProperty('zoom');
    };
  }, [fontScale]);

  // Apply data-theme to the document root for CSS cascade.
  React.useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    return () => {
      document.documentElement.removeAttribute('data-theme');
    };
  }, [theme]);

  return null;
}

UIPrefsApplicator.displayName = 'UIPrefsApplicator';
