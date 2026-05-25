import type { Meta, StoryObj } from '@storybook/react';
import { HyphenOverview } from './HyphenOverview.js';

const meta: Meta<typeof HyphenOverview> = {
  title: 'Stages/HyphenJoin/HyphenOverview',
  component: HyphenOverview,
  parameters: {
    layout: 'padded',
  },
};

export default meta;
type Story = StoryObj<typeof HyphenOverview>;

/** All stats at zero — fresh book, no hyphens processed yet. */
export const AllZero: Story = {
  args: {
    stats: {
      undecided: 0,
      autoJoined: 0,
      mismatch: 0,
      flagged: 0,
    },
  },
};

/** Mid-pipeline state — typical book with a mix of auto-resolved and pending cases. */
export const MidPipeline: Story = {
  args: {
    stats: {
      undecided: 7,
      autoJoined: 42,
      mismatch: 3,
      flagged: 1,
    },
    notesPreview:
      'These notes will be included with the PGDP submission package. ' +
      'Flagged cases should be reviewed before finalising the package.',
  },
};

/** Mid-pipeline stats without a notes preview section. */
export const NoNotes: Story = {
  args: {
    stats: {
      undecided: 7,
      autoJoined: 42,
      mismatch: 3,
      flagged: 1,
    },
  },
};
