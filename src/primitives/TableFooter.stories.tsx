import type { Meta, StoryObj } from '@storybook/react';
import * as React from 'react';
import { TableFooter } from './TableFooter.js';

const meta: Meta<typeof TableFooter> = {
  title: 'Primitives/TableFooter',
  component: TableFooter,
  tags: ['autodocs'],
};
export default meta;

type Story = StoryObj<typeof TableFooter>;

export const Default: Story = {
  args: {
    page: 2,
    totalPages: 5,
    onPageChange: () => {},
  },
};

export const WithTotalRows: Story = {
  args: {
    page: 2,
    totalPages: 5,
    totalRows: 128,
    onPageChange: () => {},
  },
};

export const FirstPage: Story = {
  args: {
    page: 1,
    totalPages: 5,
    onPageChange: () => {},
  },
};

export const LastPage: Story = {
  args: {
    page: 5,
    totalPages: 5,
    onPageChange: () => {},
  },
};

export const SinglePage: Story = {
  args: {
    page: 1,
    totalPages: 1,
    onPageChange: () => {},
  },
};

function ControlledDemo(): React.ReactElement {
  const [page, setPage] = React.useState(1);
  return <TableFooter page={page} totalPages={8} totalRows={237} onPageChange={setPage} />;
}

export const Controlled: Story = {
  render: () => <ControlledDemo />,
};
