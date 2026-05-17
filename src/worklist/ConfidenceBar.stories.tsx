import type { Meta, StoryObj } from '@storybook/react';
import { ConfidenceBar } from './ConfidenceBar.js';

const meta: Meta<typeof ConfidenceBar> = {
  title: 'WordList/ConfidenceBar',
  component: ConfidenceBar,
  tags: ['autodocs'],
  argTypes: {
    confidence: {
      control: { type: 'range', min: 0, max: 1, step: 0.01 },
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const High: Story = {
  args: { confidence: 0.97 },
};

export const Medium: Story = {
  args: { confidence: 0.65 },
};

export const Low: Story = {
  args: { confidence: 0.28 },
};

export const Null: Story = {
  args: { confidence: null },
};

export const AllValues: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', width: '200px' }}>
      {[1.0, 0.95, 0.8, 0.65, 0.5, 0.35, 0.1, 0.0].map((v) => (
        <div key={v} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ width: '30px', fontSize: '11px', color: 'var(--ink-3)', textAlign: 'right' }}>
            {(v * 100).toFixed(0)}%
          </span>
          <ConfidenceBar confidence={v} style={{ flex: 1 }} />
        </div>
      ))}
    </div>
  ),
};
