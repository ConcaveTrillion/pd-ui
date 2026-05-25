import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { EditModeSelector } from './EditModeSelector.js';
import type { EditMode } from './EditModeSelector.js';

const meta: Meta<typeof EditModeSelector> = {
  title: 'Stages/PageWorkbench/EditModeSelector',
  component: EditModeSelector,
  tags: ['autodocs'],
  argTypes: {
    mode: {
      control: 'radio',
      options: ['view', 'split', 'illust', 'rotate'] satisfies EditMode[],
    },
  },
  args: {
    mode: 'view',
    onModeChange: () => undefined,
  },
};

export default meta;

type Story = StoryObj<typeof EditModeSelector>;

/** View mode selected (default). */
export const ViewMode: Story = {
  args: { mode: 'view' },
};

/** Split mode selected. */
export const SplitMode: Story = {
  args: { mode: 'split' },
};

/** Illustration mode selected. */
export const IllustMode: Story = {
  args: { mode: 'illust' },
};

/** Rotate mode selected. */
export const RotateMode: Story = {
  args: { mode: 'rotate' },
};

/** Interactive — state-bound. Click any segment to change the selection. */
function InteractiveRender() {
  const [mode, setMode] = React.useState<EditMode>('view');
  return <EditModeSelector mode={mode} onModeChange={setMode} data-testid="edit-mode-selector" />;
}

export const Interactive: Story = {
  render: () => <InteractiveRender />,
};
