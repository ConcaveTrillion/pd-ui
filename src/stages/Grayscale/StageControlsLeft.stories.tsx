/**
 * StageControlsLeft stories — Grayscale per-page left-drawer control panel.
 *
 * Composes StageControlsPanel chrome (inheritance banner + CPU-fallback
 * warning + sticky footer) with ModeCard + AdvancedParams in the controls
 * slot (currently stub implementations pending orchestrator merge).
 */
import type { Meta, StoryObj } from '@storybook/react';
import * as React from 'react';
import { StageControlsLeft } from './StageControlsLeft.js';
import type { GrayscaleParams } from './AdvancedParams.js';

const meta: Meta<typeof StageControlsLeft> = {
  title: 'Stages/Grayscale/StageControlsLeft',
  component: StageControlsLeft,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof StageControlsLeft>;

// ── Shared fixtures ────────────────────────────────────────────────────────

const DEFAULT_PARAMS: GrayscaleParams = {
  samplerRadius: 8,
  gamma: 1.8,
  outputRange: [0, 255],
};

// ── Stories ────────────────────────────────────────────────────────────────

/** Settings are at project defaults — no overrides applied. */
export const CleanDefaults: Story = {
  name: 'Clean (defaults)',
  args: {
    inheritance: 'clean',
    backend: 'gpu',
    mode: 'standard',
    params: DEFAULT_PARAMS,
    onModeChange: (mode: 'standard' | 'perceptual') => console.log('onModeChange:', mode),
    onParamsChange: (p: GrayscaleParams) => console.log('onParamsChange:', p),
    onRevert: () => console.log('onRevert'),
    onSave: () => console.log('onSave'),
  },
};

/** Settings have been changed from the project defaults. */
export const Modified: Story = {
  name: 'Modified (overrides active)',
  args: {
    inheritance: 'modified',
    backend: 'gpu',
    mode: 'perceptual',
    params: { samplerRadius: 8, gamma: 1.8, outputRange: [0, 255] },
    onModeChange: (mode: 'standard' | 'perceptual') => console.log('onModeChange:', mode),
    onParamsChange: (p: GrayscaleParams) => console.log('onParamsChange:', p),
    onRevert: () => console.log('onRevert'),
    onSave: () => console.log('onSave'),
  },
};

/** Settings are sourced from a named preset. */
export const Preset: Story = {
  name: 'Preset (Newsprint · pre-1920)',
  args: {
    inheritance: 'preset',
    presetName: 'Newsprint · pre-1920',
    backend: 'gpu',
    mode: 'perceptual',
    params: { samplerRadius: 8, gamma: 1.8, outputRange: [0, 255] },
    onModeChange: (mode: 'standard' | 'perceptual') => console.log('onModeChange:', mode),
    onParamsChange: (p: GrayscaleParams) => console.log('onParamsChange:', p),
    onRevert: () => console.log('onRevert'),
    onSave: () => console.log('onSave'),
  },
};

/** GPU unavailable — CPU fallback warning row is shown. */
export const WithCpuFallback: Story = {
  name: 'With CPU Fallback Warning',
  args: {
    inheritance: 'clean',
    backend: 'cpu',
    cpuFallback: true,
    mode: 'standard',
    params: DEFAULT_PARAMS,
    onModeChange: (mode: 'standard' | 'perceptual') => console.log('onModeChange:', mode),
    onParamsChange: (p: GrayscaleParams) => console.log('onParamsChange:', p),
    onRevert: () => console.log('onRevert'),
    onSave: () => console.log('onSave'),
  },
};

/** Interactive — all state is live-updated via React.useState. */
export const Interactive: Story = {
  name: 'Interactive',
  render: function InteractiveStory() {
    const [inheritance, setInheritance] = React.useState<
      'clean' | 'modified' | 'preset'
    >('clean');
    const [mode, setMode] = React.useState<'standard' | 'perceptual'>('standard');
    const [params, setParams] = React.useState<GrayscaleParams>(DEFAULT_PARAMS);
    const [cpuFallback, setCpuFallback] = React.useState(false);

    function handleModeChange(next: 'standard' | 'perceptual') {
      setMode(next);
      setInheritance('modified');
    }

    function handleParamsChange(next: GrayscaleParams) {
      setParams(next);
      setInheritance('modified');
    }

    function handleRevert() {
      setMode('standard');
      setParams(DEFAULT_PARAMS);
      setInheritance('clean');
    }

    function handleSave() {
      console.log('Save as default:', { mode, params });
      setInheritance('clean');
    }

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <div style={{ display: 'flex', gap: 8, fontSize: 12 }}>
          <label>
            <input
              type="checkbox"
              checked={cpuFallback}
              onChange={(e) => { setCpuFallback(e.target.checked); }}
            />
            {' '}CPU fallback
          </label>
          <button
            type="button"
            onClick={() => { setInheritance('preset'); }}
            style={{ fontSize: 11 }}
          >
            Set Preset
          </button>
        </div>
        <StageControlsLeft
          inheritance={inheritance}
          {...(inheritance === 'preset' ? { presetName: 'Newsprint · pre-1920' } : {})}
          backend={cpuFallback ? 'cpu' : 'gpu'}
          cpuFallback={cpuFallback}
          mode={mode}
          onModeChange={handleModeChange}
          params={params}
          onParamsChange={handleParamsChange}
          onRevert={handleRevert}
          onSave={handleSave}
        />
      </div>
    );
  },
};
