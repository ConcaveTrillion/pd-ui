import type { Meta, StoryObj } from '@storybook/react';
import { MatchStatusChip } from './MatchStatusChip.js';

const meta: Meta<typeof MatchStatusChip> = {
  title: 'WordList/MatchStatusChip',
  component: MatchStatusChip,
  tags: ['autodocs'],
  argTypes: {
    status: {
      control: 'select',
      options: ['exact', 'fuzzy', 'mismatch', 'none'],
    },
    label: { control: 'text' },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Exact: Story = {
  args: { status: 'exact', label: 'Exact' },
};

export const Fuzzy: Story = {
  args: { status: 'fuzzy', label: 'Fuzzy' },
};

export const Mismatch: Story = {
  args: { status: 'mismatch', label: 'Mismatch' },
};

export const None: Story = {
  args: { status: 'none', label: 'None' },
};

export const AllStatuses: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
      <MatchStatusChip status="exact" label="Exact" />
      <MatchStatusChip status="fuzzy" label="Fuzzy" />
      <MatchStatusChip status="mismatch" label="Mismatch" />
      <MatchStatusChip status="none" label="None" />
    </div>
  ),
};

export const WithoutLabel: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '8px' }}>
      <MatchStatusChip status="exact" />
      <MatchStatusChip status="fuzzy" />
      <MatchStatusChip status="mismatch" />
      <MatchStatusChip status="none" />
    </div>
  ),
};
