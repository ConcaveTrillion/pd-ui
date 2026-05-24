import type { Meta, StoryObj } from '@storybook/react';
import { RunAllDirtyPanel } from './RunAllDirtyPanel.js';

const meta: Meta<typeof RunAllDirtyPanel> = {
  title: 'Primitives/RunAllDirtyPanel',
  component: RunAllDirtyPanel,
  parameters: { layout: 'padded' },
  tags: ['autodocs'],
};
export default meta;
type Story = StoryObj<typeof RunAllDirtyPanel>;

export const Default: Story = {
  args: { dirtyCount: 12, onRunAll: () => {} },
};

export const Running: Story = {
  args: { dirtyCount: 12, running: true, onRunAll: () => {} },
};

export const NoDirty: Story = {
  args: { dirtyCount: 0, onRunAll: () => {} },
};
