import type { Meta, StoryObj } from '@storybook/react';
import { HyphenAutoJoined } from './HyphenAutoJoined.js';
import type { HyphenAutoJoinedGroup } from './HyphenAutoJoined.js';

const meta: Meta<typeof HyphenAutoJoined> = {
  title: 'Stages/HyphenJoin/HyphenAutoJoined',
  component: HyphenAutoJoined,
  parameters: {
    layout: 'padded',
  },
};

export default meta;
type Story = StoryObj<typeof HyphenAutoJoined>;

// ─── Sample data ──────────────────────────────────────────────────────────────

const FEW_GROUPS: HyphenAutoJoinedGroup[] = [
  {
    word: 'without',
    cases: [
      {
        id: 'a1',
        originalText: 'with-\nout',
        joinProposal: 'without',
        status: 'auto-joined',
      },
      {
        id: 'a2',
        originalText: 'with-\nout',
        joinProposal: 'without',
        status: 'validated',
      },
    ],
  },
  {
    word: 'something',
    cases: [
      {
        id: 'b1',
        originalText: 'some-\nthing',
        joinProposal: 'something',
        status: 'auto-joined',
      },
    ],
  },
  {
    word: 'somewhere',
    cases: [
      {
        id: 'c1',
        originalText: 'some-\nwhere',
        joinProposal: 'somewhere',
        status: 'auto-joined',
      },
    ],
  },
];

const MANY_GROUPS: HyphenAutoJoinedGroup[] = [
  ...FEW_GROUPS,
  {
    word: 'everything',
    cases: [
      {
        id: 'd1',
        originalText: 'every-\nthing',
        joinProposal: 'everything',
        status: 'auto-joined',
      },
      {
        id: 'd2',
        originalText: 'every-\nthing',
        joinProposal: 'everything',
        status: 'auto-joined',
      },
      {
        id: 'd3',
        originalText: 'every-\nthing',
        joinProposal: 'everything',
        status: 'validated',
      },
    ],
  },
  {
    word: 'afterward',
    cases: [
      {
        id: 'e1',
        originalText: 'after-\nward',
        joinProposal: 'afterward',
        status: 'auto-joined',
      },
    ],
  },
  {
    word: 'however',
    cases: [
      {
        id: 'f1',
        originalText: 'how-\never',
        joinProposal: 'however',
        status: 'auto-joined',
      },
      {
        id: 'f2',
        originalText: 'how-\never',
        joinProposal: 'however',
        status: 'flagged',
      },
    ],
  },
  {
    word: 'throughout',
    cases: [
      {
        id: 'g1',
        originalText: 'through-\nout',
        joinProposal: 'throughout',
        status: 'auto-joined',
      },
    ],
  },
  {
    word: 'whenever',
    cases: [
      {
        id: 'h1',
        originalText: 'when-\never',
        joinProposal: 'whenever',
        status: 'auto-joined',
      },
    ],
  },
];

// ─── Stories ──────────────────────────────────────────────────────────────────

export const FewGroups: Story = {
  name: 'FewGroups',
  args: {
    groups: FEW_GROUPS,
    onValidate: () => {},
  },
};

export const ManyGroups: Story = {
  name: 'ManyGroups',
  args: {
    groups: MANY_GROUPS,
    onValidate: () => {},
  },
};

export const Empty: Story = {
  name: 'Empty',
  args: {
    groups: [],
  },
};
