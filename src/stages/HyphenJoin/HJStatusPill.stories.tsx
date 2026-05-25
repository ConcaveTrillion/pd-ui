/**
 * HJStatusPill Storybook stories.
 *
 * Stories:
 *   1. CrossPage   — cross-page routing (purple/ocr)
 *   2. Validated   — human-confirmed join (green/exact, filled)
 *   3. AutoJoined  — auto-joined, awaiting check (green/exact, dashed border)
 *   4. Undecided   — no rule match (amber/fuzzy)
 *   5. Flagged     — mismatch in book (red/mismatch)
 *   6. Combined    — all 5 stacked for at-a-glance comparison
 */

import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { HJStatusPill } from './HJStatusPill.js';
import type { HJStatus } from './HJStatusPill.js';

const meta: Meta<typeof HJStatusPill> = {
  title: 'Stages/HyphenJoin/HJStatusPill',
  component: HJStatusPill,
  parameters: {
    layout: 'padded',
  },
  argTypes: {
    status: {
      control: { type: 'select' },
      options: [
        'cross-page',
        'validated',
        'auto-joined',
        'undecided',
        'flagged',
      ] satisfies HJStatus[],
    },
  },
};
export default meta;

type Story = StoryObj<typeof HJStatusPill>;

// ── Individual variants ───────────────────────────────────────────────────────

export const CrossPage: Story = {
  name: 'CrossPage',
  args: { status: 'cross-page' },
};

export const Validated: Story = {
  name: 'Validated',
  args: { status: 'validated' },
};

export const AutoJoined: Story = {
  name: 'AutoJoined',
  args: { status: 'auto-joined' },
};

export const Undecided: Story = {
  name: 'Undecided',
  args: { status: 'undecided' },
};

export const Flagged: Story = {
  name: 'Flagged',
  args: { status: 'flagged' },
};

// ── Combined — all 5 stacked ──────────────────────────────────────────────────

const ALL_STATUSES: HJStatus[] = ['cross-page', 'validated', 'auto-joined', 'undecided', 'flagged'];

export const Combined: Story = {
  name: 'Combined (all variants)',
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8, alignItems: 'flex-start' }}>
      {ALL_STATUSES.map((status) => (
        <HJStatusPill key={status} status={status} />
      ))}
    </div>
  ),
};
