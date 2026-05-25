/**
 * SourcePageWorkbench stories.
 *
 * Stories:
 *   - Default
 *   - FirstPage (hasPrev=false)
 *   - LastPage (hasNext=false)
 *   - Rotated90
 *   - WithToneHint
 *   - EachRole (6 separate role variants)
 */

import type { Meta, StoryObj } from '@storybook/react';
import React, { useState } from 'react';
import { SourcePageWorkbench } from './SourcePageWorkbench.js';
import type { SourcePage, SourcePageRole } from './ThumbCard.js';

// ── Meta ──────────────────────────────────────────────────────────────────────

const meta: Meta<typeof SourcePageWorkbench> = {
  title: 'Stages/Source/SourcePageWorkbench',
  component: SourcePageWorkbench,
  parameters: {
    layout: 'fullscreen',
  },
  decorators: [
    (Story) => (
      <div style={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof SourcePageWorkbench>;

// ── Fixtures ──────────────────────────────────────────────────────────────────

const SAMPLE_PAGE: SourcePage = {
  id: 'p-005',
  pageNumber: 12,
  thumbnailUrl: 'https://picsum.photos/seed/page5/200/260',
  status: 'ok',
  role: 'page',
};

const BASE_ARGS = {
  page: SAMPLE_PAGE,
  beforeImageUrl: 'https://picsum.photos/seed/before5/800/1040',
  afterImageUrl: 'https://picsum.photos/seed/after5/800/1040',
  pageWidth: 2400,
  pageHeight: 3120,
  hasPrev: true,
  hasNext: true,
};

// ── Stories ───────────────────────────────────────────────────────────────────

export const Default: Story = {
  args: {
    ...BASE_ARGS,
  },
};

export const FirstPage: Story = {
  name: 'FirstPage (prev disabled)',
  args: {
    ...BASE_ARGS,
    page: { ...SAMPLE_PAGE, pageNumber: 1 },
    hasPrev: false,
  },
};

export const LastPage: Story = {
  name: 'LastPage (next disabled)',
  args: {
    ...BASE_ARGS,
    page: { ...SAMPLE_PAGE, pageNumber: 387 },
    hasNext: false,
  },
};

export const Rotated90: Story = {
  name: 'Rotated 90°',
  args: {
    ...BASE_ARGS,
    rotationDeg: 90,
  },
};

export const WithToneHint: Story = {
  name: 'With Tone Hint',
  args: {
    ...BASE_ARGS,
    toneHint: 'Mostly text',
  },
};

// Interactive story — role change state management
export const Interactive: Story = {
  name: 'Interactive (role change)',
  render: function InteractiveStory(args) {
    const [page, setPage] = useState<SourcePage>(args.page);
    return (
      <SourcePageWorkbench
        {...args}
        page={page}
        onRoleChange={(role: SourcePageRole) =>
          setPage((prev) => ({ ...prev, role }))
        }
      />
    );
  },
  args: {
    ...BASE_ARGS,
  },
};

// One story per role
export const RoleCover: Story = {
  name: 'Role: Cover',
  args: {
    ...BASE_ARGS,
    page: { ...SAMPLE_PAGE, role: 'cover' },
  },
};

export const RoleBack: Story = {
  name: 'Role: Back',
  args: {
    ...BASE_ARGS,
    page: { ...SAMPLE_PAGE, role: 'back' },
  },
};

export const RoleBlank: Story = {
  name: 'Role: Blank',
  args: {
    ...BASE_ARGS,
    page: { ...SAMPLE_PAGE, role: 'blank' },
  },
};

export const RoleDuplicate: Story = {
  name: 'Role: Duplicate',
  args: {
    ...BASE_ARGS,
    page: { ...SAMPLE_PAGE, role: 'duplicate' },
  },
};

export const EachRole: Story = {
  name: 'EachRole (grid)',
  render: function EachRoleStory(args) {
    const roles: SourcePageRole[] = ['page', 'cover', 'back', 'blank', 'duplicate'];
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 40, padding: 24 }}>
        {roles.map((role) => (
          <div key={role} style={{ border: '1px solid var(--border-1)', borderRadius: 8, overflow: 'hidden' }}>
            <div style={{ padding: '8px 16px', background: 'var(--bg-surface)', fontSize: 11, color: 'var(--ink-3)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '.06em' }}>
              role: {role}
            </div>
            <SourcePageWorkbench
              {...args}
              page={{ ...args.page, role }}
            />
          </div>
        ))}
      </div>
    );
  },
  args: {
    ...BASE_ARGS,
  },
};
