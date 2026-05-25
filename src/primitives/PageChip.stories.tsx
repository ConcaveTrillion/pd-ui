import type { Meta, StoryObj } from '@storybook/react';
import * as React from 'react';
import { PageChip } from './PageChip.js';

const meta = {
  title: 'Primitives/PageChip',
  component: PageChip,
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    prefix: { control: 'text' },
    selected: { control: 'boolean' },
    onClick: { action: 'clicked' },
  },
} satisfies Meta<typeof PageChip>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    prefix: 'p019',
    onClick: () => undefined,
  },
};

export const Selected: Story = {
  args: {
    prefix: 'p019',
    selected: true,
    onClick: () => undefined,
  },
};

export const NonClickable: Story = {
  name: 'NonClickable (span)',
  args: {
    prefix: 'p019',
  },
};

export const WithLongPrefix: Story = {
  args: {
    prefix: 'p1024-verso',
    onClick: () => undefined,
  },
};

export const GroupExample: Story = {
  args: { prefix: 'p001' },
  render: () => (
    <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', maxWidth: 320 }}>
      {['p001', 'p002', 'p003', 'p019', 'p020', 'p021'].map((p, i) => (
        <PageChip key={p} prefix={p} selected={i === 3} onClick={() => undefined} />
      ))}
    </div>
  ),
};
