/**
 * AppShell deprecated props — back-compat + type contract tests.
 *
 * Issue #358: `drawer` and `rightPanel` are @deprecated (OQ-12 / 3-zone shell
 * convergence) but retained for back-compat with pdomain-ocr-labeler-spa and
 * pdomain-prep-for-pgdp until those apps migrate.
 *
 * Back-compat guarantee: both props must still render their content.
 * Type contract guarantee: both props are still present in AppShellProps.
 *   This is verified at compile time by `pnpm typecheck` / `tsc --noEmit`.
 *   At runtime the test exercises passing them without TS error — if the props
 *   were removed from the interface, this file would fail `tsc --noEmit`.
 */
import * as React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { AppShell } from './AppShell.js';
import type { AppShellProps } from './types.js';

// ─── Fixtures ─────────────────────────────────────────────────────────────────

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

// ─── Back-compat tests ────────────────────────────────────────────────────────

describe('AppShell — deprecated props back-compat (#358)', () => {
  it('drawer prop still renders its content (back-compat)', () => {
    render(
      <AppShell
        {...minimalProps({
          drawer: <div data-testid="legacy-drawer">drawer content</div>,
        })}
      />,
    );
    expect(screen.getByTestId('legacy-drawer')).toBeTruthy();
    expect(screen.getByTestId('app-shell-drawer')).toBeTruthy();
  });

  it('rightPanel prop still renders its content (back-compat)', () => {
    render(
      <AppShell
        {...minimalProps({
          rightPanel: <div data-testid="legacy-right-panel">right panel content</div>,
        })}
      />,
    );
    expect(screen.getByTestId('legacy-right-panel')).toBeTruthy();
    expect(screen.getByTestId('app-shell-right')).toBeTruthy();
  });

  it('drawer and rightPanel can be used together (back-compat)', () => {
    render(
      <AppShell
        {...minimalProps({
          drawer: <div data-testid="legacy-drawer-2">drawer</div>,
          rightPanel: <div data-testid="legacy-right-2">right</div>,
        })}
      />,
    );
    expect(screen.getByTestId('legacy-drawer-2')).toBeTruthy();
    expect(screen.getByTestId('legacy-right-2')).toBeTruthy();
  });

  it('main content is unaffected when deprecated props are also provided', () => {
    render(
      <AppShell
        {...minimalProps({
          drawer: <div>drawer</div>,
          rightPanel: <div>right</div>,
        })}
      />,
    );
    expect(screen.getByTestId('slot-main')).toBeTruthy();
  });
});

// ─── Type contract tests ──────────────────────────────────────────────────────
//
// These tests are intentionally minimal at runtime — the real assertion is
// at compile time: if `drawer` or `rightPanel` were removed from AppShellProps,
// `tsc --noEmit` would fail on the assignments below.

describe('AppShell — deprecated props type contract (#358)', () => {
  it('AppShellProps has optional drawer prop (compile-time + runtime)', () => {
    // Type-level: this object literal must satisfy AppShellProps without error.
    // If drawer were removed from the interface, TypeScript would error here.
    const props: AppShellProps = minimalProps({
      drawer: <div>drawer</div>,
    });
    expect('drawer' in props).toBe(true);
  });

  it('AppShellProps has optional rightPanel prop (compile-time + runtime)', () => {
    // Type-level: this object literal must satisfy AppShellProps without error.
    // If rightPanel were removed from the interface, TypeScript would error here.
    const props: AppShellProps = minimalProps({
      rightPanel: <div>right panel</div>,
    });
    expect('rightPanel' in props).toBe(true);
  });

  it('drawer and rightPanel props accept ReactNode (compile-time + runtime)', () => {
    // Both props accept arbitrary ReactNode values.
    const drawerContent: React.ReactNode = <span>content</span>;
    const rightPanelContent: React.ReactNode = <span>content</span>;

    const props: AppShellProps = minimalProps({
      drawer: drawerContent,
      rightPanel: rightPanelContent,
    });

    // At runtime, confirm the values are stored in the props object.
    expect(props.drawer).toBe(drawerContent);
    expect(props.rightPanel).toBe(rightPanelContent);
  });
});
