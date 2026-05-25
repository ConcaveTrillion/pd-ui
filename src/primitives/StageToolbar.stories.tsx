import type { Meta, StoryObj } from '@storybook/react';
import * as React from 'react';
import { StageToolbar } from './StageToolbar.js';
import { Button } from './Button.js';
import { Chip } from './Chip.js';
import { Segmented } from './Segmented.js';

const meta: Meta<typeof StageToolbar> = {
  title: 'Primitives/StageToolbar',
  component: StageToolbar,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'Three-slot horizontal toolbar shell used at the top of stage pages. ' +
          'Replaces stage-specific toolbar chrome with a generic slot-based surface. ' +
          'Sticky positioning is CSS-only via `data-sticky`. ' +
          'Distinct from FilterToolbar, which is a single-line search input primitive.',
      },
    },
  },
  argTypes: {
    sticky: { control: 'boolean' },
    'aria-label': { control: 'text' },
  },
};

export default meta;
type Story = StoryObj<typeof StageToolbar>;

// ─── Empty toolbar (all slots omitted) ───────────────────────────────────────

export const Empty: Story = {
  name: 'Empty — no slots',
  args: {},
};

// ─── Left slot only ───────────────────────────────────────────────────────────

export const LeftOnly: Story = {
  name: 'Left slot only',
  render: () => (
    <StageToolbar
      leftSlot={
        <div style={{ display: 'flex', gap: 8 }}>
          <Chip variant="static">All</Chip>
          <Chip variant="static">Flagged</Chip>
        </div>
      }
    />
  ),
};

// ─── Center slot only ─────────────────────────────────────────────────────────

export const CenterOnly: Story = {
  name: 'Center slot only',
  render: () => (
    <StageToolbar
      centerSlot={
        <Segmented
          options={[
            { value: 'compact', label: 'Compact' },
            { value: 'normal', label: 'Normal' },
            { value: 'comfortable', label: 'Comfortable' },
          ]}
          defaultValue="normal"
        />
      }
    />
  ),
};

// ─── Right slot only ──────────────────────────────────────────────────────────

export const RightOnly: Story = {
  name: 'Right slot only',
  render: () => (
    <StageToolbar
      rightSlot={
        <Button variant="primary" size="sm">
          Run All
        </Button>
      }
    />
  ),
};

// ─── Full three-slot ──────────────────────────────────────────────────────────

export const FullThreeSlot: Story = {
  name: 'Full three-slot',
  render: () => (
    <StageToolbar
      leftSlot={
        <div style={{ display: 'flex', gap: 8 }}>
          <Chip variant="static">All</Chip>
          <Chip variant="static">Flagged</Chip>
          <Chip variant="static">Done</Chip>
        </div>
      }
      centerSlot={
        <Segmented
          options={[
            { value: 'compact', label: 'Compact' },
            { value: 'normal', label: 'Normal' },
          ]}
          defaultValue="normal"
        />
      }
      rightSlot={
        <Button variant="primary" size="sm">
          Run All
        </Button>
      }
    />
  ),
};

// ─── Sticky ───────────────────────────────────────────────────────────────────

export const Sticky: Story = {
  name: 'Sticky (data-sticky="true")',
  render: () => (
    <StageToolbar
      sticky
      leftSlot={<Chip variant="static">All</Chip>}
      rightSlot={
        <Button variant="primary" size="sm">
          Save
        </Button>
      }
    />
  ),
};

// ─── With filter chips (left slot) ───────────────────────────────────────────

export const WithFilterChips: Story = {
  name: 'With filter chips — left slot',
  render: () => (
    <StageToolbar
      leftSlot={
        <div style={{ display: 'flex', gap: 6 }}>
          <Chip variant="static">Grayscale</Chip>
          <Chip variant="static">Source</Chip>
          <Chip variant="static">Crop</Chip>
          <Chip variant="dashed">OCR</Chip>
        </div>
      }
      rightSlot={
        <Button variant="ghost" size="sm">
          Clear filters
        </Button>
      }
    />
  ),
};

// ─── With segmented density (center slot) ────────────────────────────────────

export const WithSegmentedDensity: Story = {
  name: 'With segmented density — center slot',
  render: () => (
    <StageToolbar
      leftSlot={<Chip variant="static">10 pages</Chip>}
      centerSlot={
        <Segmented
          options={[
            { value: 'compact', label: 'Compact' },
            { value: 'normal', label: 'Normal' },
            { value: 'comfortable', label: 'Comfortable' },
          ]}
          defaultValue="compact"
        />
      }
    />
  ),
};

// ─── With CTA button (right slot) ────────────────────────────────────────────

export const WithCtaButton: Story = {
  name: 'With CTA button — right slot',
  render: () => (
    <StageToolbar
      leftSlot={
        <div style={{ display: 'flex', gap: 8 }}>
          <Chip variant="static">All</Chip>
          <Chip variant="dashed">Flagged</Chip>
        </div>
      }
      rightSlot={
        <div style={{ display: 'flex', gap: 8 }}>
          <Button variant="ghost" size="sm">
            Reset
          </Button>
          <Button variant="primary" size="sm">
            Apply
          </Button>
        </div>
      }
    />
  ),
};
