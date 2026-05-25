import type { Meta, StoryObj } from '@storybook/react';
import { Button } from './Button.js';
import { Popover, PopoverTrigger, PopoverContent } from './Popover.js';

const meta: Meta = {
  title: 'Primitives/Popover',
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost">Show popover</Button>
      </PopoverTrigger>
      <PopoverContent>
        <div style={{ padding: 'var(--space-2)' }}>
          <p style={{ margin: 0, color: 'var(--ink-1)', fontSize: 'var(--text-sm)' }}>
            This is a popover. It floats near the trigger element.
          </p>
        </div>
      </PopoverContent>
    </Popover>
  ),
};

export const WithForm: Story = {
  render: () => (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="primary" size="sm">
          Filter
        </Button>
      </PopoverTrigger>
      <PopoverContent>
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 'var(--space-2)',
            padding: 'var(--space-2)',
            minWidth: '200px',
          }}
        >
          <label
            htmlFor="popover-confidence"
            style={{ fontSize: 'var(--text-sm)', color: 'var(--ink-2)' }}
          >
            Min confidence
          </label>
          <input id="popover-confidence" type="range" min="0" max="100" defaultValue="70" />
          <Button variant="primary" size="sm">
            Apply
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  ),
};
