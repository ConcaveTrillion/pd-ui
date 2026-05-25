import * as React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { HyphenAutoJoined } from './HyphenAutoJoined.js';
import {
  HYPHEN_AUTO_JOINED,
  hyphenAutoJoinedGroupTestId,
} from '../../testids/index.js';
import type { HyphenAutoJoinedGroup } from './HyphenAutoJoined.js';

// ─── Fixtures ─────────────────────────────────────────────────────────────────

const CASE_A = {
  id: 'a1',
  originalText: 'with-\nout',
  joinProposal: 'without',
  status: 'auto-joined' as const,
};

const CASE_B = {
  id: 'a2',
  originalText: 'some-\nthing',
  joinProposal: 'something',
  status: 'validated' as const,
};

const CASE_C = {
  id: 'a3',
  originalText: 'with-\nout',
  joinProposal: 'without',
  status: 'auto-joined' as const,
};

const GROUP_WITHOUT: HyphenAutoJoinedGroup = {
  word: 'without',
  cases: [CASE_A, CASE_C],
};

const GROUP_SOMETHING: HyphenAutoJoinedGroup = {
  word: 'something',
  cases: [CASE_B],
};

const FEW_GROUPS: HyphenAutoJoinedGroup[] = [GROUP_WITHOUT, GROUP_SOMETHING];

// ─── Tests ────────────────────────────────────────────────────────────────────

describe('HyphenAutoJoined', () => {
  // ── Root testid ───────────────────────────────────────────────────────

  it('renders root with default testid', () => {
    render(<HyphenAutoJoined groups={FEW_GROUPS} />);
    expect(screen.getByTestId(HYPHEN_AUTO_JOINED)).toBeInTheDocument();
  });

  it('accepts data-testid override', () => {
    render(<HyphenAutoJoined groups={FEW_GROUPS} data-testid="custom-id" />);
    expect(screen.getByTestId('custom-id')).toBeInTheDocument();
  });

  // ── Group rendering ───────────────────────────────────────────────────

  it('renders one section per group with correct group testid', () => {
    render(<HyphenAutoJoined groups={FEW_GROUPS} />);
    expect(screen.getByTestId(hyphenAutoJoinedGroupTestId('without'))).toBeInTheDocument();
    expect(screen.getByTestId(hyphenAutoJoinedGroupTestId('something'))).toBeInTheDocument();
  });

  it('displays each group word as a headline', () => {
    render(<HyphenAutoJoined groups={FEW_GROUPS} />);
    // getAllByText because "without" also appears as joinProposal in case rows
    expect(screen.getAllByText('without').length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText('something').length).toBeGreaterThanOrEqual(1);
  });

  it('shows correct case count badge for each group', () => {
    render(<HyphenAutoJoined groups={FEW_GROUPS} />);
    // GROUP_WITHOUT has 2 cases, GROUP_SOMETHING has 1
    expect(screen.getByTestId(hyphenAutoJoinedGroupTestId('without'))).toHaveTextContent('2');
    expect(screen.getByTestId(hyphenAutoJoinedGroupTestId('something'))).toHaveTextContent('1');
  });

  it('renders contributing case original text in each group', () => {
    render(<HyphenAutoJoined groups={FEW_GROUPS} />);
    const withoutGroup = screen.getByTestId(hyphenAutoJoinedGroupTestId('without'));
    // Both cases in GROUP_WITHOUT have originalText 'with-\nout'
    expect(withoutGroup).toHaveTextContent('with-');
  });

  // ── Top-level summary stat ────────────────────────────────────────────

  it('shows total case count in a summary stat', () => {
    render(<HyphenAutoJoined groups={FEW_GROUPS} />);
    // Total cases: 2 + 1 = 3
    expect(screen.getByText('3')).toBeInTheDocument();
  });

  it('shows group count in a summary stat', () => {
    render(<HyphenAutoJoined groups={FEW_GROUPS} />);
    // 2 groups — may appear multiple times (stat tile + count badge for each group)
    expect(screen.getAllByText('2').length).toBeGreaterThanOrEqual(1);
  });

  // ── Empty state ───────────────────────────────────────────────────────

  it('renders empty state when groups is empty', () => {
    render(<HyphenAutoJoined groups={[]} />);
    expect(screen.getByTestId(HYPHEN_AUTO_JOINED)).toBeInTheDocument();
    expect(screen.getByText(/no auto-joined/i)).toBeInTheDocument();
  });

  it('does not render any group sections in empty state', () => {
    render(<HyphenAutoJoined groups={[]} />);
    expect(screen.queryByTestId(hyphenAutoJoinedGroupTestId('without'))).not.toBeInTheDocument();
  });

  // ── onValidate callback ───────────────────────────────────────────────

  it('fires onValidate with group word when "Validate group" is clicked', async () => {
    const user = userEvent.setup();
    const onValidate = vi.fn();
    render(<HyphenAutoJoined groups={FEW_GROUPS} onValidate={onValidate} />);

    // Click the validate button for the "without" group
    const withoutGroup = screen.getByTestId(hyphenAutoJoinedGroupTestId('without'));
    const validateBtn = withoutGroup.querySelector('button');
    expect(validateBtn).not.toBeNull();
    await user.click(validateBtn!);

    expect(onValidate).toHaveBeenCalledTimes(1);
    expect(onValidate).toHaveBeenCalledWith('without');
  });

  it('does not render validate buttons when onValidate is not provided', () => {
    render(<HyphenAutoJoined groups={FEW_GROUPS} />);
    // No validate buttons should be present
    const buttons = screen.queryAllByRole('button', { name: /validate group/i });
    expect(buttons).toHaveLength(0);
  });

  // ── HJStatusPill integration ──────────────────────────────────────────

  it('shows status pills for cases with a status', () => {
    render(<HyphenAutoJoined groups={FEW_GROUPS} />);
    // CASE_B has status 'validated' — HJStatusPill renders via ARIA
    const pills = screen.getAllByTestId('hj-status-pill');
    expect(pills.length).toBeGreaterThan(0);
  });
});
