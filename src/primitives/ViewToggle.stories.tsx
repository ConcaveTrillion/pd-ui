import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { ViewToggle } from './ViewToggle.js';

const meta: Meta<typeof ViewToggle> = {
  title: 'Primitives/ViewToggle',
  component: ViewToggle,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
};
export default meta;
type Story = StoryObj<typeof ViewToggle>;

function ListModeViewToggle() {
  const [mode, setMode] = useState<'list' | 'thumb'>('list');
  return <ViewToggle mode={mode} onChange={setMode} />;
}

export const ListMode: Story = {
  render: () => <ListModeViewToggle />,
};

function ThumbModeViewToggle() {
  const [mode, setMode] = useState<'list' | 'thumb'>('thumb');
  return <ViewToggle mode={mode} onChange={setMode} />;
}

export const ThumbMode: Story = {
  render: () => <ThumbModeViewToggle />,
};
