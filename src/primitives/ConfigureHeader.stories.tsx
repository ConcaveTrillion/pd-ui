import type { Meta, StoryObj } from '@storybook/react';
import { ConfigureHeader } from './ConfigureHeader.js';

const meta: Meta<typeof ConfigureHeader> = {
  title: 'Primitives/ConfigureHeader',
  component: ConfigureHeader,
  parameters: { layout: 'padded' },
  tags: ['autodocs'],
};
export default meta;
type Story = StoryObj<typeof ConfigureHeader>;

export const Default: Story = {
  args: { title: 'Configure Stage' },
};

export const WithTrail: Story = {
  args: {
    title: 'Configure Threshold',
    trail: [{ label: 'Projects' }, { label: 'my-project', mono: true }],
  },
};

export const WithClose: Story = {
  args: {
    title: 'Configure Threshold',
    trail: [{ label: 'Projects' }, { label: 'my-project', mono: true }],
    onClose: () => alert('close'),
  },
};
