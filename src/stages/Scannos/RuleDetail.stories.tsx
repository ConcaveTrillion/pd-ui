/**
 * RuleDetail Storybook stories (Phase 2 M7).
 *
 * Covers:
 *   1. DefaultRule      — basic rule, no conflicts, auto-apply off
 *   2. WithConflicts    — rule with two conflict warnings
 *   3. ManyContributors — rule with many contributors and auto-apply on
 */

import type { Meta, StoryObj } from '@storybook/react';
import { RuleDetail } from './RuleDetail.js';

// ─── Meta ─────────────────────────────────────────────────────────────────────

const meta: Meta<typeof RuleDetail> = {
  title: 'Stages/Scannos/RuleDetail',
  component: RuleDetail,
  parameters: {
    layout: 'padded',
  },
};

export default meta;
type Story = StoryObj<typeof RuleDetail>;

// ─── Stories ──────────────────────────────────────────────────────────────────

export const DefaultRule: Story = {
  args: {
    rule: {
      id: 'rule-teh',
      label: 'Scanno: teh → the',
      pattern: 'teh',
      hitCount: 42,
      contributingBooks: 7,
      contributors: ['alice', 'bob'],
      autoApply: false,
    },
    onToggleAutoApply: (next: boolean) => {
      console.log('onToggleAutoApply', next);
    },
  },
};

export const WithConflicts: Story = {
  args: {
    rule: {
      id: 'rule-wiht',
      label: 'Scanno: wiht → with',
      pattern: 'wiht',
      hitCount: 18,
      contributingBooks: 3,
      contributors: ['carol'],
      autoApply: false,
      conflicts: [
        {
          id: 'c1',
          description: 'Overlaps with word-initial rule for "wi-" abbreviation expansion.',
        },
        {
          id: 'c2',
          description:
            'May collide with regex pattern \\bwiht\\b in project-scoped override.',
        },
      ],
    },
    onToggleAutoApply: (next: boolean) => {
      console.log('onToggleAutoApply', next);
    },
  },
};

export const ManyContributors: Story = {
  args: {
    rule: {
      id: 'rule-ot',
      label: 'Scanno: ot → of',
      pattern: 'ot',
      hitCount: 312,
      contributingBooks: 24,
      contributors: ['alice', 'bob', 'carol', 'dave', 'eve', 'frank', 'grace'],
      autoApply: true,
    },
    onToggleAutoApply: (next: boolean) => {
      console.log('onToggleAutoApply', next);
    },
  },
};
