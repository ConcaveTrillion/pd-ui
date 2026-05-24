/**
 * PWHeader stories — PageWorkbench title bar (Phase 2 M2).
 *
 * Covers:
 *   Default       — mid-range page, all controls enabled
 *   FirstPage     — Prev disabled (currentIdx === 0)
 *   LastPage      — Next disabled (currentIdx === total − 1)
 *   WithActions   — actionsSlot with two action buttons
 *   LongBreadcrumb — 5-level breadcrumb to verify truncation
 */
import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { PWHeader } from './PWHeader.js';
import { Button } from '../../primitives/Button.js';
import { Icon } from '../../icons/Icon.js';

const meta: Meta<typeof PWHeader> = {
  title: 'Stages/PageWorkbench/PWHeader',
  component: PWHeader,
  parameters: {
    layout: 'fullscreen',
  },
  args: {
    breadcrumb: [
      { label: 'belloc-survivals', href: '/projects/1' },
      { label: 'Pages', href: '/projects/1/pages' },
      { label: 'p012' },
    ],
    currentIdx: 11,
    total: 232,
    mode: 'view',
    onModeChange: () => undefined,
    onPrev: () => undefined,
    onNext: () => undefined,
  },
};

export default meta;
type Story = StoryObj<typeof PWHeader>;

/** Default: mid-sequence page with all controls enabled. */
export const Default: Story = {};

/** FirstPage: Prev button is disabled at the start of the sequence. */
export const FirstPage: Story = {
  args: {
    currentIdx: 0,
  },
};

/** LastPage: Next button is disabled at the end of the sequence. */
export const LastPage: Story = {
  args: {
    currentIdx: 231,
  },
};

/** WithActions: actionsSlot renders two action buttons at the far right. */
export const WithActions: Story = {
  args: {
    actionsSlot: (
      <>
        <Button variant="ghost" size="sm" icon={<Icon name="search" size={12} />}>
          Find similar
        </Button>
        <Button variant="primary" size="sm" icon={<Icon name="check" size={12} />}>
          Mark reviewed
        </Button>
      </>
    ),
  },
};

/** LongBreadcrumb: five-level path verifies label truncation at narrow widths. */
export const LongBreadcrumb: Story = {
  args: {
    breadcrumb: [
      { label: 'my-organization', href: '/org/1' },
      { label: 'belloc-survivals-and-new-judgements', href: '/projects/1' },
      { label: 'Pages', href: '/projects/1/pages' },
      { label: 'Section 3', href: '/projects/1/pages?section=3' },
      { label: 'p0312' },
    ],
    currentIdx: 311,
    total: 487,
  },
};
