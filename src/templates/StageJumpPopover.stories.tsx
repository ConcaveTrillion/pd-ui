import type { Meta, StoryObj } from '@storybook/react';
import { StageJumpPopover } from './StageJumpPopover.js';
import { PIPELINE_STAGES } from './StageStrip.js';

const meta: Meta<typeof StageJumpPopover> = {
  title: 'Templates/StageJumpPopover',
  component: StageJumpPopover,
  parameters: { layout: 'padded' },
  tags: ['autodocs'],
};
export default meta;
type Story = StoryObj<typeof StageJumpPopover>;

export const Default: Story = {
  args: {
    stages: [...PIPELINE_STAGES],
    currentStage: 'threshold',
    onJump: (id) => alert(`Jump to: ${id}`),
  },
};

export const OpenByDefault: Story = {
  args: {
    stages: [...PIPELINE_STAGES],
    currentStage: 'ocr',
    onJump: (id) => alert(`Jump to: ${id}`),
    defaultOpen: true,
  },
};
