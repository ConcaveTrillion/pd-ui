/**
 * AfterApplyStrip Storybook stories.
 *
 * Stories:
 *   1. Default      — typical mix: some accepted, some skipped, Undo available
 *   2. OnlyAccepted — all swaps accepted, Undo available
 *   3. AllSkipped   — all swaps skipped, no Undo affordance
 */

import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { AfterApplyStrip } from './AfterApplyStrip.js';

const meta: Meta<typeof AfterApplyStrip> = {
  title: 'Stages/PageReorder/AfterApplyStrip',
  component: AfterApplyStrip,
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

type Story = StoryObj<typeof AfterApplyStrip>;

// ── Default ───────────────────────────────────────────────────────────────────

export const Default: Story = {
  args: {
    acceptedCount: 2,
    skippedCount: 4,
    onUndo: () => console.log('undo'),
  },
};

// ── OnlyAccepted ──────────────────────────────────────────────────────────────

export const OnlyAccepted: Story = {
  args: {
    acceptedCount: 6,
    skippedCount: 0,
    onUndo: () => console.log('undo'),
  },
};

// ── AllSkipped ────────────────────────────────────────────────────────────────

export const AllSkipped: Story = {
  name: 'AllSkipped',
  args: {
    acceptedCount: 0,
    skippedCount: 6,
    // onUndo intentionally omitted — Undo button hidden
  },
};
