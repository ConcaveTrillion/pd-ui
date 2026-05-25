/**
 * SwapRow + PageThumb — Vitest unit tests (TDD).
 *
 * Coverage:
 *   - Pending state: renders 3 action buttons (Skip, Inspect, Accept)
 *   - Accepted state: renders static Badge, no action buttons
 *   - Skipped state: renders static Badge, no action buttons
 *   - Callbacks fire on button click
 *   - Thumbnails render with correct page numbers
 *   - testids are present
 *   - Confidence and reasoning text rendered
 *   - Signal list rendered
 */

import * as React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { SwapRow } from './SwapRow.js';
import { REORDER_SWAP_ROW, REORDER_PAGE_THUMB, reorderSwapRowTestId } from '../../testids/index.js';

// ─── Fixtures ─────────────────────────────────────────────────────────────────

const baseSwap = {
  id: 'swap-1',
  number: 1,
  pageA: { id: 'page-5', number: 5, thumbnailUrl: 'https://example.com/5.png' },
  pageB: { id: 'page-6', number: 6, thumbnailUrl: 'https://example.com/6.png' },
  confidence: 'high' as const,
  reasoning: 'Filename order does not match OCR page numbers.',
  signals: ['filename-mismatch', 'ocr-confidence-high'],
};

// ─── Pending state ────────────────────────────────────────────────────────────

describe('SwapRow — pending state', () => {
  it('renders the Skip button', () => {
    render(
      <SwapRow
        swap={baseSwap}
        state="pending"
        onSkip={vi.fn()}
        onInspect={vi.fn()}
        onAccept={vi.fn()}
      />,
    );
    expect(screen.getByRole('button', { name: /skip/i })).toBeInTheDocument();
  });

  it('renders the Inspect button', () => {
    render(
      <SwapRow
        swap={baseSwap}
        state="pending"
        onSkip={vi.fn()}
        onInspect={vi.fn()}
        onAccept={vi.fn()}
      />,
    );
    expect(screen.getByRole('button', { name: /inspect/i })).toBeInTheDocument();
  });

  it('renders the Accept button', () => {
    render(
      <SwapRow
        swap={baseSwap}
        state="pending"
        onSkip={vi.fn()}
        onInspect={vi.fn()}
        onAccept={vi.fn()}
      />,
    );
    expect(screen.getByRole('button', { name: /accept/i })).toBeInTheDocument();
  });

  it('does not render a static state badge when pending', () => {
    render(
      <SwapRow
        swap={baseSwap}
        state="pending"
        onSkip={vi.fn()}
        onInspect={vi.fn()}
        onAccept={vi.fn()}
      />,
    );
    expect(screen.queryByText(/^Accepted$/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/^Skipped$/i)).not.toBeInTheDocument();
  });
});

// ─── Accepted state ───────────────────────────────────────────────────────────

describe('SwapRow — accepted state', () => {
  it('renders a static "Accepted" badge, no action buttons', () => {
    render(<SwapRow swap={baseSwap} state="accepted" />);
    expect(screen.getByText('Accepted')).toBeInTheDocument();
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });
});

// ─── Skipped state ────────────────────────────────────────────────────────────

describe('SwapRow — skipped state', () => {
  it('renders a static "Skipped" badge, no action buttons', () => {
    render(<SwapRow swap={baseSwap} state="skipped" />);
    expect(screen.getByText('Skipped')).toBeInTheDocument();
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });
});

// ─── Callback wiring ──────────────────────────────────────────────────────────

describe('SwapRow — callback wiring', () => {
  it('calls onSkip when Skip is clicked', async () => {
    const user = userEvent.setup();
    const onSkip = vi.fn();
    render(
      <SwapRow
        swap={baseSwap}
        state="pending"
        onSkip={onSkip}
        onInspect={vi.fn()}
        onAccept={vi.fn()}
      />,
    );
    await user.click(screen.getByRole('button', { name: /skip/i }));
    expect(onSkip).toHaveBeenCalledTimes(1);
  });

  it('calls onInspect when Inspect is clicked', async () => {
    const user = userEvent.setup();
    const onInspect = vi.fn();
    render(
      <SwapRow
        swap={baseSwap}
        state="pending"
        onSkip={vi.fn()}
        onInspect={onInspect}
        onAccept={vi.fn()}
      />,
    );
    await user.click(screen.getByRole('button', { name: /inspect/i }));
    expect(onInspect).toHaveBeenCalledTimes(1);
  });

  it('calls onAccept when Accept is clicked', async () => {
    const user = userEvent.setup();
    const onAccept = vi.fn();
    render(
      <SwapRow
        swap={baseSwap}
        state="pending"
        onSkip={vi.fn()}
        onInspect={vi.fn()}
        onAccept={onAccept}
      />,
    );
    await user.click(screen.getByRole('button', { name: /accept/i }));
    expect(onAccept).toHaveBeenCalledTimes(1);
  });
});

// ─── Thumbnail page numbers ───────────────────────────────────────────────────

describe('SwapRow — thumbnail page numbers', () => {
  it('renders page A number', () => {
    render(
      <SwapRow
        swap={baseSwap}
        state="pending"
        onSkip={vi.fn()}
        onInspect={vi.fn()}
        onAccept={vi.fn()}
      />,
    );
    expect(screen.getByText('5')).toBeInTheDocument();
  });

  it('renders page B number', () => {
    render(
      <SwapRow
        swap={baseSwap}
        state="pending"
        onSkip={vi.fn()}
        onInspect={vi.fn()}
        onAccept={vi.fn()}
      />,
    );
    expect(screen.getByText('6')).toBeInTheDocument();
  });

  it('renders page numbers as strings when provided as strings', () => {
    const swapWithStringNumbers = {
      ...baseSwap,
      pageA: { id: 'page-a', number: 'front' },
      pageB: { id: 'page-b', number: 'back' },
    };
    render(
      <SwapRow
        swap={swapWithStringNumbers}
        state="pending"
        onSkip={vi.fn()}
        onInspect={vi.fn()}
        onAccept={vi.fn()}
      />,
    );
    expect(screen.getByText('front')).toBeInTheDocument();
    expect(screen.getByText('back')).toBeInTheDocument();
  });
});

// ─── Confidence and reasoning ─────────────────────────────────────────────────

describe('SwapRow — confidence and reasoning', () => {
  it('renders high confidence badge', () => {
    render(
      <SwapRow
        swap={baseSwap}
        state="pending"
        onSkip={vi.fn()}
        onInspect={vi.fn()}
        onAccept={vi.fn()}
      />,
    );
    expect(screen.getByText('High')).toBeInTheDocument();
  });

  it('renders medium confidence badge', () => {
    const medSwap = { ...baseSwap, confidence: 'medium' as const };
    render(
      <SwapRow
        swap={medSwap}
        state="pending"
        onSkip={vi.fn()}
        onInspect={vi.fn()}
        onAccept={vi.fn()}
      />,
    );
    expect(screen.getByText('Medium')).toBeInTheDocument();
  });

  it('renders reasoning text', () => {
    render(
      <SwapRow
        swap={baseSwap}
        state="pending"
        onSkip={vi.fn()}
        onInspect={vi.fn()}
        onAccept={vi.fn()}
      />,
    );
    expect(screen.getByText('Filename order does not match OCR page numbers.')).toBeInTheDocument();
  });

  it('renders signals', () => {
    render(
      <SwapRow
        swap={baseSwap}
        state="pending"
        onSkip={vi.fn()}
        onInspect={vi.fn()}
        onAccept={vi.fn()}
      />,
    );
    expect(screen.getByText('filename-mismatch')).toBeInTheDocument();
    expect(screen.getByText('ocr-confidence-high')).toBeInTheDocument();
  });
});

// ─── testids ──────────────────────────────────────────────────────────────────

describe('SwapRow — testids', () => {
  it('applies REORDER_SWAP_ROW testid to root', () => {
    render(
      <SwapRow
        swap={baseSwap}
        state="pending"
        onSkip={vi.fn()}
        onInspect={vi.fn()}
        onAccept={vi.fn()}
      />,
    );
    expect(screen.getByTestId(REORDER_SWAP_ROW)).toBeInTheDocument();
  });

  it('applies per-id testid via reorderSwapRowTestId helper', () => {
    render(
      <SwapRow
        swap={baseSwap}
        state="pending"
        onSkip={vi.fn()}
        onInspect={vi.fn()}
        onAccept={vi.fn()}
        data-testid={reorderSwapRowTestId('swap-1')}
      />,
    );
    expect(screen.getByTestId('reorder-swap-row-swap-1')).toBeInTheDocument();
  });

  it('applies REORDER_PAGE_THUMB testid to the thumb pair', () => {
    render(
      <SwapRow
        swap={baseSwap}
        state="pending"
        onSkip={vi.fn()}
        onInspect={vi.fn()}
        onAccept={vi.fn()}
      />,
    );
    expect(screen.getByTestId(REORDER_PAGE_THUMB)).toBeInTheDocument();
  });

  it('renders swap number badge', () => {
    render(
      <SwapRow
        swap={baseSwap}
        state="pending"
        onSkip={vi.fn()}
        onInspect={vi.fn()}
        onAccept={vi.fn()}
      />,
    );
    // Number badge shows swap number (1)
    expect(screen.getByText('1')).toBeInTheDocument();
  });
});
