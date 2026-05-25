/**
 * ModeCard Storybook stories.
 *
 * Stories:
 *   1. SelectedStandard  — Standard mode selected, mixed estimate tones
 *   2. SelectedPerceptual — Perceptual mode selected, mixed estimate tones
 *   3. BothExact         — both estimates are reliable (exact tone = green)
 *   4. OneFuzzy          — perceptual estimate is a rough guess (fuzzy tone = amber)
 *   5. Interactive       — fully wired controls story
 */

import React, { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { ModeCard } from './ModeCard.js';
import type { GrayscaleMode } from './ModeCard.js';

const meta: Meta<typeof ModeCard> = {
  title: 'Stages/Grayscale/ModeCard',
  component: ModeCard,
  parameters: {
    layout: 'padded',
  },
  decorators: [
    (Story) => (
      <div style={{ maxWidth: 640 }}>
        <Story />
      </div>
    ),
  ],
};
export default meta;

type Story = StoryObj<typeof ModeCard>;

// ── SelectedStandard ──────────────────────────────────────────────────────────

export const SelectedStandard: Story = {
  args: {
    selectedMode: 'standard',
    onModeChange: (mode: GrayscaleMode) => console.log('mode changed:', mode),
    estimates: {
      standard: { secondsPerPage: 2, tone: 'exact' },
      perceptual: { secondsPerPage: 5, tone: 'fuzzy' },
    },
  },
};

// ── SelectedPerceptual ────────────────────────────────────────────────────────

export const SelectedPerceptual: Story = {
  args: {
    selectedMode: 'perceptual',
    onModeChange: (mode: GrayscaleMode) => console.log('mode changed:', mode),
    estimates: {
      standard: { secondsPerPage: 2, tone: 'exact' },
      perceptual: { secondsPerPage: 5, tone: 'fuzzy' },
    },
  },
};

// ── BothExact ─────────────────────────────────────────────────────────────────

/** Both estimates are reliable — both badges use the exact (green) tone. */
export const BothExact: Story = {
  args: {
    selectedMode: 'standard',
    onModeChange: (mode: GrayscaleMode) => console.log('mode changed:', mode),
    estimates: {
      standard: { secondsPerPage: 2, tone: 'exact' },
      perceptual: { secondsPerPage: 4, tone: 'exact' },
    },
  },
};

// ── OneFuzzy ──────────────────────────────────────────────────────────────────

/** Perceptual has an uncertain estimate — only its badge uses the fuzzy (amber) tone. */
export const OneFuzzy: Story = {
  args: {
    selectedMode: 'standard',
    onModeChange: (mode: GrayscaleMode) => console.log('mode changed:', mode),
    estimates: {
      standard: { secondsPerPage: 2, tone: 'exact' },
      perceptual: { secondsPerPage: 8, tone: 'fuzzy' },
    },
  },
};

// ── Interactive ───────────────────────────────────────────────────────────────

/** Fully wired — click to toggle between modes. */
function InteractiveDemo() {
  const [mode, setMode] = useState<GrayscaleMode>('standard');
  return (
    <ModeCard
      selectedMode={mode}
      onModeChange={setMode}
      estimates={{
        standard: { secondsPerPage: 2, tone: 'exact' },
        perceptual: { secondsPerPage: 5, tone: 'fuzzy' },
      }}
    />
  );
}

export const Interactive: Story = {
  render: () => <InteractiveDemo />,
};
