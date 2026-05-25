/**
 * GrayThumb Storybook stories.
 *
 * Covers:
 *   1. Default — basic thumbnail with moderate estimate
 *   2. WithStatus — each processing status variant
 *   3. FastEstimate — 1 second estimate
 *   4. SlowEstimate — 35 second estimate
 *   5. Interactive — clickable with onClick handler
 */

import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { GrayThumb } from './GrayThumb.js';
import type { GrayPage } from './GrayThumb.js';

// ─── Fixture ──────────────────────────────────────────────────────────────────

// 1×1 grey PNG placeholder for thumbnail
const THUMB_PNG =
  'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAAC0lEQVQI12NgAAIABQAABjE+ibYAAAAASUVORK5CYII=';

const makePage = (overrides: Partial<GrayPage> = {}): GrayPage => ({
  id: 'p1',
  pageNumber: 1,
  thumbnailUrl: THUMB_PNG,
  ...overrides,
});

// ─── Meta ─────────────────────────────────────────────────────────────────────

const meta: Meta<typeof GrayThumb> = {
  title: 'Stages/Grayscale/GrayThumb',
  component: GrayThumb,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof GrayThumb>;

// ─── Stories ──────────────────────────────────────────────────────────────────

/** Default: a basic thumbnail with a moderate time estimate. */
export const Default: Story = {
  args: {
    page: makePage({ pageNumber: 5 }),
    estimatedSeconds: 8,
  },
};

/** WithStatus: shows all four processing status variants. */
export const WithStatus: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
      {(['pending', 'processing', 'done', 'error'] as const).map((status) => (
        <div key={status} style={{ textAlign: 'center' }}>
          <GrayThumb
            page={makePage({ id: `p-${status}`, pageNumber: 3, status })}
            estimatedSeconds={10}
            data-testid={`gray-thumb-${status}`}
          />
          <small style={{ display: 'block', marginTop: '0.25rem' }}>{status}</small>
        </div>
      ))}
    </div>
  ),
};

/** FastEstimate: estimate is 1 second. */
export const FastEstimate: Story = {
  args: {
    page: makePage({ pageNumber: 12, status: 'done' }),
    estimatedSeconds: 1,
  },
};

/** SlowEstimate: estimate is 35 seconds. */
export const SlowEstimate: Story = {
  args: {
    page: makePage({ pageNumber: 7, status: 'processing' }),
    estimatedSeconds: 35,
  },
};

/** Interactive: clicking fires the onClick handler (check Actions panel). */
export const Interactive: Story = {
  args: {
    page: makePage({ pageNumber: 2, status: 'pending' }),
    estimatedSeconds: 12,
    interactive: true,
    onClick: (id: string) => {
      console.log('GrayThumb clicked, id:', id);
    },
  },
};
