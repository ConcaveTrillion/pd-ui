import type { Meta, StoryObj } from '@storybook/react';
import { Card } from './Card.js';

const meta: Meta<typeof Card> = {
  title: 'Primitives/Card',
  component: Card,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: (
      <div style={{ padding: 'var(--space-3)' }}>
        <h3 style={{ margin: 0, color: 'var(--ink-1)' }}>Card Title</h3>
        <p
          style={{ marginTop: 'var(--space-2)', color: 'var(--ink-2)', fontSize: 'var(--text-sm)' }}
        >
          Card content goes here.
        </p>
      </div>
    ),
  },
};

export const WithMultipleChildren: Story = {
  render: () => (
    <Card style={{ maxWidth: '320px' }}>
      <div style={{ padding: 'var(--space-3)', borderBottom: '1px solid var(--border)' }}>
        <h3 style={{ margin: 0, color: 'var(--ink-1)' }}>Card Header</h3>
      </div>
      <div style={{ padding: 'var(--space-3)' }}>
        <p style={{ margin: 0, color: 'var(--ink-2)', fontSize: 'var(--text-sm)' }}>
          This is the card body with some content.
        </p>
      </div>
    </Card>
  ),
};
