import type { Meta, StoryObj } from '@storybook/react';
import { SummaryCell } from './SummaryCell.js';

const meta: Meta<typeof SummaryCell> = {
  title: 'Primitives/SummaryCell',
  component: SummaryCell,
  tags: ['autodocs'],
};
export default meta;

type Story = StoryObj<typeof SummaryCell>;

export const Default: Story = {
  args: {
    label: 'Pages',
    value: '128',
  },
};

export const WithSub: Story = {
  args: {
    label: 'Words',
    value: '14k',
    sub: 'of 15k expected',
  },
};

export const Clean: Story = {
  args: {
    label: 'Exact',
    value: '112',
    tone: 'clean',
  },
};

export const Dirty: Story = {
  args: {
    label: 'Errors',
    value: '3',
    tone: 'dirty',
  },
};

export const Warn: Story = {
  args: {
    label: 'Review',
    value: '8',
    tone: 'warn',
  },
};

export const AllTones: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
      <SummaryCell label="Neutral" value="128" />
      <SummaryCell label="Clean" value="112" tone="clean" sub="exact match" />
      <SummaryCell label="Dirty" value="3" tone="dirty" sub="errors" />
      <SummaryCell label="Warn" value="8" tone="warn" sub="review needed" />
    </div>
  ),
};
