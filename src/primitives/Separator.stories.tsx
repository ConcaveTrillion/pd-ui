import type { Meta, StoryObj } from '@storybook/react';
import { Separator } from './Separator.js';

const meta: Meta<typeof Separator> = {
  title: 'Primitives/Separator',
  component: Separator,
  tags: ['autodocs'],
  argTypes: {
    orientation: {
      control: 'select',
      options: ['horizontal', 'vertical'],
    },
    decorative: { control: 'boolean' },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Horizontal: Story = {
  render: () => (
    <div style={{ width: '300px' }}>
      <p style={{ color: 'var(--ink-1)', margin: '0 0 8px' }}>Section A</p>
      <Separator orientation="horizontal" />
      <p style={{ color: 'var(--ink-1)', margin: '8px 0 0' }}>Section B</p>
    </div>
  ),
};

export const Vertical: Story = {
  render: () => (
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', height: '40px' }}>
      <span style={{ color: 'var(--ink-1)' }}>Left</span>
      <Separator orientation="vertical" style={{ height: '100%' }} />
      <span style={{ color: 'var(--ink-1)' }}>Right</span>
    </div>
  ),
};
