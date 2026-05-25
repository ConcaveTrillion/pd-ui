/**
 * GrayscaleOverview Storybook stories.
 *
 * Stories:
 *   1. Default          — typical run with some flagged pages
 *   2. NoFlagged        — all pages processed, none flagged
 *   3. WithModeBreakdown — includes standard + perceptual mode counts
 *   4. Empty            — zero stats
 */

import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { GrayscaleOverview } from './GrayscaleOverview.js';

const meta: Meta<typeof GrayscaleOverview> = {
  title: 'Stages/Grayscale/GrayscaleOverview',
  component: GrayscaleOverview,
  parameters: {
    layout: 'padded',
  },
  decorators: [
    (Story) => (
      <div style={{ maxWidth: 900 }}>
        <Story />
      </div>
    ),
  ],
};
export default meta;

type Story = StoryObj<typeof GrayscaleOverview>;

// ── Default ───────────────────────────────────────────────────────────────────

export const Default: Story = {
  args: {
    stats: {
      pagesProcessed: 232,
      pagesFlagged: 5,
      avgSecondsPerPage: 0.8,
      totalSeconds: 185.6,
    },
  },
};

// ── NoFlagged ─────────────────────────────────────────────────────────────────

export const NoFlagged: Story = {
  name: 'No Flagged Pages',
  args: {
    stats: {
      pagesProcessed: 310,
      pagesFlagged: 0,
      avgSecondsPerPage: 1.2,
      totalSeconds: 372,
    },
  },
};

// ── WithModeBreakdown ─────────────────────────────────────────────────────────

export const WithModeBreakdown: Story = {
  name: 'With Mode Breakdown',
  args: {
    stats: {
      pagesProcessed: 232,
      pagesFlagged: 5,
      avgSecondsPerPage: 0.8,
      totalSeconds: 185.6,
      standardCount: 34,
      perceptualCount: 198,
    },
  },
};

// ── Empty ─────────────────────────────────────────────────────────────────────

export const Empty: Story = {
  args: {
    stats: {
      pagesProcessed: 0,
      pagesFlagged: 0,
      avgSecondsPerPage: 0,
      totalSeconds: 0,
    },
  },
};
