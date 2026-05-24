/**
 * StageControlsPanel Storybook stories.
 *
 * Stories:
 *   1. Clean — defaults, no overrides
 *   2. Modified — user overrides active
 *   3. Preset — named preset applied
 *   4. WithCpuFallback — CPU-fallback warning visible
 *   5. Disabled — footer buttons disabled
 *   6. Empty — controlsSlot=null (no per-stage controls)
 */

import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { StageControlsPanel } from './StageControlsPanel.js';

// ── Sample controls slot ──────────────────────────────────────────────────────

function SampleControls() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <div>
        <label
          htmlFor="story-threshold"
          style={{
            fontSize: 11.5,
            fontWeight: 600,
            color: 'var(--ink-2)',
            display: 'block',
            marginBottom: 6,
          }}
        >
          Threshold level
        </label>
        <input
          id="story-threshold"
          type="range"
          min={0}
          max={255}
          defaultValue={140}
          style={{ width: '100%' }}
        />
      </div>
      <div>
        <label
          htmlFor="story-mode"
          style={{
            fontSize: 11.5,
            fontWeight: 600,
            color: 'var(--ink-2)',
            display: 'block',
            marginBottom: 6,
          }}
        >
          Mode
        </label>
        <select id="story-mode" style={{ width: '100%', fontSize: 13 }}>
          <option>Luma 709</option>
          <option>Perceptual</option>
          <option>Custom</option>
        </select>
      </div>
    </div>
  );
}

// ── Meta ──────────────────────────────────────────────────────────────────────

const meta: Meta<typeof StageControlsPanel> = {
  title: 'Stages/PageWorkbench/StageControlsPanel',
  component: StageControlsPanel,
  parameters: {
    layout: 'fullscreen',
  },
  decorators: [
    (Story) => (
      <div style={{ width: 280, height: 600, display: 'flex', flexDirection: 'column' }}>
        <Story />
      </div>
    ),
  ],
};
export default meta;

type Story = StoryObj<typeof StageControlsPanel>;

// ── Stories ───────────────────────────────────────────────────────────────────

export const Clean: Story = {
  args: {
    inheritance: 'clean',
    controlsSlot: <SampleControls />,
    onRevert: () => console.log('revert'),
    onSave: () => console.log('save'),
  },
};

export const Modified: Story = {
  args: {
    inheritance: 'modified',
    controlsSlot: <SampleControls />,
    onRevert: () => console.log('revert'),
    onSave: () => console.log('save'),
  },
};

export const Preset: Story = {
  args: {
    inheritance: 'preset',
    presetName: 'WF-11 Default',
    controlsSlot: <SampleControls />,
    onRevert: () => console.log('revert'),
    onSave: () => console.log('save'),
  },
};

export const WithCpuFallback: Story = {
  args: {
    inheritance: 'clean',
    cpuFallback: true,
    controlsSlot: <SampleControls />,
    onRevert: () => console.log('revert'),
    onSave: () => console.log('save'),
  },
};

export const Disabled: Story = {
  args: {
    inheritance: 'modified',
    disabled: true,
    controlsSlot: <SampleControls />,
    onRevert: () => console.log('revert'),
    onSave: () => console.log('save'),
  },
};

export const Empty: Story = {
  args: {
    inheritance: 'clean',
    controlsSlot: null,
    onRevert: () => console.log('revert'),
    onSave: () => console.log('save'),
  },
};
