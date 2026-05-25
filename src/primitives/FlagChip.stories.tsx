import type { Meta, StoryObj } from '@storybook/react';
import { FlagChip } from './FlagChip.js';

const meta: Meta<typeof FlagChip> = {
  title: 'Primitives/FlagChip',
  component: FlagChip,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
};
export default meta;
type Story = StoryObj<typeof FlagChip>;

export const Default: Story = {
  args: { kind: 'blurry', count: 22 },
};

export const Active: Story = {
  args: { kind: 'blurry', count: 22, active: true },
};

export const Muted: Story = {
  args: { kind: 'blurry', count: 22, mute: true },
};

export const NoCount: Story = {
  args: { kind: 'skew' },
};

export const AllKinds: Story = {
  render: () => (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, maxWidth: 600 }}>
      {(
        [
          'blurry',
          'skew',
          'dark',
          'sparse',
          'cropped',
          'asymmetric',
          'loose',
          'under',
          'over',
          'halftone',
          'mixed',
          'residual',
          'baseline',
          'overflow',
          'blank',
          'misaligned',
          'low-conf',
          'no-text',
          'garbled',
          'mixed-lang',
          'errored',
        ] as const
      ).map((kind) => (
        <FlagChip key={kind} kind={kind} count={Math.floor(Math.random() * 30) + 1} />
      ))}
    </div>
  ),
};
