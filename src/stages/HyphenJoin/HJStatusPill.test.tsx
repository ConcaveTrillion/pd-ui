import * as React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { HJStatusPill } from './HJStatusPill.js';
import type { HJStatus, HJStatusPillProps } from './HJStatusPill.js';
import { HJ_STATUS_PILL } from '../../testids/index.js';

// ─── type-level exhaustiveness check ─────────────────────────────────────────
// This compiles only if HJStatus covers exactly these five values.
const ALL_STATUSES: HJStatus[] = [
  'cross-page',
  'validated',
  'auto-joined',
  'undecided',
  'flagged',
];

// ─── HJStatusPill — renders each status variant ───────────────────────────────

describe('HJStatusPill', () => {
  it.each(ALL_STATUSES)('renders the "%s" variant without crashing', (status) => {
    render(<HJStatusPill status={status} />);
    expect(screen.getByText(status)).toBeInTheDocument();
  });

  it.each(ALL_STATUSES)('sets data-status="%s" on the root element', (status) => {
    render(<HJStatusPill status={status} data-testid={HJ_STATUS_PILL} />);
    const el = screen.getByTestId(HJ_STATUS_PILL);
    expect(el).toHaveAttribute('data-status', status);
  });

  it('applies the default testid via HJ_STATUS_PILL constant', () => {
    render(<HJStatusPill status="validated" />);
    expect(screen.getByTestId(HJ_STATUS_PILL)).toBeInTheDocument();
  });

  it('accepts a custom data-testid override', () => {
    render(<HJStatusPill status="flagged" data-testid="custom-pill" />);
    expect(screen.getByTestId('custom-pill')).toBeInTheDocument();
  });

  // ── Variant-specific assertions ────────────────────────────────────────────

  it('cross-page: renders label "cross-page" and tone=ocr', () => {
    render(<HJStatusPill status="cross-page" />);
    const el = screen.getByTestId(HJ_STATUS_PILL);
    expect(el).toHaveTextContent('cross-page');
    // Badge renders tone as a CSS class badge--tone-ocr
    expect(el.className).toContain('badge--tone-ocr');
  });

  it('validated: renders label "validated" and tone=exact', () => {
    render(<HJStatusPill status="validated" />);
    const el = screen.getByTestId(HJ_STATUS_PILL);
    expect(el).toHaveTextContent('validated');
    expect(el.className).toContain('badge--tone-exact');
  });

  it('auto-joined: renders label "auto-joined", tone=exact, and dashed modifier class', () => {
    render(<HJStatusPill status="auto-joined" />);
    const el = screen.getByTestId(HJ_STATUS_PILL);
    expect(el).toHaveTextContent('auto-joined');
    expect(el.className).toContain('badge--tone-exact');
    expect(el.className).toContain('hj-status-pill--dashed');
  });

  it('undecided: renders label "undecided" and tone=fuzzy', () => {
    render(<HJStatusPill status="undecided" />);
    const el = screen.getByTestId(HJ_STATUS_PILL);
    expect(el).toHaveTextContent('undecided');
    expect(el.className).toContain('badge--tone-fuzzy');
  });

  it('flagged: renders label "flagged" and tone=mismatch', () => {
    render(<HJStatusPill status="flagged" />);
    const el = screen.getByTestId(HJ_STATUS_PILL);
    expect(el).toHaveTextContent('flagged');
    expect(el.className).toContain('badge--tone-mismatch');
  });

  // ── non-dashed variants must NOT have the dashed class ────────────────────

  it.each(['cross-page', 'validated', 'undecided', 'flagged'] as HJStatus[])(
    '"%s" does not carry the dashed modifier',
    (status) => {
      render(<HJStatusPill status={status} />);
      const el = screen.getByTestId(HJ_STATUS_PILL);
      expect(el.className).not.toContain('hj-status-pill--dashed');
    },
  );

  // ── runtime assertion: HJStatus is a discriminated union ─────────────────

  it('ALL_STATUSES covers all 5 variants (runtime assertion)', () => {
    expect(ALL_STATUSES).toHaveLength(5);
    const set = new Set<string>(ALL_STATUSES);
    expect(set.has('cross-page')).toBe(true);
    expect(set.has('validated')).toBe(true);
    expect(set.has('auto-joined')).toBe(true);
    expect(set.has('undecided')).toBe(true);
    expect(set.has('flagged')).toBe(true);
  });

  // ── prop contract ─────────────────────────────────────────────────────────

  it('accepts and forwards extra HTMLSpanElement props', () => {
    // HJStatusPillProps extends HTMLAttributes indirectly via Badge
    const props: HJStatusPillProps = { status: 'undecided', 'aria-label': 'status' };
    render(<HJStatusPill {...props} />);
    expect(screen.getByTestId(HJ_STATUS_PILL)).toHaveAttribute('aria-label', 'status');
  });
});
