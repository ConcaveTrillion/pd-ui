import type { Meta, StoryObj } from '@storybook/react';
import { JobStatusPip } from './JobStatusPip.js';

const meta: Meta<typeof JobStatusPip> = {
  title: 'Primitives/JobStatusPip',
  component: JobStatusPip,
  tags: ['autodocs'],
  argTypes: {
    state: {
      control: 'select',
      options: ['queued', 'running', 'done', 'error'],
    },
    label: { control: 'text' },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Done: Story = {
  args: { state: 'done' },
};

export const Running: Story = {
  args: { state: 'running' },
};

export const Queued: Story = {
  args: { state: 'queued' },
};

export const Error: Story = {
  args: { state: 'error' },
};

export const AllStates: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
      <JobStatusPip state="queued" />
      <JobStatusPip state="running" />
      <JobStatusPip state="done" />
      <JobStatusPip state="error" />
    </div>
  ),
};

export const CustomLabels: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
      <JobStatusPip state="queued" label="Pending" />
      <JobStatusPip state="running" label="In Progress" />
      <JobStatusPip state="done" label="Complete" />
      <JobStatusPip state="error" label="Failed" />
    </div>
  ),
};
