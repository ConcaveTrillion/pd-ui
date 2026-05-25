import type { Meta, StoryObj } from '@storybook/react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from './Tabs.js';

const meta: Meta = {
  title: 'Primitives/Tabs',
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Tabs defaultValue="words" style={{ width: '400px' }}>
      <TabsList>
        <TabsTrigger value="words">Words</TabsTrigger>
        <TabsTrigger value="lines">Lines</TabsTrigger>
        <TabsTrigger value="pages">Pages</TabsTrigger>
      </TabsList>
      <TabsContent value="words">
        <div
          style={{ padding: 'var(--space-3)', color: 'var(--ink-2)', fontSize: 'var(--text-sm)' }}
        >
          Word-level review content goes here.
        </div>
      </TabsContent>
      <TabsContent value="lines">
        <div
          style={{ padding: 'var(--space-3)', color: 'var(--ink-2)', fontSize: 'var(--text-sm)' }}
        >
          Line-level review content goes here.
        </div>
      </TabsContent>
      <TabsContent value="pages">
        <div
          style={{ padding: 'var(--space-3)', color: 'var(--ink-2)', fontSize: 'var(--text-sm)' }}
        >
          Page navigation content goes here.
        </div>
      </TabsContent>
    </Tabs>
  ),
};
