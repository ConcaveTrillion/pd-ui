/**
 * Tests for <MatchStatusChip> (M6.6, issue #155).
 */

import * as React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MatchStatusChip } from './MatchStatusChip';

describe('<MatchStatusChip>', () => {
  it('renders exact status', () => {
    render(<MatchStatusChip status="exact" />);
    expect(screen.getByTestId('match-status-chip-exact')).toBeDefined();
  });

  it('renders fuzzy status', () => {
    render(<MatchStatusChip status="fuzzy" />);
    expect(screen.getByTestId('match-status-chip-fuzzy')).toBeDefined();
  });

  it('renders mismatch status', () => {
    render(<MatchStatusChip status="mismatch" />);
    expect(screen.getByTestId('match-status-chip-mismatch')).toBeDefined();
  });

  it('renders none status', () => {
    render(<MatchStatusChip status="none" />);
    expect(screen.getByTestId('match-status-chip-none')).toBeDefined();
  });

  it('shows label text when label provided', () => {
    render(<MatchStatusChip status="exact" label="Exact match" />);
    expect(screen.getByText('Exact match')).toBeDefined();
  });

  it('applies custom className', () => {
    const { container } = render(<MatchStatusChip status="fuzzy" className="my-chip" />);
    const outer = container.firstElementChild;
    expect(outer?.className).toContain('my-chip');
  });
});
