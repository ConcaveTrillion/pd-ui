import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { ThumbGrid } from './ThumbGrid.js';

const meta: Meta = {
  title: 'Primitives/ThumbGrid',
  parameters: { layout: 'padded' },
  tags: ['autodocs'],
};
export default meta;

interface PageItem {
  id: string;
  label: string;
}

const items: PageItem[] = Array.from({ length: 12 }, (_, i) => ({
  id: `page-${i + 1}`,
  label: `Page ${i + 1}`,
}));

export const Default: StoryObj = {
  render: () => (
    <ThumbGrid
      items={items}
      thumbSize={160}
      renderItem={(item) => (
        <div
          key={item.id}
          style={{
            width: '100%',
            aspectRatio: '3/4',
            background: 'var(--bg-raised)',
            border: '1px solid var(--border-1)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '12px',
            color: 'var(--ink-2)',
          }}
        >
          {item.label}
        </div>
      )}
    />
  ),
};

export const Small: StoryObj = {
  render: () => (
    <ThumbGrid
      items={items}
      thumbSize={100}
      renderItem={(item) => (
        <div
          key={item.id}
          style={{
            width: '100%',
            aspectRatio: '3/4',
            background: 'var(--bg-raised)',
            border: '1px solid var(--border-1)',
          }}
        />
      )}
    />
  ),
};

export const Empty: StoryObj = {
  render: () => (
    <ThumbGrid
      items={[]}
      renderItem={() => <div />}
      emptyState={
        <p style={{ color: 'var(--ink-3)', textAlign: 'center' }}>No thumbnails to display.</p>
      }
    />
  ),
};
