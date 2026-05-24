import type { Meta, StoryObj } from '@storybook/react';
import { CheckIcon } from './CheckIcon.js';

const meta: Meta<typeof CheckIcon> = {
  title: 'Primitives/CheckIcon',
  component: CheckIcon,
  tags: ['autodocs'],
  argTypes: {
    state: {
      control: 'select',
      options: ['pass', 'warn', 'error', 'running', 'skip'],
      description: 'Validation state to visualise.',
    },
    size: {
      control: { type: 'range', min: 12, max: 32, step: 2 },
      description: 'Icon size in pixels.',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Pass: Story = {
  args: { state: 'pass' },
};

export const Warn: Story = {
  args: { state: 'warn' },
};

export const Error: Story = {
  args: { state: 'error' },
};

export const Running: Story = {
  args: { state: 'running' },
};

export const Skip: Story = {
  args: { state: 'skip' },
};

export const AllStates: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
      <CheckIcon state="pass" />
      <CheckIcon state="warn" />
      <CheckIcon state="error" />
      <CheckIcon state="running" />
      <CheckIcon state="skip" />
    </div>
  ),
};

export const Sizes: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
      <CheckIcon state="pass" size={12} />
      <CheckIcon state="pass" size={16} />
      <CheckIcon state="pass" size={20} />
      <CheckIcon state="pass" size={24} />
    </div>
  ),
};
