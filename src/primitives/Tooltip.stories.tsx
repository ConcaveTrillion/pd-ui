import type { Meta, StoryObj } from '@storybook/react';
import { Button } from './Button.js';
import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from './Tooltip.js';

const meta: Meta = {
  title: 'Primitives/Tooltip',
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="ghost" size="sm">
            Hover me
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>This is a tooltip</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  ),
};

export const IconTooltip: Story = {
  render: () => (
    <TooltipProvider>
      <div style={{ display: 'flex', gap: '8px' }}>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="ghost" size="sm" title="">
              Ctrl+Z
            </Button>
          </TooltipTrigger>
          <TooltipContent>Undo (Ctrl+Z)</TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="ghost" size="sm" title="">
              Ctrl+Y
            </Button>
          </TooltipTrigger>
          <TooltipContent>Redo (Ctrl+Y)</TooltipContent>
        </Tooltip>
      </div>
    </TooltipProvider>
  ),
};
