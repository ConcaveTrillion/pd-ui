import type { Meta, StoryObj } from '@storybook/react';
import { JobStatusPip } from './JobStatusPip.js';

const meta: Meta<typeof JobStatusPip> = {
  title: 'Primitives/JobStatusPip',
  component: JobStatusPip,
  tags: ['autodocs'],
  argTypes: {
    state: {
      control: 'select',
      options: ['queued', 'running', 'succeeded', 'failed', 'cancelled'],
    },
    label: { control: 'text' },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Succeeded: Story = {
  args: { state: 'succeeded' },
};

export const Running: Story = {
  args: { state: 'running' },
};

export const Queued: Story = {
  args: { state: 'queued' },
};

export const Failed: Story = {
  args: { state: 'failed' },
};

export const Cancelled: Story = {
  args: { state: 'cancelled' },
};

export const AllStates: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
      <JobStatusPip state="queued" />
      <JobStatusPip state="running" />
      <JobStatusPip state="succeeded" />
      <JobStatusPip state="failed" />
      <JobStatusPip state="cancelled" />
    </div>
  ),
};

export const CustomLabels: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
      <JobStatusPip state="queued" label="Pending" />
      <JobStatusPip state="running" label="In Progress" />
      <JobStatusPip state="succeeded" label="Complete" />
      <JobStatusPip state="failed" label="Failed" />
      <JobStatusPip state="cancelled" label="Cancelled" />
    </div>
  ),
};
