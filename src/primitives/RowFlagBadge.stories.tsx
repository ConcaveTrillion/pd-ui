import type { Meta, StoryObj } from '@storybook/react';
import { RowFlagBadge } from './RowFlagBadge.js';

const meta: Meta<typeof RowFlagBadge> = {
  title: 'Primitives/RowFlagBadge',
  component: RowFlagBadge,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
};
export default meta;
type Story = StoryObj<typeof RowFlagBadge>;

export const Default: Story = {
  args: { kind: 'blurry' },
};

export const AllKinds: Story = {
  render: () => (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
      {(['blurry', 'skew', 'dark', 'errored', 'overflow', 'low-conf'] as const).map((kind) => (
        <RowFlagBadge key={kind} kind={kind} />
      ))}
    </div>
  ),
};
