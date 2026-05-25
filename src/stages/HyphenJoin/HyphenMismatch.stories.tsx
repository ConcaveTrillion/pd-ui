import type { Meta, StoryObj } from '@storybook/react';
import { HyphenMismatch } from './HyphenMismatch.js';
import type { HyphenMismatchItem } from './HyphenMismatch.js';

const meta: Meta<typeof HyphenMismatch> = {
  title: 'Stages/HyphenJoin/HyphenMismatch',
  component: HyphenMismatch,
  parameters: {
    layout: 'padded',
  },
};

export default meta;
type Story = StoryObj<typeof HyphenMismatch>;

// ── Sample data ───────────────────────────────────────────────────────────────

const FEW_MISMATCHES: Array<HyphenMismatchItem> = [
  {
    id: 'today',
    word: 'to-day',
    decisions: [
      { source: 'dictionary', choice: 'join' },
      { source: 'user', choice: 'keep' },
    ],
    reason: 'Dictionary says join; user override says keep',
  },
  {
    id: 'prewar',
    word: 'pre-war',
    decisions: [
      { source: 'auto', choice: 'join' },
      { source: 'corpus', choice: 'keep' },
    ],
    reason: 'Corpus scan found both forms equally distributed',
  },
  {
    id: 'tonight',
    word: 'to-night',
    decisions: [
      { source: 'dictionary', choice: 'join' },
      { source: 'corpus', choice: 'keep' },
    ],
  },
];

const MANY_MISMATCHES: Array<HyphenMismatchItem> = [
  ...FEW_MISMATCHES,
  {
    id: 'northeast',
    word: 'north-east',
    decisions: [
      { source: 'user', choice: 'keep' },
      { source: 'auto', choice: 'join' },
    ],
    reason: 'Conflicting period usage found on pp. 12, 34, 89',
  },
  {
    id: 'doorstep',
    word: 'door-step',
    decisions: [
      { source: 'dictionary', choice: 'join' },
      { source: 'user', choice: 'join' },
      { source: 'corpus', choice: 'keep' },
    ],
    reason: 'Corpus contradicts two sources that agree',
  },
  {
    id: 'overboard',
    word: 'over-board',
    decisions: [
      { source: 'auto', choice: 'keep' },
      { source: 'corpus', choice: 'join' },
    ],
  },
  {
    id: 'seafarer',
    word: 'sea-farer',
    decisions: [
      { source: 'dictionary', choice: 'keep' },
      { source: 'user', choice: 'join' },
    ],
    reason: 'Archaic spelling — user prefers joined form for consistency',
  },
];

// ── Stories ───────────────────────────────────────────────────────────────────

/** No mismatches — clean book with no conflicting decisions. */
export const Empty: Story = {
  args: {
    mismatches: [],
  },
};

/** Three mismatches — typical small book with a few conflicts. No resolve action. */
export const FewMismatches: Story = {
  args: {
    mismatches: FEW_MISMATCHES,
    onResolve: undefined,
  },
};

/**
 * Seven mismatches — larger book with several conflicts.
 * The `onResolve` callback is wired so each row shows a "Resolve" button.
 */
export const ManyMismatches: Story = {
  args: {
    mismatches: MANY_MISMATCHES,
    onResolve: (id: string) => {
      console.log('Resolve clicked for mismatch id:', id);
    },
  },
};
