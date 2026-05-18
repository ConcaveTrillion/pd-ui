import type { Meta, StoryObj } from '@storybook/react';
import { Button } from './Button.js';
import { PageSplitView } from './PageSplitView.js';

const meta: Meta<typeof PageSplitView> = {
  title: 'Primitives/PageSplitView',
  component: PageSplitView,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <div style={{ height: '100vh' }}>
      <PageSplitView
        toolbar={
          <>
            <Button size="sm" variant="ghost">Zoom Out</Button>
            <Button size="sm" variant="ghost">Zoom In</Button>
            <Button size="sm" variant="primary">Save</Button>
          </>
        }
        canvas={
          <div style={{ color: 'var(--ink-3)', fontSize: '13px', padding: '32px' }}>
            Page image canvas area
          </div>
        }
        editor={
          <div style={{ padding: '16px', color: 'var(--ink-2)', fontSize: '12px' }}>
            Editor / word-list panel
          </div>
        }
      />
    </div>
  ),
};
