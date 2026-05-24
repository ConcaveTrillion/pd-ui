import type { Meta, StoryObj } from '@storybook/react';
import { BuildPackagePanel } from './BuildPackagePanel.js';

const meta: Meta<typeof BuildPackagePanel> = {
  title: 'Primitives/BuildPackagePanel',
  component: BuildPackagePanel,
  parameters: { layout: 'padded' },
  tags: ['autodocs'],
};
export default meta;
type Story = StoryObj<typeof BuildPackagePanel>;

export const Default: Story = {
  args: { onBuild: () => {} },
};

export const WithStatus: Story = {
  args: { onBuild: () => {}, status: 'clean', statusLabel: 'Ready' },
};

export const Building: Story = {
  args: { onBuild: () => {}, building: true },
};

export const Failed: Story = {
  args: { onBuild: () => {}, status: 'failed', statusLabel: 'Build failed' },
};
