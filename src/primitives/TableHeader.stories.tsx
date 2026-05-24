import type { Meta, StoryObj } from '@storybook/react';
import * as React from 'react';
import { TableHeader } from './TableHeader.js';
import type { SortDir } from './TableHeader.js';

const meta: Meta<typeof TableHeader> = {
  title: 'Primitives/TableHeader',
  component: TableHeader,
  tags: ['autodocs'],
};
export default meta;

type Story = StoryObj<typeof TableHeader>;

const columns = [
  { id: 'page', label: 'Page', sortable: true, width: '60px' },
  { id: 'type', label: 'Type', sortable: false, width: '80px' },
  { id: 'flags', label: 'Flags', sortable: true },
  { id: 'status', label: 'Status', sortable: true, width: '100px' },
];

export const Default: Story = {
  args: {
    columns,
  },
};

export const SortedAsc: Story = {
  args: {
    columns,
    sortKey: 'page',
    sortDir: 'asc',
  },
};

export const SortedDesc: Story = {
  args: {
    columns,
    sortKey: 'flags',
    sortDir: 'desc',
  },
};

function ControlledDemo(): React.ReactElement {
  const [sortKey, setSortKey] = React.useState('page');
  const [sortDir, setSortDir] = React.useState<SortDir>('asc');

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
      <TableHeader
        columns={columns}
        sortKey={sortKey}
        sortDir={sortDir}
        onSort={(id, dir) => {
          setSortKey(id);
          setSortDir(dir);
        }}
      />
      <div style={{ color: 'var(--ink-2)', fontSize: 12 }}>
        Sort: {sortKey} {sortDir}
      </div>
    </div>
  );
}

export const Controlled: Story = {
  render: () => <ControlledDemo />,
};
