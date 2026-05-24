import type { Meta, StoryObj } from '@storybook/react';
import { StatTile } from './StatTile.js';

const meta: Meta<typeof StatTile> = {
  title: 'Primitives/StatTile',
  component: StatTile,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
};
export default meta;
type Story = StoryObj<typeof StatTile>;

export const Default: Story = {
  args: { label: 'Files', value: '387' },
};

export const WithSub: Story = {
  args: { label: 'Size', value: '2.1 GB', sub: 'raw / 210 MB zipped' },
};

export const Clean: Story = {
  args: { label: 'Files', value: '387', sub: 'ready', tone: 'clean' },
};

export const Dirty: Story = {
  args: { label: 'Skipped', value: '3', sub: '.txt · .xml', tone: 'dirty' },
};

export const Grid: Story = {
  render: () => (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 200px)', gap: 12 }}>
      <StatTile label="Files" value="387" sub="ready" tone="clean" />
      <StatTile label="Size" value="2.1 GB" sub="raw / 210 MB zipped" />
      <StatTile label="JP2" value="380" sub="primary" />
      <StatTile label="Skipped" value="3" sub=".txt · .xml" tone="dirty" />
    </div>
  ),
};
