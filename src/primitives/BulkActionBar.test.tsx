import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { createRef } from 'react';
import { BulkActionBar } from './BulkActionBar.js';

describe('BulkActionBar', () => {
  // ---------- rendering ----------

  it('renders a <div> with .bulk-action-bar class', () => {
    render(<BulkActionBar count={3} data-testid="bar" />);
    const el = screen.getByTestId('bar');
    expect(el.tagName).toBe('DIV');
    expect(el.classList.contains('bulk-action-bar')).toBe(true);
  });

  it('renders the selection count text', () => {
    render(<BulkActionBar count={5} />);
    expect(screen.getByText(/5 selected/i)).toBeTruthy();
  });

  it('renders count = 1 with singular form', () => {
    render(<BulkActionBar count={1} />);
    // 1 selected (no plural change needed — design says "{count} selected")
    expect(screen.getByText(/1 selected/i)).toBeTruthy();
  });

  it('does not render flag summary when not provided', () => {
    render(<BulkActionBar count={3} data-testid="bar" />);
    expect(screen.queryByTestId('bulk-action-bar-flag-summary')).toBeNull();
  });

  it('renders flag summary when provided', () => {
    render(<BulkActionBar count={3} flagSummary="2 over-crop · 1 deskew·fail" />);
    const summary = screen.getByTestId('bulk-action-bar-flag-summary');
    expect(summary.textContent).toBe('2 over-crop · 1 deskew·fail');
  });

  // ---------- action slot ----------

  it('renders actions slot when provided', () => {
    render(<BulkActionBar count={3} actions={<button data-testid="rerun">Re-run</button>} />);
    expect(screen.getByTestId('rerun').textContent).toBe('Re-run');
  });

  it('does not render actions slot when omitted', () => {
    render(<BulkActionBar count={3} data-testid="bar" />);
    expect(screen.queryByTestId('bulk-action-bar-actions')).toBeNull();
  });

  it('renders actions slot in a named container', () => {
    render(<BulkActionBar count={3} actions={<button>Foo</button>} />);
    expect(screen.getByTestId('bulk-action-bar-actions')).toBeTruthy();
  });

  // ---------- clear-selection callback ----------

  it('calls onClear when the Clear button is clicked', () => {
    const onClear = vi.fn();
    render(<BulkActionBar count={3} onClear={onClear} />);
    const btn = screen.getByRole('button', { name: /clear/i });
    fireEvent.click(btn);
    expect(onClear).toHaveBeenCalledOnce();
  });

  it('renders a Clear button even without onClear (disabled)', () => {
    render(<BulkActionBar count={3} />);
    const btn = screen.getByRole('button', { name: /clear/i });
    expect(btn).toBeTruthy();
  });

  it('Clear button is disabled when onClear is not provided', () => {
    render(<BulkActionBar count={3} />);
    const btn = screen.getByRole('button', { name: /clear/i });
    expect((btn as HTMLButtonElement).disabled).toBe(true);
  });

  // ---------- variant ----------

  it('applies bulk-action-bar--dock class when variant=dock', () => {
    render(<BulkActionBar count={3} variant="dock" data-testid="bar" />);
    const el = screen.getByTestId('bar');
    expect(el.classList.contains('bulk-action-bar--dock')).toBe(true);
  });

  it('applies bulk-action-bar--float class when variant=float', () => {
    render(<BulkActionBar count={3} variant="float" data-testid="bar" />);
    const el = screen.getByTestId('bar');
    expect(el.classList.contains('bulk-action-bar--float')).toBe(true);
  });

  it('defaults to no variant modifier class when variant is omitted', () => {
    render(<BulkActionBar count={3} data-testid="bar" />);
    const el = screen.getByTestId('bar');
    expect(el.classList.contains('bulk-action-bar--dock')).toBe(false);
    expect(el.classList.contains('bulk-action-bar--float')).toBe(false);
  });

  // ---------- ref forwarding + pass-through ----------

  it('forwards ref to the root element', () => {
    const ref = createRef<HTMLDivElement>();
    render(<BulkActionBar ref={ref} count={3} />);
    expect(ref.current?.tagName).toBe('DIV');
    expect(ref.current?.classList.contains('bulk-action-bar')).toBe(true);
  });

  it('merges custom className', () => {
    render(<BulkActionBar count={3} className="extra" data-testid="bar" />);
    const el = screen.getByTestId('bar');
    expect(el.classList.contains('bulk-action-bar')).toBe(true);
    expect(el.classList.contains('extra')).toBe(true);
  });

  it('passes through arbitrary HTML div attributes', () => {
    render(<BulkActionBar count={3} aria-label="bulk actions" data-testid="bar" />);
    expect(screen.getByTestId('bar').getAttribute('aria-label')).toBe('bulk actions');
  });
});
