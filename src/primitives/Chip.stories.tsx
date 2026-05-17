import type { Meta, StoryObj } from '@storybook/react';
import { Chip } from './Chip.js';

const meta: Meta<typeof Chip> = {
  title: 'Primitives/Chip',
  component: Chip,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['static', 'dashed'],
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Static: Story = {
  args: { variant: 'static', children: 'Static Chip' },
};

export const Dashed: Story = {
  args: { variant: 'dashed', children: 'Dashed Chip' },
};

export const AllVariants: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '8px' }}>
      <Chip variant="static">Static</Chip>
      <Chip variant="dashed">Dashed</Chip>
    </div>
  ),
};
