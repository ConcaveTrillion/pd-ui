import type { Meta, StoryObj } from '@storybook/react';
import * as React from 'react';
import { CropToolbar } from './CropToolbar.js';
import type {
  CropDensity,
  CropFilter,
  CropFilterCounts,
  CropFlagDrillCounts,
  CropFlagKind,
} from './CropToolbar.js';

const DEFAULT_COUNTS: CropFilterCounts = {
  all: 200,
  flagged: 42,
  clean: 130,
  reviewed: 25,
  errors: 3,
};

const DEFAULT_FLAG_COUNTS: CropFlagDrillCounts = {
  overCrop: 15,
  underCrop: 10,
  deskewFail: 12,
  edgeNoise: 5,
};

const meta: Meta<typeof CropToolbar> = {
  title: 'Stages/Crop/CropToolbar',
  component: CropToolbar,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
  },
};

export default meta;
type Story = StoryObj<typeof CropToolbar>;

// ─── Default (filter=all, density=m, with rerun) ──────────────────────────────

export const Default: Story = {
  name: 'Default — filter=all, density=m',
  render: () => (
    <CropToolbar
      filter="all"
      onFilterChange={() => undefined}
      counts={DEFAULT_COUNTS}
      density="m"
      onDensityChange={() => undefined}
      onRerun={() => undefined}
      data-testid="crop-toolbar"
    />
  ),
};

// ─── FilterFlagged — flag drill hidden (no flagCounts) ────────────────────────

export const FilterFlagged: Story = {
  name: 'FilterFlagged — active=flagged, no drill panel',
  render: () => (
    <CropToolbar
      filter="flagged"
      onFilterChange={() => undefined}
      counts={DEFAULT_COUNTS}
      density="m"
      onDensityChange={() => undefined}
      onRerun={() => undefined}
      data-testid="crop-toolbar"
    />
  ),
};

// ─── FilterFlaggedWithDrill — flag drill visible, no active drill ─────────────

export const FilterFlaggedWithDrill: Story = {
  name: 'FilterFlaggedWithDrill — drill panel visible, no active drill',
  render: () => (
    <CropToolbar
      filter="flagged"
      onFilterChange={() => undefined}
      counts={DEFAULT_COUNTS}
      flagCounts={DEFAULT_FLAG_COUNTS}
      activeFlagDrill={null}
      onFlagDrillChange={() => undefined}
      density="m"
      onDensityChange={() => undefined}
      onRerun={() => undefined}
      data-testid="crop-toolbar"
    />
  ),
};

// ─── FilterFlaggedActiveDrill — drill chip active with Clear button ───────────

export const FilterFlaggedActiveDrill: Story = {
  name: 'FilterFlaggedActiveDrill — drill=overCrop active, Clear visible',
  render: () => (
    <CropToolbar
      filter="flagged"
      onFilterChange={() => undefined}
      counts={DEFAULT_COUNTS}
      flagCounts={DEFAULT_FLAG_COUNTS}
      activeFlagDrill="overCrop"
      onFlagDrillChange={() => undefined}
      density="m"
      onDensityChange={() => undefined}
      onRerun={() => undefined}
      data-testid="crop-toolbar"
    />
  ),
};

// ─── WithoutRerun — no Re-run button ─────────────────────────────────────────

export const WithoutRerun: Story = {
  name: 'WithoutRerun — no Re-run CTA',
  render: () => (
    <CropToolbar
      filter="clean"
      onFilterChange={() => undefined}
      counts={DEFAULT_COUNTS}
      density="s"
      onDensityChange={() => undefined}
      data-testid="crop-toolbar"
    />
  ),
};

// ─── Interactive ──────────────────────────────────────────────────────────────

export const Interactive: Story = {
  name: 'Interactive — controlled state',
  render: function InteractiveCropToolbar() {
    const [filter, setFilter] = React.useState<CropFilter>('all');
    const [activeFlagDrill, setActiveFlagDrill] = React.useState<CropFlagKind | null>(null);
    const [density, setDensity] = React.useState<CropDensity>('m');

    return (
      <CropToolbar
        filter={filter}
        onFilterChange={setFilter}
        counts={DEFAULT_COUNTS}
        flagCounts={DEFAULT_FLAG_COUNTS}
        activeFlagDrill={activeFlagDrill}
        onFlagDrillChange={setActiveFlagDrill}
        density={density}
        onDensityChange={setDensity}
        onRerun={() => {
          // no-op for story
        }}
        data-testid="crop-toolbar-interactive"
      />
    );
  },
};
