import * as React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { HJDecisionCard } from './HJDecisionCard.js';
import {
  HJ_DECISION_CARD,
  HJ_DECISION_CARD_ACCEPT,
  HJ_DECISION_CARD_KEEP,
  HJ_DECISION_CARD_FLAG,
  HJ_DECISION_CARD_NEXT,
  HJ_DECISION_CARD_PREV,
  HJ_DECISION_CARD_SPARKLINE,
} from '../../testids/index.js';
import type { HJDecisionCase } from './HJDecisionCard.js';

// ─── Fixtures ─────────────────────────────────────────────────────────────────

const CASE_UNDECIDED: HJDecisionCase = {
  id: 'case-1',
  originalText: 'some-thing',
  joinProposal: 'something',
  ngrams: [2, 5, 3, 8, 4],
  status: 'undecided',
};

const CASE_NO_NGRAMS: HJDecisionCase = {
  id: 'case-2',
  originalText: 're-port',
  joinProposal: 'report',
};

// ─── Render helpers ────────────────────────────────────────────────────────────

function renderCard(props: Partial<Parameters<typeof HJDecisionCard>[0]> = {}) {
  return render(<HJDecisionCard decisionCase={CASE_UNDECIDED} {...props} />);
}

// ─── Tests ────────────────────────────────────────────────────────────────────

describe('HJDecisionCard', () => {
  it('renders root with correct testid', () => {
    renderCard();
    expect(screen.getByTestId(HJ_DECISION_CARD)).toBeInTheDocument();
  });

  it('displays originalText', () => {
    renderCard();
    expect(screen.getByText('some-thing')).toBeInTheDocument();
  });

  it('displays joinProposal', () => {
    renderCard();
    expect(screen.getByText('something')).toBeInTheDocument();
  });

  it('renders all 5 action buttons with testids', () => {
    renderCard();
    expect(screen.getByTestId(HJ_DECISION_CARD_ACCEPT)).toBeInTheDocument();
    expect(screen.getByTestId(HJ_DECISION_CARD_KEEP)).toBeInTheDocument();
    expect(screen.getByTestId(HJ_DECISION_CARD_FLAG)).toBeInTheDocument();
    expect(screen.getByTestId(HJ_DECISION_CARD_NEXT)).toBeInTheDocument();
    expect(screen.getByTestId(HJ_DECISION_CARD_PREV)).toBeInTheDocument();
  });

  it('renders keyboard hint chips (Y, N, F, J, K)', () => {
    renderCard();
    // Each key hint appears as visible text inside the card
    const root = screen.getByTestId(HJ_DECISION_CARD);
    expect(root.textContent).toContain('Y');
    expect(root.textContent).toContain('N');
    expect(root.textContent).toContain('F');
    expect(root.textContent).toContain('J');
    expect(root.textContent).toContain('K');
  });

  it('renders sparkline when ngrams provided', () => {
    renderCard();
    expect(screen.getByTestId(HJ_DECISION_CARD_SPARKLINE)).toBeInTheDocument();
  });

  it('hides sparkline when ngrams undefined', () => {
    renderCard({ decisionCase: CASE_NO_NGRAMS });
    expect(screen.queryByTestId(HJ_DECISION_CARD_SPARKLINE)).not.toBeInTheDocument();
  });

  describe('button callbacks', () => {
    it('calls onAccept when accept button clicked', () => {
      const onAccept = vi.fn();
      renderCard({ onAccept });
      fireEvent.click(screen.getByTestId(HJ_DECISION_CARD_ACCEPT));
      expect(onAccept).toHaveBeenCalledOnce();
    });

    it('calls onKeep when keep button clicked', () => {
      const onKeep = vi.fn();
      renderCard({ onKeep });
      fireEvent.click(screen.getByTestId(HJ_DECISION_CARD_KEEP));
      expect(onKeep).toHaveBeenCalledOnce();
    });

    it('calls onFlag when flag button clicked', () => {
      const onFlag = vi.fn();
      renderCard({ onFlag });
      fireEvent.click(screen.getByTestId(HJ_DECISION_CARD_FLAG));
      expect(onFlag).toHaveBeenCalledOnce();
    });

    it('calls onNext when next button clicked', () => {
      const onNext = vi.fn();
      renderCard({ onNext });
      fireEvent.click(screen.getByTestId(HJ_DECISION_CARD_NEXT));
      expect(onNext).toHaveBeenCalledOnce();
    });

    it('calls onPrev when prev button clicked', () => {
      const onPrev = vi.fn();
      renderCard({ onPrev });
      fireEvent.click(screen.getByTestId(HJ_DECISION_CARD_PREV));
      expect(onPrev).toHaveBeenCalledOnce();
    });
  });

  describe('keyboard shortcuts', () => {
    it('Y key fires onAccept', () => {
      const onAccept = vi.fn();
      renderCard({ onAccept });
      const wrapper = screen.getByTestId(HJ_DECISION_CARD);
      fireEvent.keyDown(wrapper, { key: 'y' });
      expect(onAccept).toHaveBeenCalledOnce();
    });

    it('N key fires onKeep', () => {
      const onKeep = vi.fn();
      renderCard({ onKeep });
      const wrapper = screen.getByTestId(HJ_DECISION_CARD);
      fireEvent.keyDown(wrapper, { key: 'n' });
      expect(onKeep).toHaveBeenCalledOnce();
    });

    it('F key fires onFlag', () => {
      const onFlag = vi.fn();
      renderCard({ onFlag });
      const wrapper = screen.getByTestId(HJ_DECISION_CARD);
      fireEvent.keyDown(wrapper, { key: 'f' });
      expect(onFlag).toHaveBeenCalledOnce();
    });

    it('J key fires onNext', () => {
      const onNext = vi.fn();
      renderCard({ onNext });
      const wrapper = screen.getByTestId(HJ_DECISION_CARD);
      fireEvent.keyDown(wrapper, { key: 'j' });
      expect(onNext).toHaveBeenCalledOnce();
    });

    it('K key fires onPrev', () => {
      const onPrev = vi.fn();
      renderCard({ onPrev });
      const wrapper = screen.getByTestId(HJ_DECISION_CARD);
      fireEvent.keyDown(wrapper, { key: 'k' });
      expect(onPrev).toHaveBeenCalledOnce();
    });

    it('uppercase Y key also fires onAccept', () => {
      const onAccept = vi.fn();
      renderCard({ onAccept });
      const wrapper = screen.getByTestId(HJ_DECISION_CARD);
      fireEvent.keyDown(wrapper, { key: 'Y' });
      expect(onAccept).toHaveBeenCalledOnce();
    });

    it('does not fire if callback not provided', () => {
      // Should not throw
      renderCard({});
      const wrapper = screen.getByTestId(HJ_DECISION_CARD);
      expect(() => fireEvent.keyDown(wrapper, { key: 'y' })).not.toThrow();
    });
  });

  it('renders status pill when status provided', () => {
    renderCard({ decisionCase: { ...CASE_UNDECIDED, status: 'flagged' } });
    // HJStatusPill renders a badge with the status label
    expect(screen.getByText('flagged')).toBeInTheDocument();
  });
});
