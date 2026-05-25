import type { Meta, StoryObj } from '@storybook/react';
import { PanelToolbar } from './PanelToolbar.js';

const meta: Meta<typeof PanelToolbar> = {
  title: 'Stages/Validation/PanelToolbar',
  component: PanelToolbar,
  parameters: {
    layout: 'fullscreen',
  },
  args: {
    onRevalidate: () => undefined,
  },
};

export default meta;
type Story = StoryObj<typeof PanelToolbar>;

/** Validation ran less than a minute ago. */
export const RecentRun: Story = {
  args: {
    lastRun: new Date(Date.now() - 30 * 1000), // 30 seconds ago → "just now"
  },
};

/** Validation ran several hours ago. */
export const OldRun: Story = {
  args: {
    lastRun: new Date(Date.now() - 5 * 60 * 60 * 1000), // 5 hours ago
  },
};

/** No validation has ever been run. */
export const NeverRun: Story = {
  args: {
    lastRun: null,
  },
};
