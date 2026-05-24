/**
 * OcrTextPanel Storybook stories — Phase 2 M2.
 *
 * Covers: Default (cards) / RowsMode / WithFlags / Empty / LongLines /
 *         Interactive (viewMode state-bound) / LowConfidence.
 */

import React, { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { OcrTextPanel } from './OcrTextPanel.js';
import type { OcrLine, OcrViewMode } from './OcrTextPanel.js';

// ── Fixtures ──────────────────────────────────────────────────────────────────

const SAMPLE_LINES: OcrLine[] = [
  {
    id: 'L1',
    text: 'Alice was beginning to get very tired',
    blockId: 'B1',
    words: [
      { id: 'w1', text: 'Alice', confidence: 0.98 },
      { id: 'w2', text: 'was', confidence: 0.96 },
      { id: 'w3', text: 'beginning', confidence: 0.91 },
      { id: 'w4', text: 'to', confidence: 0.99 },
      { id: 'w5', text: 'get', confidence: 0.97 },
      { id: 'w6', text: 'very', confidence: 0.93 },
      { id: 'w7', text: 'tired', confidence: 0.88 },
    ],
  },
  {
    id: 'L2',
    text: 'of sitting by her sister on the bank',
    blockId: 'B1',
    words: [
      { id: 'w8', text: 'of', confidence: 0.99 },
      { id: 'w9', text: 'sitting', confidence: 0.72 },
      { id: 'w10', text: 'by', confidence: 0.95 },
      { id: 'w11', text: 'her', confidence: 0.89 },
      { id: 'w12', text: 'sister', confidence: 0.76 },
      { id: 'w13', text: 'on', confidence: 0.98 },
      { id: 'w14', text: 'the', confidence: 0.99 },
      { id: 'w15', text: 'bank', confidence: 0.84 },
    ],
  },
  {
    id: 'L3',
    text: 'and of having nothing to do',
    blockId: 'B2',
    words: [
      { id: 'w16', text: 'and', confidence: 0.97 },
      { id: 'w17', text: 'of', confidence: 0.99 },
      { id: 'w18', text: 'having', confidence: 0.88 },
      { id: 'w19', text: 'nothing', confidence: 0.67 },
      { id: 'w20', text: 'to', confidence: 0.99 },
      { id: 'w21', text: 'do', confidence: 0.98 },
    ],
  },
];

const LINES_WITH_FLAGS: OcrLine[] = [
  {
    id: 'L1',
    text: 'once or twice she had peeped',
    words: [
      { id: 'w1', text: 'once', confidence: 0.92 },
      { id: 'w2', text: 'or', confidence: 0.98 },
      { id: 'w3', text: 'twicc', confidence: 0.48, flags: ['dict-miss', 'low-conf'] },
      { id: 'w4', text: 'she', confidence: 0.97 },
      { id: 'w5', text: 'had', confidence: 0.94 },
      { id: 'w6', text: 'peeped', confidence: 0.71, flags: ['low-conf'] },
    ],
  },
];

const LOW_CONFIDENCE_LINES: OcrLine[] = [
  {
    id: 'L1',
    text: 'into the book her sister was reading',
    words: [
      { id: 'w1', text: 'into', confidence: 0.45 },
      { id: 'w2', text: 'the', confidence: 0.51 },
      { id: 'w3', text: 'book', confidence: 0.62 },
      { id: 'w4', text: 'her', confidence: 0.38 },
      { id: 'w5', text: 'sister', confidence: 0.44 },
      { id: 'w6', text: 'was', confidence: 0.59 },
      { id: 'w7', text: 'reading', confidence: 0.43 },
    ],
  },
];

const LONG_LINES: OcrLine[] = Array.from({ length: 12 }, (_, i) => ({
  id: `L${i + 1}`,
  text: `Line ${i + 1} of a very long document with extensive text content`,
  blockId: `B${Math.floor(i / 4) + 1}`,
  words: Array.from({ length: 8 }, (_, j) => ({
    id: `w${i * 8 + j + 1}`,
    text: ['the', 'quick', 'brown', 'fox', 'jumps', 'over', 'lazy', 'dog'][j] ?? 'word',
    confidence: 0.7 + Math.random() * 0.3,
  })),
}));

// ── Meta ──────────────────────────────────────────────────────────────────────

const meta: Meta<typeof OcrTextPanel> = {
  title: 'Stages/PageWorkbench/OcrTextPanel',
  component: OcrTextPanel,
  parameters: {
    layout: 'padded',
  },
  args: {
    lines: SAMPLE_LINES,
  },
};

export default meta;
type Story = StoryObj<typeof OcrTextPanel>;

// ── Stories ───────────────────────────────────────────────────────────────────

/** Default cards view mode. */
export const Default: Story = {
  args: {
    lines: SAMPLE_LINES,
    viewMode: 'cards',
  },
};

/** Rows view mode — compact horizontal layout. */
export const RowsMode: Story = {
  args: {
    lines: SAMPLE_LINES,
    viewMode: 'rows',
  },
};

/** Words with flag indicators (dict-miss, low-conf). */
export const WithFlags: Story = {
  args: {
    lines: LINES_WITH_FLAGS,
    viewMode: 'cards',
    onWordEdit: (id: string) => alert(`Edit word: ${id}`),
  },
};

/** Empty state — no lines. */
export const Empty: Story = {
  args: {
    lines: [],
  },
};

/** Many lines to test scroll and block separation. */
export const LongLines: Story = {
  args: {
    lines: LONG_LINES,
    viewMode: 'cards',
  },
};

/** Interactive — viewMode toggle and word edit callback wired up. */
function InteractiveTemplate(args: React.ComponentProps<typeof OcrTextPanel>) {
  const [viewMode, setViewMode] = useState<OcrViewMode>('cards');
  return (
    <OcrTextPanel
      {...args}
      viewMode={viewMode}
      onViewModeChange={setViewMode}
      onWordEdit={(id) => console.log('Edit word:', id)}
    />
  );
}

export const Interactive: Story = {
  render: (args) => <InteractiveTemplate {...args} />,
  args: {
    lines: SAMPLE_LINES,
  },
};

/** All words have very low confidence — all pips red. */
export const LowConfidence: Story = {
  args: {
    lines: LOW_CONFIDENCE_LINES,
    viewMode: 'cards',
    onWordEdit: (id: string) => console.log('Edit word:', id),
  },
};
