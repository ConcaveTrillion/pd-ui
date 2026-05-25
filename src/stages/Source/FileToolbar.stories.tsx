import type { Meta, StoryObj } from '@storybook/react';
import * as React from 'react';
import { FileToolbar } from './FileToolbar.js';
import type { SourceDensity, SourceFilter, SourceFilterCounts } from './FileToolbar.js';

const DEFAULT_COUNTS: SourceFilterCounts = {
  all: 120,
  marked: 80,
  skipped: 15,
  unmarked: 22,
  inserts: 3,
};

const meta: Meta<typeof FileToolbar> = {
  title: 'Stages/Source/FileToolbar',
  component: FileToolbar,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
  },
};

export default meta;
type Story = StoryObj<typeof FileToolbar>;

// ─── Default (filter=all, density=m) ─────────────────────────────────────────

export const Default: Story = {
  name: 'Default — filter=all, density=m',
  render: () => (
    <FileToolbar
      filter="all"
      onFilterChange={() => undefined}
      counts={DEFAULT_COUNTS}
      density="m"
      onDensityChange={() => undefined}
      onInsert={() => undefined}
      data-testid="file-toolbar"
    />
  ),
};

// ─── FilterMarked ─────────────────────────────────────────────────────────────

export const FilterMarked: Story = {
  name: 'FilterMarked — active chip=marked',
  render: () => (
    <FileToolbar
      filter="marked"
      onFilterChange={() => undefined}
      counts={DEFAULT_COUNTS}
      density="m"
      onDensityChange={() => undefined}
      onInsert={() => undefined}
    />
  ),
};

// ─── FilterInserts ────────────────────────────────────────────────────────────

export const FilterInserts: Story = {
  name: 'FilterInserts — active chip=inserts',
  render: () => (
    <FileToolbar
      filter="inserts"
      onFilterChange={() => undefined}
      counts={DEFAULT_COUNTS}
      density="m"
      onDensityChange={() => undefined}
      onInsert={() => undefined}
    />
  ),
};

// ─── DensityLarge ─────────────────────────────────────────────────────────────

export const DensityLarge: Story = {
  name: 'DensityLarge — density=l',
  render: () => (
    <FileToolbar
      filter="all"
      onFilterChange={() => undefined}
      counts={DEFAULT_COUNTS}
      density="l"
      onDensityChange={() => undefined}
      onInsert={() => undefined}
    />
  ),
};

// ─── WithoutInsert ────────────────────────────────────────────────────────────

export const WithoutInsert: Story = {
  name: 'WithoutInsert — no Insert CTA',
  render: () => (
    <FileToolbar
      filter="all"
      onFilterChange={() => undefined}
      counts={DEFAULT_COUNTS}
      density="m"
      onDensityChange={() => undefined}
    />
  ),
};

// ─── Interactive ──────────────────────────────────────────────────────────────

export const Interactive: Story = {
  name: 'Interactive — state-bound',
  render: function InteractiveStory() {
    const [filter, setFilter] = React.useState<SourceFilter>('all');
    const [density, setDensity] = React.useState<SourceDensity>('m');

    return (
      <FileToolbar
        filter={filter}
        onFilterChange={setFilter}
        counts={DEFAULT_COUNTS}
        density={density}
        onDensityChange={setDensity}
        onInsert={() => {
          window.alert('Insert page triggered');
        }}
        data-testid="file-toolbar-interactive"
      />
    );
  },
};
