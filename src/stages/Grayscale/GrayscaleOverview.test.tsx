import * as React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { GrayscaleOverview } from './GrayscaleOverview.js';
import type { GrayscaleStats } from './GrayscaleOverview.js';
import {
  GRAYSCALE_OVERVIEW,
  GRAYSCALE_OVERVIEW_STAT_PROCESSED,
  GRAYSCALE_OVERVIEW_STAT_FLAGGED,
  GRAYSCALE_OVERVIEW_STAT_AVG,
  GRAYSCALE_OVERVIEW_STAT_TOTAL,
} from '../../testids/index.js';

// ── helpers ───────────────────────────────────────────────────────────────────

const BASE_STATS: GrayscaleStats = {
  pagesProcessed: 232,
  pagesFlagged: 5,
  avgSecondsPerPage: 0.8,
  totalSeconds: 185.6,
};

function renderOverview(
  stats: GrayscaleStats = BASE_STATS,
  extra: Partial<React.ComponentProps<typeof GrayscaleOverview>> = {},
) {
  return render(<GrayscaleOverview stats={stats} {...extra} />);
}

// ── stat tiles ────────────────────────────────────────────────────────────────

describe('GrayscaleOverview — stat tiles', () => {
  it('renders pages processed stat tile with correct value', () => {
    renderOverview();
    const tile = screen.getByTestId(GRAYSCALE_OVERVIEW_STAT_PROCESSED);
    expect(tile).toBeInTheDocument();
    expect(tile).toHaveTextContent('232');
    expect(tile).toHaveTextContent('Pages Processed');
  });

  it('renders pages flagged stat tile with correct value', () => {
    renderOverview();
    const tile = screen.getByTestId(GRAYSCALE_OVERVIEW_STAT_FLAGGED);
    expect(tile).toBeInTheDocument();
    expect(tile).toHaveTextContent('5');
    expect(tile).toHaveTextContent('Pages Flagged');
  });

  it('renders avg seconds per page stat tile', () => {
    renderOverview();
    const tile = screen.getByTestId(GRAYSCALE_OVERVIEW_STAT_AVG);
    expect(tile).toBeInTheDocument();
    expect(tile).toHaveTextContent('Avg / Page');
    // 0.8s formatted
    expect(tile).toHaveTextContent('0.8s');
  });

  it('renders total time stat tile', () => {
    renderOverview();
    const tile = screen.getByTestId(GRAYSCALE_OVERVIEW_STAT_TOTAL);
    expect(tile).toBeInTheDocument();
    expect(tile).toHaveTextContent('Total Time');
    // 185.6s → 3m 6s
    expect(tile).toHaveTextContent('3m');
  });
});

// ── summary cards ─────────────────────────────────────────────────────────────

describe('GrayscaleOverview — mode summary cards', () => {
  it('does not render mode cards when neither count is provided', () => {
    renderOverview(BASE_STATS);
    expect(screen.queryByText('Standard Mode')).not.toBeInTheDocument();
    expect(screen.queryByText('Perceptual Mode')).not.toBeInTheDocument();
  });

  it('does not render mode cards when only standardCount is provided', () => {
    renderOverview({ ...BASE_STATS, standardCount: 34 });
    expect(screen.queryByText('Standard Mode')).not.toBeInTheDocument();
    expect(screen.queryByText('Perceptual Mode')).not.toBeInTheDocument();
  });

  it('does not render mode cards when only perceptualCount is provided', () => {
    renderOverview({ ...BASE_STATS, perceptualCount: 198 });
    expect(screen.queryByText('Standard Mode')).not.toBeInTheDocument();
    expect(screen.queryByText('Perceptual Mode')).not.toBeInTheDocument();
  });

  it('renders both mode cards when both counts are provided', () => {
    renderOverview({ ...BASE_STATS, standardCount: 34, perceptualCount: 198 });
    expect(screen.getByText('Standard Mode')).toBeInTheDocument();
    expect(screen.getByText('Perceptual Mode')).toBeInTheDocument();
    expect(screen.getByText('34')).toBeInTheDocument();
    expect(screen.getByText('198')).toBeInTheDocument();
  });
});

// ── data-testid forwarding ────────────────────────────────────────────────────

describe('GrayscaleOverview — data-testid', () => {
  it('uses default GRAYSCALE_OVERVIEW testid', () => {
    renderOverview();
    expect(screen.getByTestId(GRAYSCALE_OVERVIEW)).toBeInTheDocument();
  });

  it('accepts a custom data-testid', () => {
    renderOverview(BASE_STATS, { 'data-testid': 'custom-overview' });
    expect(screen.getByTestId('custom-overview')).toBeInTheDocument();
    expect(screen.queryByTestId(GRAYSCALE_OVERVIEW)).not.toBeInTheDocument();
  });
});
