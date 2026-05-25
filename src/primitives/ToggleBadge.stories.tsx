import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { ToggleBadge } from './ToggleBadge.js';

const meta: Meta<typeof ToggleBadge> = {
  title: 'Primitives/ToggleBadge',
  component: ToggleBadge,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
};
export default meta;
type Story = StoryObj<typeof ToggleBadge>;

function ControlledToggleBadge({
  label,
  initialChecked = false,
  disabled,
}: {
  label: string;
  initialChecked?: boolean;
  disabled?: boolean;
}) {
  const [on, setOn] = useState(initialChecked);
  return (
    <ToggleBadge
      checked={on}
      onCheckedChange={setOn}
      label={label}
      {...(disabled !== undefined ? { disabled } : {})}
    />
  );
}

export const Off: Story = {
  render: () => <ControlledToggleBadge label="Auto-apply" />,
};

export const On: Story = {
  render: () => <ControlledToggleBadge label="Auto-apply" initialChecked />,
};

export const Disabled: Story = {
  render: () => <ControlledToggleBadge label="Auto-apply" disabled />,
};

export const WithLongLabel: Story = {
  render: () => <ControlledToggleBadge label="Apply hyphen-join rule automatically on page save" />,
};
