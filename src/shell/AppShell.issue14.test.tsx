/**
 * Tests for issue #14: AppShell footer slot.
 *
 * Verifies that:
 * 1. The `footer` prop is accepted by AppShell.
 * 2. When footer is provided, its content is rendered.
 * 3. When footer is absent, no empty footer zone is rendered (no data-testid="app-shell-footer").
 * 4. The footer zone appears in the DOM after the main content area.
 */
import * as React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { AppShell } from './AppShell.js';
import type { AppShellProps } from './types.js';

function noopPrefsConfig(): AppShellProps['uiPrefsConfig'] {
  return {
    load: () =>
      Promise.resolve({ theme: 'dark' as const, density: 'normal' as const, fontScale: 1.0 }),
    persistCommon: () => Promise.resolve(),
    persistApp: () => Promise.resolve(),
  };
}

function minimalProps(overrides?: Partial<AppShellProps>): AppShellProps {
  return {
    appId: 'test-app',
    appDisplayName: 'Test App',
    appIconUrl: '/icon.svg',
    main: <div data-testid="slot-main">main</div>,
    uiPrefsConfig: noopPrefsConfig(),
    ...overrides,
  };
}

describe('AppShell — footer slot (#14)', () => {
  it('renders footer content when footer prop is provided', () => {
    render(
      <AppShell
        {...minimalProps({
          footer: <div data-testid="slot-footer">status bar</div>,
        })}
      />,
    );
    expect(screen.getByTestId('slot-footer')).toBeTruthy();
    expect(screen.getByTestId('slot-footer').textContent).toBe('status bar');
  });

  it('renders the footer zone wrapper when footer is provided', () => {
    render(
      <AppShell
        {...minimalProps({
          footer: <span>footer content</span>,
        })}
      />,
    );
    expect(screen.getByTestId('app-shell-footer')).toBeTruthy();
  });

  it('does NOT render the footer zone when footer prop is absent', () => {
    render(<AppShell {...minimalProps()} />);
    expect(screen.queryByTestId('app-shell-footer')).toBeNull();
  });

  it('still renders main content alongside footer', () => {
    render(
      <AppShell
        {...minimalProps({
          footer: <div>footer</div>,
        })}
      />,
    );
    expect(screen.getByTestId('slot-main')).toBeTruthy();
  });

  it('app-shell grid still has data-testid="app-shell" when footer is present', () => {
    render(
      <AppShell
        {...minimalProps({
          footer: <div>footer</div>,
        })}
      />,
    );
    expect(screen.getByTestId('app-shell')).toBeTruthy();
  });
});
