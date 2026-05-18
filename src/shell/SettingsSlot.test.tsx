/**
 * SettingsSlot tests — verifies gear button, popover open, density + font-scale
 * wiring.
 */
import * as React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { SettingsSlot } from './SettingsSlot.js';
import { UIPrefsStoreProvider } from '../stores/StoreContexts.js';
import { createUIPrefsStore } from '../stores/createUIPrefsStore.js';
import type { UIPrefsConfig, UIPrefs } from './types.js';

// ─── Helpers ──────────────────────────────────────────────────────────────────

function makeStore(overrides?: Partial<UIPrefsConfig>) {
  const config: UIPrefsConfig = {
    load: () => Promise.resolve({ theme: 'dark' as const, density: 'normal' as const, fontScale: 1.0 }),
    persistCommon: vi.fn<[Pick<UIPrefs, 'theme' | 'density' | 'fontScale'>], Promise<void>>().mockResolvedValue(undefined),
    persistApp: vi.fn<[Record<string, unknown>], Promise<void>>().mockResolvedValue(undefined),
    ...overrides,
  };
  return createUIPrefsStore(config);
}

function Wrapper({ children, store = makeStore() }: {
  children: React.ReactNode;
  store?: ReturnType<typeof makeStore>;
}) {
  return (
    <UIPrefsStoreProvider value={store}>
      {children}
    </UIPrefsStoreProvider>
  );
}

// ─── Tests ────────────────────────────────────────────────────────────────────

describe('SettingsSlot', () => {
  it('renders a button with aria-label matching "settings" or "preferences"', () => {
    render(
      <Wrapper>
        <SettingsSlot />
      </Wrapper>,
    );
    const trigger = screen.getByTestId('settings-slot-trigger');
    expect(trigger).toBeTruthy();
    const ariaLabel = trigger.getAttribute('aria-label') ?? '';
    expect(ariaLabel.toLowerCase()).toMatch(/settings|preferences/);
  });

  it('clicking the gear button opens the popover', () => {
    render(
      <Wrapper>
        <SettingsSlot />
      </Wrapper>,
    );

    // Popover content should not be in the DOM before click.
    expect(screen.queryByTestId('settings-slot-popover')).toBeNull();

    fireEvent.click(screen.getByTestId('settings-slot-trigger'));

    expect(screen.getByTestId('settings-slot-popover')).toBeTruthy();
  });

  it('clicking Dark button calls setTheme("dark")', () => {
    const persistCommon = vi.fn<[Pick<UIPrefs, 'theme' | 'density' | 'fontScale'>], Promise<void>>().mockResolvedValue(undefined);
    const store = makeStore({ persistCommon });

    render(
      <Wrapper store={store}>
        <SettingsSlot />
      </Wrapper>,
    );

    fireEvent.click(screen.getByTestId('settings-slot-trigger'));
    fireEvent.click(screen.getByTestId('settings-theme-dark'));

    expect(persistCommon).toHaveBeenCalled();
  });

  it('clicking Compact density button calls setDensity("compact")', () => {
    const persistCommon = vi.fn<[Pick<UIPrefs, 'theme' | 'density' | 'fontScale'>], Promise<void>>().mockResolvedValue(undefined);
    const store = makeStore({ persistCommon });

    render(
      <Wrapper store={store}>
        <div data-testid="app-shell" />
        <SettingsSlot />
      </Wrapper>,
    );

    fireEvent.click(screen.getByTestId('settings-slot-trigger'));
    fireEvent.click(screen.getByTestId('settings-density-compact'));

    // persistCommon should have been called with density 'compact'
    const calls = persistCommon.mock.calls;
    expect(calls.some((c) => c[0].density === 'compact')).toBe(true);
  });

  it('moving the font-scale slider calls setFontScale', () => {
    const persistCommon = vi.fn<[Pick<UIPrefs, 'theme' | 'density' | 'fontScale'>], Promise<void>>().mockResolvedValue(undefined);
    const store = makeStore({ persistCommon });

    render(
      <Wrapper store={store}>
        <SettingsSlot />
      </Wrapper>,
    );

    fireEvent.click(screen.getByTestId('settings-slot-trigger'));

    const slider = screen.getByTestId('settings-font-scale-slider');
    fireEvent.change(slider, { target: { value: '1.2' } });

    const calls = persistCommon.mock.calls;
    expect(calls.some((c) => c[0].fontScale === 1.2)).toBe(true);
  });
});
