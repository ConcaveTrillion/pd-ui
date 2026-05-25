import type { Meta, StoryObj } from '@storybook/react';
import { HyphenPageWorkbench } from './HyphenPageWorkbench.js';
import type { HyphenPageWorkbenchPage } from './HyphenPageWorkbench.js';
import type { HJDecisionCase } from './HJDecisionCard.js';

// ─── Meta ─────────────────────────────────────────────────────────────────────

const meta = {
  title: 'Stages/HyphenJoin/HyphenPageWorkbench',
  component: HyphenPageWorkbench,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
  },
} satisfies Meta<typeof HyphenPageWorkbench>;

export default meta;
type Story = StoryObj<typeof meta>;

// ─── Fixtures ─────────────────────────────────────────────────────────────────

const PAGE: HyphenPageWorkbenchPage = {
  id: 'p-042',
  imageUrl: 'https://placehold.co/800x1100/1a1a2e/ffffff?text=Before',
  afterImageUrl: 'https://placehold.co/800x1100/0f3460/ffffff?text=After',
  pageWidth: 800,
  pageHeight: 1100,
  splitX: 0.5,
};

const CASES_MULTI: HJDecisionCase[] = [
  {
    id: 'case-1',
    originalText: 'some-thing',
    joinProposal: 'something',
    ngrams: [3, 7, 12, 8, 5, 9, 14, 10, 6, 11],
    status: 'undecided',
  },
  {
    id: 'case-2',
    originalText: 're-port',
    joinProposal: 'report',
    ngrams: [1, 4, 6, 5, 8, 7, 9, 8, 6, 10],
    status: 'auto-joined',
  },
  {
    id: 'case-3',
    originalText: 'cross-page',
    joinProposal: 'crosspage',
    status: 'cross-page',
  },
  {
    id: 'case-4',
    originalText: 'mis-match',
    joinProposal: 'mismatch',
    ngrams: [2, 3, 5, 4, 6, 5, 7, 6, 8, 7],
    status: 'flagged',
  },
];

// ─── Stories ──────────────────────────────────────────────────────────────────

/**
 * Default — single page with two cases; split view shows before/after images.
 * Accept on the "joined" case emits `validate`; Accept on other cases emits `accept`.
 */
export const Default: Story = {
  args: {
    page: PAGE,
    cases: [CASES_MULTI[0]!, CASES_MULTI[1]!],
    onDecide: (caseId, decision) =>
      console.log('onDecide', caseId, decision),
  },
};

/**
 * MultipleCases — four cases with varied statuses, including cross-page and flagged.
 */
export const MultipleCases: Story = {
  args: {
    page: PAGE,
    cases: CASES_MULTI,
    onDecide: (caseId, decision) =>
      console.log('onDecide', caseId, decision),
  },
};

/**
 * EmptyCases — page with no hyphen-join cases. Decision list is empty.
 */
export const EmptyCases: Story = {
  args: {
    page: PAGE,
    cases: [],
    onDecide: (caseId, decision) =>
      console.log('onDecide', caseId, decision),
  },
};
