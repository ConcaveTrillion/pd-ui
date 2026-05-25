/**
 * SourceBanner Storybook stories.
 *
 * Stories:
 *   1. Idle               — neutral CTA bar (Generate + Re-generate)
 *   2. IdleNoRegenerate   — Generate only (no Re-generate option)
 *   3. Generating         — 50% progress bar with page counter
 *   4. SelectionFew       — 3 pages selected
 *   5. SelectionMany      — 47 pages selected
 *   6. Interactive        — fully wired controls story
 */

import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { SourceBanner } from './SourceBanner.js';

const meta: Meta<typeof SourceBanner> = {
  title: 'Stages/Source/SourceBanner',
  component: SourceBanner,
  parameters: {
    layout: 'padded',
  },
  decorators: [
    (Story) => (
      <div style={{ maxWidth: 900 }}>
        <Story />
      </div>
    ),
  ],
};
export default meta;

type Story = StoryObj<typeof SourceBanner>;

// ── Idle ──────────────────────────────────────────────────────────────────────

export const Idle: Story = {
  args: {
    state: 'idle',
    onGenerate: () => console.log('generate'),
    onRegenerate: () => console.log('re-generate'),
  },
};

// ── IdleNoRegenerate ──────────────────────────────────────────────────────────

export const IdleNoRegenerate: Story = {
  args: {
    state: 'idle',
    onGenerate: () => console.log('generate'),
    // onRegenerate intentionally omitted — Re-generate button is hidden
  },
};

// ── Generating ────────────────────────────────────────────────────────────────

export const Generating: Story = {
  args: {
    state: 'generating',
    progress: 0.5,
    currentPage: 32,
    totalPages: 64,
  },
};

// ── SelectionFew ──────────────────────────────────────────────────────────────

export const SelectionFew: Story = {
  args: {
    state: 'selection',
    selectedCount: 3,
    onBulkAction: (action) => console.log('bulk action:', action),
  },
};

// ── SelectionMany ─────────────────────────────────────────────────────────────

export const SelectionMany: Story = {
  args: {
    state: 'selection',
    selectedCount: 47,
    onBulkAction: (action) => console.log('bulk action:', action),
  },
};

// ── Interactive ───────────────────────────────────────────────────────────────

export function Interactive() {
  const [state, setState] =
    React.useState<React.ComponentProps<typeof SourceBanner>['state']>('idle');
  const [progress, setProgress] = React.useState(0);
  const [selectedCount, setSelectedCount] = React.useState(5);

  function handleGenerate() {
    setState('generating');
    let p = 0;
    const id = setInterval(() => {
      p = Math.min(p + 0.05, 1);
      setProgress(p);
      if (p >= 1) {
        clearInterval(id);
        setState('selection');
      }
    }, 150);
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16, maxWidth: 900 }}>
      <SourceBanner
        state={state}
        progress={progress}
        {...(state === 'generating'
          ? { currentPage: Math.round(progress * 64), totalPages: 64 }
          : {})}
        selectedCount={selectedCount}
        onGenerate={handleGenerate}
        onRegenerate={handleGenerate}
        onBulkAction={(action) => {
          console.log('bulk:', action);
          if (action === 'remove') setSelectedCount((n) => Math.max(0, n - 1));
        }}
      />
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        <button onClick={() => setState('idle')}>→ idle</button>
        <button
          onClick={() => {
            setProgress(0.3);
            setState('generating');
          }}
        >
          → generating 30%
        </button>
        <button onClick={() => setState('selection')}>→ selection</button>
        <button onClick={() => setSelectedCount((n) => n + 1)}>+ selected</button>
        <button onClick={() => setSelectedCount((n) => Math.max(0, n - 1))}>- selected</button>
      </div>
    </div>
  );
}
