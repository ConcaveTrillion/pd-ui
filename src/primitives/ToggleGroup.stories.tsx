import type { Meta, StoryObj } from '@storybook/react';
import { ToggleGroup, ToggleGroupItem } from './ToggleGroup.js';

const meta: Meta = {
  title: 'Primitives/ToggleGroup',
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const SingleSelect: Story = {
  render: () => (
    <ToggleGroup type="single" defaultValue="words">
      <ToggleGroupItem value="words">Words</ToggleGroupItem>
      <ToggleGroupItem value="lines">Lines</ToggleGroupItem>
      <ToggleGroupItem value="blocks">Blocks</ToggleGroupItem>
    </ToggleGroup>
  ),
};

export const MultiSelect: Story = {
  render: () => (
    <ToggleGroup type="multiple" defaultValue={['exact', 'fuzzy']}>
      <ToggleGroupItem value="exact">Exact</ToggleGroupItem>
      <ToggleGroupItem value="fuzzy">Fuzzy</ToggleGroupItem>
      <ToggleGroupItem value="mismatch">Mismatch</ToggleGroupItem>
      <ToggleGroupItem value="none">None</ToggleGroupItem>
    </ToggleGroup>
  ),
};
