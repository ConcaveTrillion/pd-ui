/**
 * AppearancePanel a11y tests — verifies that the Theme and Density segmented
 * controls expose proper ARIA semantics to assistive technology.
 *
 * Covers pdomain/pdomain-ui#47: Settings segmented controls must expose
 * selected state via role="radiogroup" + role="radio" + aria-checked.
 */
import * as React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { UIPrefsStoreProvider } from '../stores/StoreContexts.js';
import { createUIPrefsStore } from '../stores/createUIPrefsStore.js';
import type { UIPrefsConfig } from './types.js';
import { AppearancePanel } from './AppearancePanel.js';

function makeConfig(overrides: Partial<UIPrefsConfig> = {}): UIPrefsConfig {
  return {
    load: vi.fn(() =>
      Promise.resolve({
        theme: 'dark' as const,
        density: 'normal' as const,
        fontScale: 1.0,
      }),
    ),
    persistCommon: vi.fn(() => Promise.resolve()),
    persistApp: vi.fn(() => Promise.resolve()),
    ...overrides,
  };
}

function renderPanel() {
  const store = createUIPrefsStore(makeConfig());
  return render(
    <UIPrefsStoreProvider value={store}>
      <AppearancePanel />
    </UIPrefsStoreProvider>,
  );
}

describe('AppearancePanel — a11y: segmented controls', () => {
  it('renders two radiogroup containers (Theme + Density)', () => {
    renderPanel();
    const groups = screen.getAllByRole('radiogroup');
    expect(groups.length).toBeGreaterThanOrEqual(2);
  });

  it('Theme radiogroup has accessible label', () => {
    renderPanel();
    const themeGroup = screen.getByRole('radiogroup', { name: 'Theme' });
    expect(themeGroup).toBeTruthy();
  });

  it('Density radiogroup has accessible label', () => {
    renderPanel();
    const densityGroup = screen.getByRole('radiogroup', { name: 'Density' });
    expect(densityGroup).toBeTruthy();
  });

  it('Theme: active option has aria-checked=true', () => {
    renderPanel();
    // Default theme is dark
    const darkBtn = screen.getByRole('radio', { name: 'Dark' });
    expect(darkBtn.getAttribute('aria-checked')).toBe('true');
  });

  it('Theme: inactive option has aria-checked=false', () => {
    renderPanel();
    const lightBtn = screen.getByRole('radio', { name: 'Light' });
    expect(lightBtn.getAttribute('aria-checked')).toBe('false');
  });

  it('Theme: active option has tabIndex=0 (roving focus)', () => {
    renderPanel();
    const darkBtn = screen.getByRole('radio', { name: 'Dark' });
    expect(darkBtn.getAttribute('tabindex')).toBe('0');
  });

  it('Theme: inactive option has tabIndex=-1 (roving focus)', () => {
    renderPanel();
    const lightBtn = screen.getByRole('radio', { name: 'Light' });
    expect(lightBtn.getAttribute('tabindex')).toBe('-1');
  });

  it('Density: default option (normal) has aria-checked=true', () => {
    renderPanel();
    const normalBtn = screen.getByRole('radio', { name: 'Normal' });
    expect(normalBtn.getAttribute('aria-checked')).toBe('true');
  });

  it('Density: non-active options have aria-checked=false', () => {
    renderPanel();
    const compactBtn = screen.getByRole('radio', { name: 'Compact' });
    const comfyBtn = screen.getByRole('radio', { name: 'Comfortable' });
    expect(compactBtn.getAttribute('aria-checked')).toBe('false');
    expect(comfyBtn.getAttribute('aria-checked')).toBe('false');
  });

  it('Theme: clicking Light updates aria-checked', async () => {
    const user = userEvent.setup();
    renderPanel();
    await user.click(screen.getByRole('radio', { name: 'Light' }));
    expect(screen.getByRole('radio', { name: 'Light' }).getAttribute('aria-checked')).toBe('true');
    expect(screen.getByRole('radio', { name: 'Dark' }).getAttribute('aria-checked')).toBe('false');
  });
});
