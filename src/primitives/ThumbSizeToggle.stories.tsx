import type { Meta, StoryObj } from '@storybook/react';
import * as React from 'react';
import { ThumbSizeToggle, THUMB_SIZES } from './ThumbSizeToggle.js';

const meta: Meta<typeof ThumbSizeToggle> = {
  title: 'Primitives/ThumbSizeToggle',
  component: ThumbSizeToggle,
  tags: ['autodocs'],
};
export default meta;

type Story = StoryObj<typeof ThumbSizeToggle>;

export const Default: Story = {
  args: {
    value: 'md',
    onValueChange: () => {},
  },
};

export const SmallSelected: Story = {
  args: {
    value: 'sm',
    onValueChange: () => {},
  },
};

export const LargeSelected: Story = {
  args: {
    value: 'lg',
    onValueChange: () => {},
  },
};

function ControlledDemo(): React.ReactElement {
  const [size, setSize] = React.useState('md');
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <ThumbSizeToggle value={size} onValueChange={setSize} />
      <div style={{ color: 'var(--ink-2)', fontSize: 12 }}>
        Selected: {size} ({THUMB_SIZES.find((s) => s.id === size)?.px}px)
      </div>
    </div>
  );
}

export const Controlled: Story = {
  render: () => <ControlledDemo />,
};
