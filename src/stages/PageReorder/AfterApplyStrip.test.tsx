import * as React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { AfterApplyStrip } from './AfterApplyStrip.js';
import { REORDER_AFTER_APPLY_STRIP, REORDER_AFTER_APPLY_STRIP_UNDO } from '../../testids/index.js';

// ── count rendering ────────────────────────────────────────────────────────────

describe('AfterApplyStrip — count rendering', () => {
  it('renders accepted count in summary text', () => {
    render(<AfterApplyStrip acceptedCount={3} skippedCount={1} />);
    expect(screen.getByText(/Accepted 3/)).toBeInTheDocument();
  });

  it('renders skipped count in summary text', () => {
    render(<AfterApplyStrip acceptedCount={3} skippedCount={1} />);
    expect(screen.getByText(/Skipped 1/)).toBeInTheDocument();
  });

  it('renders "Accepted 0 · Skipped 0" when both are zero', () => {
    render(<AfterApplyStrip acceptedCount={0} skippedCount={0} />);
    expect(screen.getByText('Accepted 0 · Skipped 0')).toBeInTheDocument();
  });

  it('renders large counts correctly', () => {
    render(<AfterApplyStrip acceptedCount={120} skippedCount={34} />);
    expect(screen.getByText('Accepted 120 · Skipped 34')).toBeInTheDocument();
  });
});

// ── Undo button presence ───────────────────────────────────────────────────────

describe('AfterApplyStrip — Undo button presence', () => {
  it('renders Undo button when onUndo callback is provided', () => {
    render(<AfterApplyStrip acceptedCount={2} skippedCount={0} onUndo={vi.fn()} />);
    expect(screen.getByTestId(REORDER_AFTER_APPLY_STRIP_UNDO)).toBeInTheDocument();
    expect(screen.getByTestId(REORDER_AFTER_APPLY_STRIP_UNDO)).toHaveTextContent('Undo');
  });

  it('hides Undo button when onUndo is not provided', () => {
    render(<AfterApplyStrip acceptedCount={2} skippedCount={0} />);
    expect(screen.queryByTestId(REORDER_AFTER_APPLY_STRIP_UNDO)).not.toBeInTheDocument();
  });
});

// ── Undo click interaction ─────────────────────────────────────────────────────

describe('AfterApplyStrip — Undo interaction', () => {
  it('calls onUndo when Undo button is clicked', async () => {
    const user = userEvent.setup();
    const onUndo = vi.fn();
    render(<AfterApplyStrip acceptedCount={2} skippedCount={1} onUndo={onUndo} />);
    await user.click(screen.getByTestId(REORDER_AFTER_APPLY_STRIP_UNDO));
    expect(onUndo).toHaveBeenCalledTimes(1);
  });

  it('does not call onUndo from other interactions', () => {
    const onUndo = vi.fn();
    render(<AfterApplyStrip acceptedCount={2} skippedCount={1} onUndo={onUndo} />);
    // root element click should not trigger onUndo
    const root = screen.getByTestId(REORDER_AFTER_APPLY_STRIP);
    root.click();
    expect(onUndo).not.toHaveBeenCalled();
  });
});

// ── testid forwarding ─────────────────────────────────────────────────────────

describe('AfterApplyStrip — testid forwarding', () => {
  it('uses the default REORDER_AFTER_APPLY_STRIP testid', () => {
    render(<AfterApplyStrip acceptedCount={1} skippedCount={0} />);
    expect(screen.getByTestId(REORDER_AFTER_APPLY_STRIP)).toBeInTheDocument();
  });

  it('forwards a custom data-testid to the root element', () => {
    render(<AfterApplyStrip acceptedCount={1} skippedCount={0} data-testid="custom-strip" />);
    expect(screen.getByTestId('custom-strip')).toBeInTheDocument();
    expect(screen.queryByTestId(REORDER_AFTER_APPLY_STRIP)).not.toBeInTheDocument();
  });
});
