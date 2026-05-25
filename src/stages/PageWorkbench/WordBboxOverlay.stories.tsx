/**
 * WordBboxOverlay Storybook stories.
 */

import type { Meta, StoryObj } from '@storybook/react';
import { ArtifactViewer } from './ArtifactViewer.js';
import type { WordBbox } from './ArtifactViewer.js';

const BLANK_PNG =
  'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwADhQGAWjR9awAAAABJRU5ErkJggg==';

const meta: Meta = {
  title: 'Stages/PageWorkbench/WordBboxOverlay',
  parameters: { layout: 'padded' },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj;

const WORD_BBOXES: WordBbox[] = [
  { id: 'w1', bbox: [0.11, 0.08, 0.12, 0.018], confidence: 0.98 },
  { id: 'w2', bbox: [0.25, 0.08, 0.08, 0.018], confidence: 0.95 },
  { id: 'w3', bbox: [0.35, 0.08, 0.1, 0.018], confidence: 0.87 },
  { id: 'w4', bbox: [0.11, 0.11, 0.15, 0.018], confidence: 0.92 },
  { id: 'w5', bbox: [0.28, 0.11, 0.09, 0.018], confidence: 0.76 },
  { id: 'w6', bbox: [0.4, 0.11, 0.11, 0.018], confidence: 0.45 },
  { id: 'w7', bbox: [0.11, 0.14, 0.07, 0.018], confidence: 0.99 },
];

const WITH_SELECTED: WordBbox[] = [
  ...WORD_BBOXES,
  { id: 'sel1', bbox: [0.4, 0.36, 0.09, 0.018], confidence: 0.31, selected: true },
];

/**
 * Default — clickable word bboxes.
 */
export const Default: Story = {
  render: () => (
    <div style={{ height: 400, display: 'flex', flexDirection: 'column' }}>
      <ArtifactViewer
        imageSrc={BLANK_PNG}
        pageWidth={2400}
        pageHeight={3200}
        overlayMode="words"
        wordBboxes={WORD_BBOXES}
        onWordClick={(id) => {
          console.info('clicked:', id);
        }}
      />
    </div>
  ),
};

/**
 * WithSelected — one bbox marked selected (mismatch color).
 */
export const WithSelected: Story = {
  render: () => (
    <div style={{ height: 400, display: 'flex', flexDirection: 'column' }}>
      <ArtifactViewer
        imageSrc={BLANK_PNG}
        pageWidth={2400}
        pageHeight={3200}
        overlayMode="words"
        wordBboxes={WITH_SELECTED}
      />
    </div>
  ),
};

/**
 * ReadOnly — no onWordClick callback.
 */
export const ReadOnly: Story = {
  render: () => (
    <div style={{ height: 400, display: 'flex', flexDirection: 'column' }}>
      <ArtifactViewer
        imageSrc={BLANK_PNG}
        pageWidth={2400}
        pageHeight={3200}
        overlayMode="words"
        wordBboxes={WORD_BBOXES}
      />
    </div>
  ),
};
