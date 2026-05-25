import * as React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { HyphenUndecided } from './HyphenUndecided.js';
import { HYPHEN_UNDECIDED, hyphenUndecidedItemTestId } from '../../testids/index.js';
import type { HJDecisionCase } from './HJDecisionCard.js';

// ─── Test fixtures ────────────────────────────────────────────────────────────

const CASE_A: HJDecisionCase = {
  id: 'case-1',
  originalText: 'after-wards',
  joinProposal: 'afterwards',
  status: 'undecided',
};

const CASE_B: HJDecisionCase = {
  id: 'case-2',
  originalText: 'cross-bar',
  joinProposal: 'crossbar',
  status: 'flagged',
};

const CASE_C: HJDecisionCase = {
  id: 'case-3',
  originalText: 'to-day',
  joinProposal: 'today',
};

// ─── Tests ────────────────────────────────────────────────────────────────────

describe('HyphenUndecided', () => {
  it('renders root testid', () => {
    render(<HyphenUndecided cases={[]} onSelect={vi.fn()} />);
    expect(screen.getByTestId(HYPHEN_UNDECIDED)).toBeTruthy();
  });

  it('renders empty sidebar with no cases and shows placeholder in detail pane', () => {
    render(<HyphenUndecided cases={[]} onSelect={vi.fn()} />);
    // Sidebar list exists but has no items
    expect(screen.queryByRole('listitem')).toBeNull();
    // No selected case → placeholder
    expect(screen.getByText('No case selected')).toBeTruthy();
  });

  it('renders sidebar items for each case', () => {
    render(<HyphenUndecided cases={[CASE_A, CASE_B, CASE_C]} onSelect={vi.fn()} />);
    expect(screen.getByTestId(hyphenUndecidedItemTestId('case-1'))).toBeTruthy();
    expect(screen.getByTestId(hyphenUndecidedItemTestId('case-2'))).toBeTruthy();
    expect(screen.getByTestId(hyphenUndecidedItemTestId('case-3'))).toBeTruthy();
  });

  it('displays original text in each sidebar item', () => {
    render(<HyphenUndecided cases={[CASE_A, CASE_B]} onSelect={vi.fn()} />);
    expect(screen.getByText('after-wards')).toBeTruthy();
    expect(screen.getByText('cross-bar')).toBeTruthy();
  });

  it('shows HJStatusPill for cases with a status', () => {
    render(<HyphenUndecided cases={[CASE_A]} onSelect={vi.fn()} />);
    // HJStatusPill renders with data-testid="hj-status-pill"
    const pills = screen.getAllByTestId('hj-status-pill');
    expect(pills.length).toBeGreaterThanOrEqual(1);
  });

  it('does not show HJStatusPill for cases without a status', () => {
    render(<HyphenUndecided cases={[CASE_C]} onSelect={vi.fn()} />);
    // CASE_C has no status — no pill
    expect(screen.queryByTestId('hj-status-pill')).toBeNull();
  });

  it('invokes onSelect with case id on sidebar item click', async () => {
    const user = userEvent.setup();
    const onSelect = vi.fn();
    render(<HyphenUndecided cases={[CASE_A, CASE_B]} onSelect={onSelect} />);

    await user.click(screen.getByTestId(hyphenUndecidedItemTestId('case-2')));
    expect(onSelect).toHaveBeenCalledWith('case-2');
  });

  it('shows placeholder when selectedId is undefined', () => {
    render(<HyphenUndecided cases={[CASE_A]} onSelect={vi.fn()} />);
    expect(screen.getByText('No case selected')).toBeTruthy();
    // HJDecisionCard should NOT be present
    expect(screen.queryByTestId('hj-decision-card')).toBeNull();
  });

  it('renders HJDecisionCard in detail pane for the selected case', () => {
    render(
      <HyphenUndecided
        cases={[CASE_A, CASE_B]}
        selectedId="case-1"
        onSelect={vi.fn()}
      />,
    );
    expect(screen.getByTestId('hj-decision-card')).toBeTruthy();
    // original text visible in the card
    expect(screen.getAllByText('after-wards').length).toBeGreaterThanOrEqual(1);
    // Placeholder should not be shown
    expect(screen.queryByText('No case selected')).toBeNull();
  });

  it('passes onDecide callbacks through to HJDecisionCard', async () => {
    const user = userEvent.setup();
    const onDecide = {
      onAccept: vi.fn(),
      onKeep: vi.fn(),
      onFlag: vi.fn(),
      onNext: vi.fn(),
      onPrev: vi.fn(),
    };
    render(
      <HyphenUndecided
        cases={[CASE_A]}
        selectedId="case-1"
        onSelect={vi.fn()}
        onDecide={onDecide}
      />,
    );
    await user.click(screen.getByTestId('hj-decision-card-accept'));
    expect(onDecide.onAccept).toHaveBeenCalledOnce();
  });

  it('renders root testid from prop override', () => {
    render(
      <HyphenUndecided
        cases={[]}
        onSelect={vi.fn()}
        data-testid="custom-undecided"
      />,
    );
    expect(screen.getByTestId('custom-undecided')).toBeTruthy();
  });
});
