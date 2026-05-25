import * as React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ReorderScansBanner } from './ReorderScansBanner.js';
import {
  REORDER_SCANS_BANNER,
  REORDER_SCANS_BANNER_SKIP,
  REORDER_SCANS_BANNER_AUTO_APPLY,
  REORDER_SCANS_BANNER_REDETECT,
  REORDER_SCANS_BANNER_SORT,
} from '../../testids/index.js';

// ─── Detected state ───────────────────────────────────────────────────────────

describe('ReorderScansBanner — detected state', () => {
  const defaultDetectedProps = {
    state: 'detected' as const,
    detected: 5,
    highCount: 3,
    mediumCount: 2,
    sortBy: 'confidence' as const,
    onSort: vi.fn(),
    onAutoApply: vi.fn(),
    onSkip: vi.fn(),
  };

  it('renders root with testid', () => {
    render(<ReorderScansBanner {...defaultDetectedProps} />);
    expect(screen.getByTestId(REORDER_SCANS_BANNER)).toBeDefined();
  });

  it('renders detected count text', () => {
    render(<ReorderScansBanner {...defaultDetectedProps} />);
    expect(screen.getByText(/5 detected/)).toBeDefined();
  });

  it('renders highCount and mediumCount in the subtext', () => {
    render(<ReorderScansBanner {...defaultDetectedProps} />);
    // The counts appear inside the banner subtext — use getAllByText since the
    // ancestor section element also contains the text.
    expect(screen.getAllByText(/3 high/).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/2 medium/).length).toBeGreaterThan(0);
  });

  it('renders Skip stage button with testid', () => {
    render(<ReorderScansBanner {...defaultDetectedProps} />);
    expect(screen.getByTestId(REORDER_SCANS_BANNER_SKIP)).toBeDefined();
    expect(screen.getByRole('button', { name: /skip stage/i })).toBeDefined();
  });

  it('renders Auto-apply button with highCount in label and testid', () => {
    render(<ReorderScansBanner {...defaultDetectedProps} />);
    expect(screen.getByTestId(REORDER_SCANS_BANNER_AUTO_APPLY)).toBeDefined();
    expect(screen.getByRole('button', { name: /auto-apply \(3 high\)/i })).toBeDefined();
  });

  it('renders sort select with testid', () => {
    render(<ReorderScansBanner {...defaultDetectedProps} />);
    expect(screen.getByTestId(REORDER_SCANS_BANNER_SORT)).toBeDefined();
  });

  it('calls onSkip when Skip stage button clicked', async () => {
    const user = userEvent.setup();
    const onSkip = vi.fn();
    render(<ReorderScansBanner {...defaultDetectedProps} onSkip={onSkip} />);
    await user.click(screen.getByTestId(REORDER_SCANS_BANNER_SKIP));
    expect(onSkip).toHaveBeenCalledTimes(1);
  });

  it('calls onAutoApply when Auto-apply button clicked', async () => {
    const user = userEvent.setup();
    const onAutoApply = vi.fn();
    render(<ReorderScansBanner {...defaultDetectedProps} onAutoApply={onAutoApply} />);
    await user.click(screen.getByTestId(REORDER_SCANS_BANNER_AUTO_APPLY));
    expect(onAutoApply).toHaveBeenCalledTimes(1);
  });

  it('calls onSort when sort select changes', async () => {
    const user = userEvent.setup();
    const onSort = vi.fn();
    render(<ReorderScansBanner {...defaultDetectedProps} onSort={onSort} />);
    await user.selectOptions(
      screen.getByTestId(REORDER_SCANS_BANNER_SORT),
      'position',
    );
    expect(onSort).toHaveBeenCalledWith('position');
  });

  it('reflects sortBy value in select', () => {
    render(<ReorderScansBanner {...defaultDetectedProps} sortBy="position" />);
    const select = screen.getByTestId(REORDER_SCANS_BANNER_SORT);
    expect((select as HTMLSelectElement).value).toBe('position');
  });

  it('does NOT render Re-detect button in detected state', () => {
    render(<ReorderScansBanner {...defaultDetectedProps} />);
    expect(screen.queryByTestId(REORDER_SCANS_BANNER_REDETECT)).toBeNull();
  });
});

// ─── Clean state ─────────────────────────────────────────────────────────────

describe('ReorderScansBanner — clean state', () => {
  const defaultCleanProps = {
    state: 'clean' as const,
    onRedetect: vi.fn(),
  };

  it('renders root with testid', () => {
    render(<ReorderScansBanner {...defaultCleanProps} />);
    expect(screen.getByTestId(REORDER_SCANS_BANNER)).toBeDefined();
  });

  it('renders Re-detect button with testid', () => {
    render(<ReorderScansBanner {...defaultCleanProps} />);
    expect(screen.getByTestId(REORDER_SCANS_BANNER_REDETECT)).toBeDefined();
    expect(screen.getByRole('button', { name: /re-detect/i })).toBeDefined();
  });

  it('renders "Scans look in order" headline', () => {
    render(<ReorderScansBanner {...defaultCleanProps} />);
    expect(screen.getByText(/scans look in order/i)).toBeDefined();
  });

  it('calls onRedetect when Re-detect button clicked', async () => {
    const user = userEvent.setup();
    const onRedetect = vi.fn();
    render(<ReorderScansBanner {...defaultCleanProps} onRedetect={onRedetect} />);
    await user.click(screen.getByTestId(REORDER_SCANS_BANNER_REDETECT));
    expect(onRedetect).toHaveBeenCalledTimes(1);
  });

  it('does NOT render Skip or Auto-apply buttons in clean state', () => {
    render(<ReorderScansBanner {...defaultCleanProps} />);
    expect(screen.queryByTestId(REORDER_SCANS_BANNER_SKIP)).toBeNull();
    expect(screen.queryByTestId(REORDER_SCANS_BANNER_AUTO_APPLY)).toBeNull();
    expect(screen.queryByTestId(REORDER_SCANS_BANNER_SORT)).toBeNull();
  });
});

// ─── Edge case: detected = 0 ─────────────────────────────────────────────────

describe('ReorderScansBanner — detected=0 (NoneDetected)', () => {
  it('renders 0 detected count', () => {
    render(
      <ReorderScansBanner
        state="detected"
        detected={0}
        highCount={0}
        mediumCount={0}
        sortBy="confidence"
        onSort={vi.fn()}
        onAutoApply={vi.fn()}
        onSkip={vi.fn()}
      />,
    );
    expect(screen.getByText(/0 detected/)).toBeDefined();
  });
});
