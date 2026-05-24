import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { ConfigureTabs } from './ConfigureTabs.js';

const meta: Meta<typeof ConfigureTabs> = {
  title: 'Primitives/ConfigureTabs',
  component: ConfigureTabs,
  parameters: { layout: 'padded' },
  tags: ['autodocs'],
};
export default meta;
type Story = StoryObj<typeof ConfigureTabs>;

const tabs = [
  { id: 'general', label: 'General' },
  { id: 'advanced', label: 'Advanced' },
  { id: 'flags', label: 'Flags', count: 3 },
];

export const Default: Story = {
  args: { tabs, value: 'general', onValueChange: () => {} },
};

function ControlledDemo() {
  const [value, setValue] = React.useState('general');
  return <ConfigureTabs tabs={tabs} value={value} onValueChange={setValue} />;
}

export const WithCount: Story = {
  render: () => <ControlledDemo />,
};
