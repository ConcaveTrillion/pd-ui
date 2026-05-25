/**
 * AutoDetectBanner Storybook stories.
 *
 * Stories:
 *   1. Standard       — standard mode, no profile chip, with re-detect
 *   2. Perceptual     — perceptual mode, no profile chip, with re-detect
 *   3. WithProfile    — perceptual mode + "text-heavy" profile chip
 *   4. NoRedetect     — standard mode, no Re-detect button
 *   5. Interactive    — fully wired controls story
 */

import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { AutoDetectBanner } from './AutoDetectBanner.js';

const meta: Meta<typeof AutoDetectBanner> = {
  title: 'Stages/Grayscale/AutoDetectBanner',
  component: AutoDetectBanner,
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

type Story = StoryObj<typeof AutoDetectBanner>;

// ── Standard ──────────────────────────────────────────────────────────────────

export const Standard: Story = {
  args: {
    mode: 'standard',
    estimatedSecondsPerPage: 1,
    onRedetect: () => console.log('re-detect'),
  },
};

// ── Perceptual ────────────────────────────────────────────────────────────────

export const Perceptual: Story = {
  args: {
    mode: 'perceptual',
    estimatedSecondsPerPage: 3,
    onRedetect: () => console.log('re-detect'),
  },
};

// ── WithProfile ───────────────────────────────────────────────────────────────

export const WithProfile: Story = {
  args: {
    mode: 'perceptual',
    profile: 'text-heavy',
    estimatedSecondsPerPage: 3,
    onRedetect: () => console.log('re-detect'),
  },
};

// ── NoRedetect ────────────────────────────────────────────────────────────────

export const NoRedetect: Story = {
  args: {
    mode: 'standard',
    profile: 'mixed',
    estimatedSecondsPerPage: 2,
    // onRedetect intentionally omitted
  },
};

// ── Interactive ───────────────────────────────────────────────────────────────

export const Interactive: Story = {
  args: {
    mode: 'perceptual',
    profile: 'art-heavy',
    estimatedSecondsPerPage: 4,
    onRedetect: () => console.log('re-detect'),
  },
};
