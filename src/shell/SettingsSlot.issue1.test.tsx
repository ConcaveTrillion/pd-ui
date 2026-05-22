/**
 * Tests for issue #1 (historical): SettingsSlot font-scale slider jumping.
 *
 * Issue #1 was about the Radix Popover dismissing during slider drag reflow.
 * After issue #19, the Popover is replaced by a Dialog-based SettingsModal.
 * The font-scale slider now lives in AppearancePanel inside the Dialog.
 *
 * These tests verify that the gear trigger works correctly and that there
 * is no popover (the old fix is now superseded by the Dialog approach).
 */
import * as React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { SettingsSlot } from './SettingsSlot.js'
import { SettingsModalContext } from './SettingsModalContext.js'
import type { SettingsModalContextValue } from './SettingsModalContext.js'

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

function Wrapper({ children, ctx = makeCtx() }: {
  children: React.ReactNode
  ctx?: SettingsModalContextValue
}) {
  return (
    <SettingsModalContext.Provider value={ctx}>
      {children}
    </SettingsModalContext.Provider>
  )
}

describe('SettingsSlot — popover superseded by SettingsModal (#1 → #19)', () => {
  it('gear trigger calls openModal() — font-scale is now in the Dialog, not a Popover', () => {
    const openModal = vi.fn();
    render(
      <Wrapper ctx={makeCtx({ openModal })}>
        <SettingsSlot />
      </Wrapper>,
    )

    fireEvent.click(screen.getByTestId('settings-slot-trigger'))
    expect(openModal).toHaveBeenCalledOnce()
  })

  it('no popover element rendered by SettingsSlot (moved to SettingsModal)', () => {
    render(
      <Wrapper>
        <SettingsSlot />
      </Wrapper>,
    )

    expect(screen.queryByTestId('settings-slot-popover')).toBeNull()
  })

  it('gear trigger still opens modal after multiple interactions', () => {
    const openModal = vi.fn();
    render(
      <Wrapper ctx={makeCtx({ openModal })}>
        <SettingsSlot />
      </Wrapper>,
    )

    fireEvent.click(screen.getByTestId('settings-slot-trigger'))
    fireEvent.click(screen.getByTestId('settings-slot-trigger'))
    fireEvent.click(screen.getByTestId('settings-slot-trigger'))

    expect(openModal).toHaveBeenCalledTimes(3)
  })
})
