/**
 * ReorderScansBanner Storybook stories.
 *
 * Stories:
 *   1. DetectedHigh   — several swaps detected, all high confidence
 *   2. DetectedMix    — mix of high and medium confidence swaps
 *   3. Clean          — no swaps needed, scans look in order
 *   4. NoneDetected   — detection ran, zero swaps found (edge case)
 */

import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { ReorderScansBanner } from './ReorderScansBanner.js';

const meta: Meta<typeof ReorderScansBanner> = {
  title: 'Stages/PageReorder/ReorderScansBanner',
  component: ReorderScansBanner,
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

type Story = StoryObj<typeof ReorderScansBanner>;

// ── DetectedHigh ──────────────────────────────────────────────────────────────

export const DetectedHigh: Story = {
  args: {
    state: 'detected',
    detected: 2,
    highCount: 2,
    mediumCount: 0,
    sortBy: 'confidence',
    onSort: (sort) => console.log('sort:', sort),
    onAutoApply: () => console.log('auto-apply'),
    onSkip: () => console.log('skip'),
  },
};

// ── DetectedMix ───────────────────────────────────────────────────────────────

export const DetectedMix: Story = {
  args: {
    state: 'detected',
    detected: 5,
    highCount: 3,
    mediumCount: 2,
    sortBy: 'confidence',
    onSort: (sort) => console.log('sort:', sort),
    onAutoApply: () => console.log('auto-apply'),
    onSkip: () => console.log('skip'),
  },
};

// ── Clean ─────────────────────────────────────────────────────────────────────

export const Clean: Story = {
  args: {
    state: 'clean',
    onRedetect: () => console.log('re-detect'),
  },
};

// ── NoneDetected ──────────────────────────────────────────────────────────────

export const NoneDetected: Story = {
  args: {
    state: 'detected',
    detected: 0,
    highCount: 0,
    mediumCount: 0,
    sortBy: 'confidence',
    onSort: (sort) => console.log('sort:', sort),
    onAutoApply: () => console.log('auto-apply'),
    onSkip: () => console.log('skip'),
  },
};
