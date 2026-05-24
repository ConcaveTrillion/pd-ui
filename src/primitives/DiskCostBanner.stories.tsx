import type { Meta, StoryObj } from '@storybook/react';
import { DiskCostBanner } from './DiskCostBanner.js';

const meta: Meta<typeof DiskCostBanner> = {
  title: 'Primitives/DiskCostBanner',
  component: DiskCostBanner,
  parameters: { layout: 'padded' },
  tags: ['autodocs'],
};
export default meta;
type Story = StoryObj<typeof DiskCostBanner>;

export const Default: Story = {
  args: { size: '1.84 GB' },
};

export const WithPrune: Story = {
  args: { size: '1.84 GB', onPrune: () => alert('Prune clicked') },
};
