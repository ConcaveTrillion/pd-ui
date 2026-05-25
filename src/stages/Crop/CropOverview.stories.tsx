/**
 * CropOverview Storybook stories.
 *
 * Stories:
 *   1. Default        — typical run with a mix of all four flag kinds
 *   2. NoFlags        — no flags recorded (empty distribution panel)
 *   3. NoActivity     — no recent activity (empty activity panel)
 *   4. Empty          — both panels empty
 *   5. ManyEntries    — many activity log entries for scroll/overflow testing
 */

import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { CropOverview } from './CropOverview.js';
import type { CropActivityEntry, FlagDistributionEntry } from './CropOverview.js';

const meta: Meta<typeof CropOverview> = {
  title: 'Stages/Crop/CropOverview',
  component: CropOverview,
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

type Story = StoryObj<typeof CropOverview>;

// ── Shared fixtures ───────────────────────────────────────────────────────────

const NOW = new Date('2026-01-01T12:00:00Z').getTime();

const DEFAULT_FLAGS: FlagDistributionEntry[] = [
  { kind: 'overCrop', count: 12 },
  { kind: 'underCrop', count: 8 },
  { kind: 'deskewFail', count: 3 },
  { kind: 'edgeNoise', count: 5 },
];

const DEFAULT_ACTIVITY: CropActivityEntry[] = [
  {
    id: 'a1',
    timestamp: new Date(NOW - 8 * 60 * 1000).toISOString(),
    message: 'Auto-crop run completed',
    actor: 'system',
  },
  {
    id: 'a2',
    timestamp: new Date(NOW - 8 * 60 * 1000).toISOString(),
    message: 'Stage started',
  },
  {
    id: 'a3',
    timestamp: new Date(NOW - 11 * 60 * 1000).toISOString(),
    message: 'Settings changed',
    actor: 'user-42',
  },
  {
    id: 'a4',
    timestamp: new Date(NOW - 12 * 60 * 1000).toISOString(),
    message: 'Source stage confirmed — 387 pages forwarded',
  },
];

// ── Default ───────────────────────────────────────────────────────────────────

export const Default: Story = {
  args: {
    flagDistribution: DEFAULT_FLAGS,
    recentActivity: DEFAULT_ACTIVITY,
  },
};

// ── NoFlags ───────────────────────────────────────────────────────────────────

export const NoFlags: Story = {
  name: 'No Flags',
  args: {
    flagDistribution: [],
    recentActivity: DEFAULT_ACTIVITY,
  },
};

// ── NoActivity ────────────────────────────────────────────────────────────────

export const NoActivity: Story = {
  name: 'No Activity',
  args: {
    flagDistribution: DEFAULT_FLAGS,
    recentActivity: [],
  },
};

// ── Empty ─────────────────────────────────────────────────────────────────────

export const Empty: Story = {
  args: {
    flagDistribution: [],
    recentActivity: [],
  },
};

// ── ManyEntries ───────────────────────────────────────────────────────────────

const MANY_ENTRIES: CropActivityEntry[] = Array.from({ length: 20 }, (_, i) => {
  const entry: CropActivityEntry = {
    id: `entry-${i}`,
    timestamp: new Date(NOW - (i + 1) * 3 * 60 * 1000).toISOString(),
    message: `Activity event ${i + 1} — some description of what happened`,
  };
  if (i % 3 === 0) {
    entry.actor = `user-${i}`;
  }
  return entry;
});

export const ManyEntries: Story = {
  name: 'Many Entries',
  args: {
    flagDistribution: [
      { kind: 'overCrop', count: 42 },
      { kind: 'underCrop', count: 28 },
      { kind: 'deskewFail', count: 15 },
      { kind: 'edgeNoise', count: 33 },
    ],
    recentActivity: MANY_ENTRIES,
  },
};
