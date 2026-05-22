/**
 * SettingsSlot tests — verifies gear button calls openModal from context.
 *
 * After issue #19: SettingsSlot no longer owns a Popover. It calls
 * useSettingsModal().openModal() to open the shared SettingsModal.
 * Tests here verify the button renders and wires to the context.
 */
import * as React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { SettingsSlot } from './SettingsSlot.js';
import { SettingsModalContext } from './SettingsModalContext.js';
import type { SettingsModalContextValue } from './SettingsModalContext.js';

// ─── Helpers ──────────────────────────────────────────────────────────────────

function makeCtx(overrides?: Partial<SettingsModalContextValue>): SettingsModalContextValue {
  return {
    open: false,
    activePanel: 'appearance',
    openModal: vi.fn(),
    closeModal: vi.fn(),
    openPanel: vi.fn(),
    ...overrides,
  };
}

function Wrapper({
  children,
  ctx = makeCtx(),
}: {
  children: React.ReactNode;
  ctx?: SettingsModalContextValue;
}) {
  return (
    <SettingsModalContext.Provider value={ctx}>
      {children}
    </SettingsModalContext.Provider>
  );
}

// ─── Tests ────────────────────────────────────────────────────────────────────

describe('SettingsSlot', () => {
  it('renders a button with data-testid="settings-slot-trigger"', () => {
    render(
      <Wrapper>
        <SettingsSlot />
      </Wrapper>,
    );
    const trigger = screen.getByTestId('settings-slot-trigger');
    expect(trigger).toBeTruthy();
  });

  it('button has aria-label matching "settings" or "preferences"', () => {
    render(
      <Wrapper>
        <SettingsSlot />
      </Wrapper>,
    );
    const trigger = screen.getByTestId('settings-slot-trigger');
    const ariaLabel = trigger.getAttribute('aria-label') ?? '';
    expect(ariaLabel.toLowerCase()).toMatch(/settings|preferences/);
  });

  it('clicking the gear calls openModal()', () => {
    const openModal = vi.fn();
    const ctx = makeCtx({ openModal });

    render(
      <Wrapper ctx={ctx}>
        <SettingsSlot />
      </Wrapper>,
    );

    fireEvent.click(screen.getByTestId('settings-slot-trigger'));
    expect(openModal).toHaveBeenCalledOnce();
  });

  it('does NOT render a popover or inline controls', () => {
    render(
      <Wrapper>
        <SettingsSlot />
      </Wrapper>,
    );
    // The old Popover no longer exists
    expect(screen.queryByTestId('settings-slot-popover')).toBeNull();
    expect(screen.queryByTestId('settings-theme-dark')).toBeNull();
  });
});
