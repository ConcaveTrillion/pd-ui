import type { Meta, StoryObj } from '@storybook/react';
import { BulkActionBar } from './BulkActionBar.js';
import { Button } from './Button.js';
import { Badge } from './Badge.js';
import { RefreshCw } from '../icons/lucide.js';

/*
 * Stories cover every DCArtboard variant from the design bundle:
 *
 *   Default        — bare count + Clear (no variant class)
 *   WithFlagSummary — count + flag summary text (wf10/crops-grid C1 / C2 artboards)
 *   DockVariant     — border-top docked bar (wf03 / wf11 / wf-pw artboards)
 *   FloatVariant    — floating absolute card (wf10/crops-grid C1 artboard)
 *   WithActions     — stage-specific action buttons in the actions slot
 *   LightTheme      — same in data-theme="light"
 */

const meta: Meta<typeof BulkActionBar> = {
  title: 'Primitives/BulkActionBar',
  component: BulkActionBar,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
  },
  argTypes: {
    count: { control: { type: 'number', min: 0 } },
    flagSummary: { control: 'text' },
    variant: { control: 'select', options: [undefined, 'dock', 'float'] },
    onClear: { action: 'cleared' },
    actions: { control: false },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

/** Minimal — just a count and Clear button. */
export const Default: Story = {
  args: {
    count: 3,
    onClear: () => {
      /* no-op */
    },
  },
};

/**
 * With flag summary (crops-grid artboard C1 / C2).
 * flagSummary is stage-provided text next to the count.
 */
export const WithFlagSummary: Story = {
  args: {
    count: 5,
    flagSummary: '2 over-crop · 1 deskew·fail · 1 overflow · 1 asymmetric',
    onClear: () => {
      /* no-op */
    },
  },
};

/**
 * Dock variant — border-top bar docked inside a panel.
 * Mirrors wf03 / wf11 / wf-pw artboards.
 */
export const DockVariant: Story = {
  name: 'Variant: dock (wf03 / wf11 / wf-pw)',
  args: {
    count: 4,
    variant: 'dock',
    onClear: () => {
      /* no-op */
    },
    actions: (
      <>
        <Badge tone="neutral" mono>
          blurry · 3
        </Badge>
        <Badge tone="dirty" mono>
          skew · 1
        </Badge>
        <Badge tone="failed" mono>
          errored · 1
        </Badge>
        <Button variant="ghost" size="sm">
          Mark as fine
        </Button>
        <Button variant="primary" size="sm">
          Re-run from canvas_map
        </Button>
      </>
    ),
  },
  decorators: [
    (Story) => (
      <div style={{ height: 56, position: 'relative', border: '1px dashed var(--border-2)' }}>
        <Story />
      </div>
    ),
  ],
};

/**
 * Float variant — absolutely-positioned card above scroll content.
 * Mirrors wf10/crops-grid artboard C1.
 */
export const FloatVariant: Story = {
  name: 'Variant: float (wf10 crops-grid)',
  args: {
    count: 5,
    variant: 'float',
    flagSummary: '2 over-crop · 1 deskew·fail · 1 overflow · 1 asymmetric',
    onClear: () => {
      /* no-op */
    },
    actions: (
      <>
        <Button variant="ghost" size="sm" icon={<RefreshCw size={12} />}>
          Re-deskew only
        </Button>
        <Button variant="primary" size="sm" icon={<RefreshCw size={12} />}>
          Re-run from initial_crop (5)
        </Button>
      </>
    ),
  },
  decorators: [
    (Story) => (
      <div
        style={{
          height: 120,
          position: 'relative',
          background: 'var(--bg-page)',
          border: '1px dashed var(--border-2)',
        }}
      >
        <Story />
      </div>
    ),
  ],
};

/**
 * With only actions slot — no flag summary.
 */
export const WithActions: Story = {
  args: {
    count: 7,
    onClear: () => {
      /* no-op */
    },
    actions: (
      <>
        <Button variant="ghost" size="sm">
          Open workbench
        </Button>
        <Button variant="primary" size="sm">
          Re-run from source (7)
        </Button>
      </>
    ),
  },
};

/**
 * Disabled Clear — onClear not provided.
 * Clear button renders but is disabled.
 */
export const NoClearCallback: Story = {
  name: 'No onClear (Clear disabled)',
  args: {
    count: 2,
    flagSummary: 'selection read-only in this context',
  },
};

/** Light theme. */
export const LightTheme: Story = {
  args: {
    count: 3,
    flagSummary: '1 blurry · 1 skew',
    onClear: () => {
      /* no-op */
    },
    actions: (
      <Button variant="primary" size="sm">
        Re-run (3)
      </Button>
    ),
  },
  parameters: {
    backgrounds: { default: 'light' },
  },
  decorators: [
    (Story) => (
      <div data-theme="light">
        <Story />
      </div>
    ),
  ],
};
