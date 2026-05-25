/**
 * PageViewer stories.
 *
 * Stories:
 *   - Before
 *   - Split
 *   - After
 *   - WithThumbs
 *   - NoRerun
 *   - Interactive
 */

import type { Meta, StoryObj } from '@storybook/react';
import React, { useState } from 'react';
import { PageViewer } from './PageViewer.js';
import type { PageViewerMode, PageViewerThumb } from './PageViewer.js';

// ── Meta ──────────────────────────────────────────────────────────────────────

const meta: Meta<typeof PageViewer> = {
  title: 'Stages/Grayscale/PageViewer',
  component: PageViewer,
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
type Story = StoryObj<typeof PageViewer>;

// ── Fixtures ──────────────────────────────────────────────────────────────────

const SAMPLE_PAGE = {
  id: 'p-005',
  pageNumber: 5,
  beforeImageUrl: 'https://picsum.photos/seed/before5/800/1040',
  afterImageUrl: 'https://picsum.photos/seed/after5/800/1040',
  pageWidth: 2400,
  pageHeight: 3120,
};

const SAMPLE_THUMBS: PageViewerThumb[] = Array.from({ length: 13 }, (_, i) => ({
  id: `p-${String(i + 1).padStart(3, '0')}`,
  pageNumber: i + 1,
  thumbnailUrl: `https://picsum.photos/seed/thumb${i + 1}/120/160`,
}));

const BASE_ARGS = {
  page: SAMPLE_PAGE,
  mode: 'after' as PageViewerMode,
  onModeChange: () => undefined,
  onRerun: () => undefined,
};

// ── Stories ───────────────────────────────────────────────────────────────────

export const Before: Story = {
  name: 'Before mode',
  args: {
    ...BASE_ARGS,
    mode: 'before',
  },
};

export const Split: Story = {
  name: 'Split mode',
  args: {
    ...BASE_ARGS,
    mode: 'split',
  },
};

export const After: Story = {
  name: 'After mode',
  args: {
    ...BASE_ARGS,
    mode: 'after',
  },
};

export const WithThumbs: Story = {
  name: 'With Thumbnails',
  args: {
    ...BASE_ARGS,
    thumbs: SAMPLE_THUMBS,
    activeThumbId: 'p-005',
  },
};

export const NoRerun: Story = {
  name: 'No Re-run Button',
  args: {
    page: SAMPLE_PAGE,
    mode: 'after',
    onModeChange: () => undefined,
    thumbs: SAMPLE_THUMBS,
    activeThumbId: 'p-005',
    // onRerun intentionally omitted
  },
};

export const Interactive: Story = {
  name: 'Interactive (mode + thumb)',
  render: function InteractiveStory(args) {
    const [mode, setMode] = useState<PageViewerMode>('after');
    const [activeId, setActiveId] = useState<string>('p-005');
    return (
      <PageViewer
        {...args}
        mode={mode}
        onModeChange={setMode}
        activeThumbId={activeId}
        onThumbClick={setActiveId}
      />
    );
  },
  args: {
    ...BASE_ARGS,
    thumbs: SAMPLE_THUMBS,
    activeThumbId: 'p-005',
  },
};
