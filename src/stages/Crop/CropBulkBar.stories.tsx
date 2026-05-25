/**
 * CropBulkBar Storybook stories.
 *
 * Stories:
 *   1. Default          — dock variant, small selection, no flag summary
 *   2. FewSelected      — 3 pages selected
 *   3. ManySelected     — 47 pages selected
 *   4. WithFlagSummary  — flag summary string present
 *   5. FloatVariant     — float variant (floating card)
 *   6. Interactive      — full interactive controls
 */

import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { CropBulkBar } from './CropBulkBar.js';

const meta: Meta<typeof CropBulkBar> = {
  title: 'Stages/Crop/CropBulkBar',
  component: CropBulkBar,
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
  argTypes: {
    onAction: { action: 'onAction' },
    onClear: { action: 'onClear' },
  },
};
export default meta;

type Story = StoryObj<typeof CropBulkBar>;

// ── Default ───────────────────────────────────────────────────────────────────

export const Default: Story = {
  args: {
    selectedCount: 1,
    variant: 'dock',
  },
};

// ── FewSelected ───────────────────────────────────────────────────────────────

export const FewSelected: Story = {
  args: {
    selectedCount: 3,
    variant: 'dock',
  },
};

// ── ManySelected ──────────────────────────────────────────────────────────────

export const ManySelected: Story = {
  args: {
    selectedCount: 47,
    variant: 'dock',
  },
};

// ── WithFlagSummary ───────────────────────────────────────────────────────────

export const WithFlagSummary: Story = {
  args: {
    selectedCount: 12,
    flagSummary: '2 over-crop · 1 deskew fail · 3 tiny bbox',
    variant: 'dock',
  },
};

// ── FloatVariant ──────────────────────────────────────────────────────────────

export const FloatVariant: Story = {
  args: {
    selectedCount: 8,
    flagSummary: '1 over-crop',
    variant: 'float',
  },
  decorators: [
    (Story) => (
      <div style={{ position: 'relative', height: 120, maxWidth: 900 }}>
        <Story />
      </div>
    ),
  ],
};

// ── Interactive ───────────────────────────────────────────────────────────────

export const Interactive: Story = {
  args: {
    selectedCount: 5,
    flagSummary: '2 over-crop · 1 deskew fail',
    variant: 'dock',
  },
};
