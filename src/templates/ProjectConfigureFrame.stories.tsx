import type { Meta, StoryObj } from '@storybook/react';
import { ProjectConfigureFrame } from './ProjectConfigureFrame.js';

const meta: Meta<typeof ProjectConfigureFrame> = {
  title: 'Templates/ProjectConfigureFrame',
  component: ProjectConfigureFrame,
  parameters: { layout: 'padded' },
  tags: ['autodocs'],
};
export default meta;
type Story = StoryObj<typeof ProjectConfigureFrame>;

export const Default: Story = {
  args: {
    diskSize: '1.84 GB',
    dirtyCount: 12,
    onRunAll: () => {},
    onBuild: () => {},
  },
};

export const WithBuildStatus: Story = {
  args: {
    diskSize: '1.84 GB',
    dirtyCount: 0,
    onRunAll: () => {},
    onBuild: () => {},
    buildStatus: 'clean',
    buildStatusLabel: 'Ready',
    onPrune: () => {},
  },
};

export const Running: Story = {
  args: {
    diskSize: '1.84 GB',
    dirtyCount: 8,
    onRunAll: () => {},
    onBuild: () => {},
    running: true,
  },
};
