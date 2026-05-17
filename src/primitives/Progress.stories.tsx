import type { Meta, StoryObj } from '@storybook/react';
import { Progress } from './Progress.js';

const meta: Meta<typeof Progress> = {
  title: 'Primitives/Progress',
  component: Progress,
  tags: ['autodocs'],
  argTypes: {
    value: { control: { type: 'range', min: 0, max: 100, step: 1 } },
    status: {
      control: 'select',
      options: [undefined, 'running', 'done', 'errored', 'review'],
    },
    label: { control: 'text' },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Running: Story = {
  args: { value: 60, status: 'running', label: '60%' },
};

export const Done: Story = {
  args: { value: 100, status: 'done', label: 'Complete' },
};

export const Errored: Story = {
  args: { value: 45, status: 'errored', label: 'Error' },
};

export const Review: Story = {
  args: { value: 75, status: 'review', label: '75%' },
};

export const AllStatuses: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', width: '300px' }}>
      <Progress value={60} status="running" label="Running 60%" />
      <Progress value={100} status="done" label="Done" />
      <Progress value={45} status="errored" label="Errored at 45%" />
      <Progress value={75} status="review" label="Review 75%" />
      <Progress value={30} label="No status" />
    </div>
  ),
};
