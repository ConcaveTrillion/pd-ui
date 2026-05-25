/**
 * SummaryHeader Storybook stories.
 *
 * Stories:
 *   1. Pass    — all checks green, Download CTA
 *   2. Warn    — warnings present, Fix All CTA
 *   3. Error   — failures present, Fix All CTA
 *   4. WarnWithSkip — warn state with skip count present
 */

import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { SummaryHeader } from './SummaryHeader.js';

const meta: Meta<typeof SummaryHeader> = {
  title: 'Stages/Validation/SummaryHeader',
  component: SummaryHeader,
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

type Story = StoryObj<typeof SummaryHeader>;

// ── Pass ──────────────────────────────────────────────────────────────────────

export const Pass: Story = {
  args: {
    state: 'pass',
    counts: { pass: 8, warn: 0, error: 0 },
    onDownload: () => console.log('download'),
  },
};

// ── Warn ──────────────────────────────────────────────────────────────────────

export const Warn: Story = {
  args: {
    state: 'warn',
    counts: { pass: 6, warn: 2, error: 0 },
    onFixAll: () => console.log('fix all'),
  },
};

// ── Error ─────────────────────────────────────────────────────────────────────

export const Error: Story = {
  name: 'Error',
  args: {
    state: 'error',
    counts: { pass: 3, warn: 2, error: 3 },
    onFixAll: () => console.log('fix all'),
  },
};

// ── WarnWithSkip ──────────────────────────────────────────────────────────────

export const WarnWithSkip: Story = {
  name: 'WarnWithSkip',
  args: {
    state: 'warn',
    counts: { pass: 5, warn: 1, error: 0, skip: 2 },
    onFixAll: () => console.log('fix all'),
  },
};
