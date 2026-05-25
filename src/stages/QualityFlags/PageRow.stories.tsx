/**
 * PageRow — QualityFlags list-mode row stories.
 *
 * Stories:
 *  1. Clean — no flags, no scores
 *  2. MultipleFlags — several flag chips
 *  3. MixedScores — mix of good/warn/error score tones
 */

import type { Meta, StoryObj } from '@storybook/react';
import { PageRow } from './PageRow.js';
import type { QualityPage, QualityPageFlag } from './PageRow.js';

// ─── Fixtures ─────────────────────────────────────────────────────────────────

const CLEAN_PAGE: QualityPage = {
  id: 'p-001',
  number: 1,
};

const FLAGGED_PAGE: QualityPage = {
  id: 'p-042',
  number: 42,
};

const SCORED_PAGE: QualityPage = {
  id: 'p-099',
  number: 99,
  scores: {
    ocr: 0.92,
    deskew: 0.71,
    noise: 0.38,
  },
};

const MULTI_FLAGS: QualityPageFlag[] = [
  { id: 'blurry', label: 'blurry' },
  { id: 'skew', label: 'skew' },
  { id: 'low-conf', label: 'low-conf' },
  { id: 'garbled', label: 'garbled' },
];

// ─── Meta ─────────────────────────────────────────────────────────────────────

const meta: Meta<typeof PageRow> = {
  title: 'Stages/QualityFlags/PageRow',
  component: PageRow,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof PageRow>;

// ─── Stories ──────────────────────────────────────────────────────────────────

/**
 * Clean page with no flags and no scores.
 * Flag column shows the em-dash fallback.
 */
export const Clean: Story = {
  args: {
    page: CLEAN_PAGE,
    flags: [],
  },
};

/**
 * Page with multiple flag chips.
 * Each flag renders as an inline FlagChip pill.
 */
export const MultipleFlags: Story = {
  args: {
    page: FLAGGED_PAGE,
    flags: MULTI_FLAGS,
  },
};

/**
 * Page with mixed score tones: exact (green ≥ 80%), fuzzy (amber ≥ 50%),
 * and mismatch (red < 50%).
 */
export const MixedScores: Story = {
  args: {
    page: SCORED_PAGE,
    flags: [{ id: 'low-conf', label: 'low-conf' }],
  },
};
