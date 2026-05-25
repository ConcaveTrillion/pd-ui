import * as React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { HyphenOverview } from './HyphenOverview.js';
import { HYPHEN_OVERVIEW } from '../../testids/index.js';

const baseStats = {
  undecided: 0,
  autoJoined: 0,
  mismatch: 0,
  flagged: 0,
};

describe('HyphenOverview', () => {
  it('renders the root section with HYPHEN_OVERVIEW testid', () => {
    render(<HyphenOverview stats={baseStats} />);
    expect(screen.getByTestId(HYPHEN_OVERVIEW)).toBeTruthy();
  });

  it('renders all four stat tile labels', () => {
    render(<HyphenOverview stats={baseStats} />);
    expect(screen.getByText(/undecided/i)).toBeTruthy();
    expect(screen.getByText(/auto.?joined/i)).toBeTruthy();
    expect(screen.getByText(/mismatch/i)).toBeTruthy();
    expect(screen.getByText(/flagged/i)).toBeTruthy();
  });

  it('renders correct counts for each tile', () => {
    const stats = { undecided: 7, autoJoined: 42, mismatch: 3, flagged: 1 };
    render(<HyphenOverview stats={stats} />);
    expect(screen.getByText('7')).toBeTruthy();
    expect(screen.getByText('42')).toBeTruthy();
    expect(screen.getByText('3')).toBeTruthy();
    expect(screen.getByText('1')).toBeTruthy();
  });

  it('renders all-zero counts correctly', () => {
    render(<HyphenOverview stats={baseStats} />);
    // Four tiles each showing '0'
    const zeros = screen.getAllByText('0');
    expect(zeros.length).toBe(4);
  });

  it('renders notesPreview string when provided', () => {
    render(<HyphenOverview stats={baseStats} notesPreview="Test post-book note" />);
    expect(screen.getByText('Test post-book note')).toBeTruthy();
  });

  it('renders notesPreview ReactNode when provided', () => {
    render(
      <HyphenOverview
        stats={baseStats}
        notesPreview={<span data-testid="notes-node">Rich notes</span>}
      />,
    );
    expect(screen.getByTestId('notes-node')).toBeTruthy();
  });

  it('does not render notes card when notesPreview is omitted', () => {
    render(<HyphenOverview stats={baseStats} />);
    expect(screen.queryByText(/post.?book/i)).toBeNull();
  });

  it('accepts a custom data-testid override', () => {
    render(<HyphenOverview stats={baseStats} data-testid="custom-id" />);
    expect(screen.getByTestId('custom-id')).toBeTruthy();
  });
});
