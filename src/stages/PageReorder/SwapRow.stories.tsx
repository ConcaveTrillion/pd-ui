/**
 * SwapRow Storybook stories.
 *
 * Stories:
 *   1. PendingHigh    — pending state, high-confidence swap
 *   2. PendingMedium  — pending state, medium-confidence swap
 *   3. Accepted       — post-decision, accepted badge
 *   4. Skipped        — post-decision, skipped badge
 */

import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { SwapRow } from './SwapRow.js';

const meta: Meta<typeof SwapRow> = {
  title: 'Stages/PageReorder/SwapRow',
  component: SwapRow,
  parameters: {
    layout: 'padded',
  },
  decorators: [
    (Story) => (
      <div style={{ maxWidth: 960 }}>
        <Story />
      </div>
    ),
  ],
};
export default meta;

type Story = StoryObj<typeof SwapRow>;

// ─── Shared swap fixture ───────────────────────────────────────────────────────

const highSwap = {
  id: 'swap-42',
  number: 1,
  pageA: { id: 'page-7', number: 7 },
  pageB: { id: 'page-8', number: 8 },
  confidence: 'high' as const,
  reasoning:
    'Scan filename sequence (007, 008) conflicts with OCR-extracted page numbers (8, 7). High-confidence transposition.',
  signals: ['filename-seq-conflict', 'ocr-page-number-mismatch', 'positional-adjacency'],
};

const medSwap = {
  ...highSwap,
  id: 'swap-43',
  number: 2,
  pageA: { id: 'page-12', number: 12 },
  pageB: { id: 'page-13', number: 13 },
  confidence: 'medium' as const,
  reasoning:
    'Moderate evidence of transposition — filename gap present but OCR confidence below threshold.',
  signals: ['filename-seq-gap', 'ocr-confidence-low'],
};

// ─── PendingHigh ──────────────────────────────────────────────────────────────

export const PendingHigh: Story = {
  args: {
    swap: highSwap,
    state: 'pending',
    onSkip: () => console.log('skip'),
    onInspect: () => console.log('inspect'),
    onAccept: () => console.log('accept'),
  },
};

// ─── PendingMedium ────────────────────────────────────────────────────────────

export const PendingMedium: Story = {
  args: {
    swap: medSwap,
    state: 'pending',
    onSkip: () => console.log('skip'),
    onInspect: () => console.log('inspect'),
    onAccept: () => console.log('accept'),
  },
};

// ─── Accepted ─────────────────────────────────────────────────────────────────

export const Accepted: Story = {
  args: {
    swap: highSwap,
    state: 'accepted',
  },
};

// ─── Skipped ──────────────────────────────────────────────────────────────────

export const Skipped: Story = {
  args: {
    swap: medSwap,
    state: 'skipped',
  },
};
