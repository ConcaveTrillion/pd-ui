/**
 * PageThumb Storybook stories.
 *
 * Stories:
 *   1. Default          — two pages without thumbnail images (placeholder blocks)
 *   2. BothWithImages   — two pages with thumbnail URLs
 *   3. NumbersOnly      — string-typed page numbers, no thumbnails
 */

import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { PageThumb } from './PageThumb.js';

const meta: Meta<typeof PageThumb> = {
  title: 'Stages/PageReorder/PageThumb',
  component: PageThumb,
  parameters: {
    layout: 'padded',
  },
  decorators: [
    (Story) => (
      <div style={{ maxWidth: 480 }}>
        <Story />
      </div>
    ),
  ],
};
export default meta;

type Story = StoryObj<typeof PageThumb>;

// ─── Default ──────────────────────────────────────────────────────────────────

export const Default: Story = {
  args: {
    pageA: { id: 'page-7', number: 7 },
    pageB: { id: 'page-8', number: 8 },
  },
};

// ─── BothWithImages ───────────────────────────────────────────────────────────

export const BothWithImages: Story = {
  args: {
    pageA: { id: 'page-7', number: 7, thumbnailUrl: 'https://picsum.photos/seed/page7/80/120' },
    pageB: { id: 'page-8', number: 8, thumbnailUrl: 'https://picsum.photos/seed/page8/80/120' },
  },
};

// ─── NumbersOnly ──────────────────────────────────────────────────────────────

export const NumbersOnly: Story = {
  args: {
    pageA: { id: 'page-front', number: 'front' },
    pageB: { id: 'page-back', number: 'back' },
  },
};
