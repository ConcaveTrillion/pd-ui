import type { Meta, StoryObj } from '@storybook/react';
import { KeyCap } from './KeyCap.js';

const meta: Meta<typeof KeyCap> = {
  title: 'Primitives/KeyCap',
  component: KeyCap,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const SingleKey: Story = {
  args: { keys: 'Enter' },
};

export const ShortcutCombo: Story = {
  args: { keys: ['Ctrl', 'Z'] },
};

export const ThreeKey: Story = {
  args: { keys: ['Ctrl', 'Shift', 'Z'] },
};

export const CommonShortcuts: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <KeyCap keys="Enter" />
        <span style={{ color: 'var(--ink-2)', fontSize: 'var(--text-sm)' }}>Confirm</span>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <KeyCap keys={['Ctrl', 'Z']} />
        <span style={{ color: 'var(--ink-2)', fontSize: 'var(--text-sm)' }}>Undo</span>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <KeyCap keys={['Ctrl', 'Shift', 'Z']} />
        <span style={{ color: 'var(--ink-2)', fontSize: 'var(--text-sm)' }}>Redo</span>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <KeyCap keys="Escape" />
        <span style={{ color: 'var(--ink-2)', fontSize: 'var(--text-sm)' }}>Cancel</span>
      </div>
    </div>
  ),
};
