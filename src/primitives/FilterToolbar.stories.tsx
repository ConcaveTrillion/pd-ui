import type { Meta, StoryObj } from '@storybook/react';
import * as React from 'react';
import { FilterToolbar } from './FilterToolbar.js';

const meta: Meta<typeof FilterToolbar> = {
  title: 'Primitives/FilterToolbar',
  component: FilterToolbar,
  tags: ['autodocs'],
};
export default meta;

type Story = StoryObj<typeof FilterToolbar>;

export const Empty: Story = {
  args: {
    value: '',
    onValueChange: () => {},
    placeholder: 'Filter flags…',
  },
};

export const WithValue: Story = {
  args: {
    value: 'blurry',
    onValueChange: () => {},
  },
};

function ControlledDemo(): React.ReactElement {
  const [filter, setFilter] = React.useState('');
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', width: 280 }}>
      <FilterToolbar value={filter} onValueChange={setFilter} placeholder="Search flags…" />
      <div style={{ color: 'var(--ink-2)', fontSize: 12 }}>Filter: {filter || '(empty)'}</div>
    </div>
  );
}

export const Controlled: Story = {
  render: () => <ControlledDemo />,
};
