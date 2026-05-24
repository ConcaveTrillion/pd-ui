import type { Meta, StoryObj } from '@storybook/react';
import { ThumbFlagBadge } from './ThumbFlagBadge.js';

const meta: Meta<typeof ThumbFlagBadge> = {
  title: 'Primitives/ThumbFlagBadge',
  component: ThumbFlagBadge,
  tags: ['autodocs'],
};
export default meta;

type Story = StoryObj<typeof ThumbFlagBadge>;

export const Default: Story = {
  args: {
    kind: 'blurry',
  },
};

export const WithCount: Story = {
  args: {
    kind: 'skew',
    count: 3,
  },
};

export const Active: Story = {
  args: {
    kind: 'dark',
    active: true,
  },
};

export const Muted: Story = {
  args: {
    kind: 'low-conf',
    mute: true,
  },
};

export const OnThumbnail: Story = {
  render: () => (
    <div
      style={{
        position: 'relative',
        width: 160,
        height: 220,
        background: 'var(--bg-sunk)',
        border: '1px solid var(--border-1)',
        borderRadius: 4,
      }}
    >
      <div style={{ position: 'absolute', bottom: 6, left: 6 }}>
        <ThumbFlagBadge kind="blurry" count={2} />
      </div>
    </div>
  ),
};
