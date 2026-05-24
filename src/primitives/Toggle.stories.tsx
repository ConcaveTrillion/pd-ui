import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { Toggle } from './Toggle.js';

const meta: Meta<typeof Toggle> = {
  title: 'Primitives/Toggle',
  component: Toggle,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
};
export default meta;
type Story = StoryObj<typeof Toggle>;

function DefaultToggle() {
  const [on, setOn] = useState(false);
  return <Toggle checked={on} onCheckedChange={setOn} />;
}

export const Default: Story = {
  render: () => <DefaultToggle />,
};

function WithLabelToggle() {
  const [on, setOn] = useState(false);
  return <Toggle checked={on} onCheckedChange={setOn} label="Enable feature" />;
}

export const WithLabel: Story = {
  render: () => <WithLabelToggle />,
};

function CheckedInitialToggle() {
  const [on, setOn] = useState(true);
  return <Toggle checked={on} onCheckedChange={setOn} label="Auto-run pipeline" />;
}

export const CheckedInitial: Story = {
  render: () => <CheckedInitialToggle />,
};

export const Disabled: Story = {
  args: {
    checked: false,
    onCheckedChange: () => {},
    disabled: true,
    label: 'Disabled toggle',
  },
};
