/**
 * CropBanner Storybook stories.
 *
 * Stories:
 *   1. Running        — running state at 35% progress
 *   2. Review         — review state with mixed flag counts
 *   3. Done           — done state with optional Re-run
 *   4. NoFlagsReview  — review state where all flag counts are zero
 *   5. Interactive    — fully wired controls story
 */

import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { CropBanner } from './CropBanner.js';

const meta: Meta<typeof CropBanner> = {
  title: 'Stages/Crop/CropBanner',
  component: CropBanner,
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

type Story = StoryObj<typeof CropBanner>;

// ── Running ───────────────────────────────────────────────────────────────────

export const Running: Story = {
  args: {
    state: 'running',
    progress: 0.35,
  },
};

// ── Review ────────────────────────────────────────────────────────────────────

export const Review: Story = {
  args: {
    state: 'review',
    flagCounts: {
      overCrop: 3,
      underCrop: 1,
      deskewFail: 2,
      edgeNoise: 4,
    },
    onRerun: () => console.log('rerun'),
  },
};

// ── Done ──────────────────────────────────────────────────────────────────────

export const Done: Story = {
  args: {
    state: 'done',
    onRerun: () => console.log('rerun'),
  },
};

// ── NoFlagsReview ─────────────────────────────────────────────────────────────

export const NoFlagsReview: Story = {
  name: 'NoFlagsReview',
  args: {
    state: 'review',
    flagCounts: {
      overCrop: 0,
      underCrop: 0,
      deskewFail: 0,
      edgeNoise: 0,
    },
    onRerun: () => console.log('rerun'),
  },
};

// ── Interactive ───────────────────────────────────────────────────────────────

export const Interactive: Story = {
  args: {
    state: 'review',
    progress: 0.6,
    flagCounts: {
      overCrop: 2,
      underCrop: 0,
      deskewFail: 1,
      edgeNoise: 3,
    },
    onRerun: () => console.log('rerun'),
  },
};
