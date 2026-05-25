/**
 * LabelerCanvas Storybook stories.
 *
 * Stories:
 *   - Default — 3 blocks, all layers on
 *   - NoBlocks — empty blocks array
 *   - OneSelected — single block selected (shows handles)
 *   - WordsOnly — blocks layer off, words on
 *   - Empty — no blocks, all layers off
 *   - Interactive — controlled visibility state
 */

import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { LabelerCanvas } from './LabelerCanvas.js';
import type { LabelerBlock, LayerVisibility } from './LabelerCanvas.js';

// 1×1 blank PNG (data URL) for no-network Storybook runs
const BLANK_PNG =
  'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwADhQGAWjR9awAAAABJRU5ErkJggg==';

const SAMPLE_BLOCKS: LabelerBlock[] = [
  { id: 'b1', bbox: [0.08, 0.06, 0.4, 0.08], type: 'heading', tone: 'brand' },
  { id: 'b2', bbox: [0.08, 0.18, 0.84, 0.35], type: 'text', tone: 'ocr' },
  { id: 'b3', bbox: [0.08, 0.6, 0.35, 0.3], type: 'illustration' },
];

const ALL_ON: LayerVisibility = { blocks: true, words: true, detections: true };

const meta: Meta<typeof LabelerCanvas> = {
  title: 'Stages/PageWorkbench/LabelerCanvas',
  component: LabelerCanvas,
  parameters: { layout: 'padded' },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof LabelerCanvas>;

/**
 * Default — 3 blocks, all layers visible.
 */
export const Default: Story = {
  render: () => (
    <div style={{ height: 500, display: 'flex', flexDirection: 'column' }}>
      <LabelerCanvas
        imageUrl={BLANK_PNG}
        pageWidth={2400}
        pageHeight={3200}
        blocks={SAMPLE_BLOCKS}
        layerVisibility={ALL_ON}
        onLayerVisibilityChange={() => undefined}
        onSelectBlock={(id) => {
          console.info('select', id);
        }}
      />
    </div>
  ),
};

/**
 * NoBlocks — empty annotation set.
 */
export const NoBlocks: Story = {
  render: () => (
    <div style={{ height: 500, display: 'flex', flexDirection: 'column' }}>
      <LabelerCanvas
        imageUrl={BLANK_PNG}
        pageWidth={2400}
        pageHeight={3200}
        blocks={[]}
        layerVisibility={ALL_ON}
        onLayerVisibilityChange={() => undefined}
      />
    </div>
  ),
};

/**
 * OneSelected — b1 is selected (shows 8 selection handles).
 */
export const OneSelected: Story = {
  render: () => (
    <div style={{ height: 500, display: 'flex', flexDirection: 'column' }}>
      <LabelerCanvas
        imageUrl={BLANK_PNG}
        pageWidth={2400}
        pageHeight={3200}
        blocks={SAMPLE_BLOCKS}
        selectedBlockId="b1"
        layerVisibility={ALL_ON}
        onLayerVisibilityChange={() => undefined}
        onSelectBlock={(id) => {
          console.info('select', id);
        }}
      />
    </div>
  ),
};

/**
 * WordsOnly — blocks layer hidden, words and detections visible.
 */
export const WordsOnly: Story = {
  render: () => (
    <div style={{ height: 500, display: 'flex', flexDirection: 'column' }}>
      <LabelerCanvas
        imageUrl={BLANK_PNG}
        pageWidth={2400}
        pageHeight={3200}
        blocks={SAMPLE_BLOCKS}
        layerVisibility={{ blocks: false, words: true, detections: false }}
        onLayerVisibilityChange={() => undefined}
      />
    </div>
  ),
};

/**
 * Empty — no blocks, all layers off.
 */
export const Empty: Story = {
  render: () => (
    <div style={{ height: 500, display: 'flex', flexDirection: 'column' }}>
      <LabelerCanvas
        imageUrl={BLANK_PNG}
        pageWidth={2400}
        pageHeight={3200}
        blocks={[]}
        layerVisibility={{ blocks: false, words: false, detections: false }}
        onLayerVisibilityChange={() => undefined}
      />
    </div>
  ),
};

/**
 * Interactive — layer toggles update visible layers; clicking a block selects it.
 */
export const Interactive: Story = {
  render: function Render() {
    const [visibility, setVisibility] = useState<LayerVisibility>(ALL_ON);
    const [selectedId, setSelectedId] = useState<string | null>(null);

    return (
      <div style={{ height: 500, display: 'flex', flexDirection: 'column' }}>
        <LabelerCanvas
          imageUrl={BLANK_PNG}
          pageWidth={2400}
          pageHeight={3200}
          blocks={SAMPLE_BLOCKS}
          {...(selectedId !== null ? { selectedBlockId: selectedId } : {})}
          onSelectBlock={setSelectedId}
          layerVisibility={visibility}
          onLayerVisibilityChange={setVisibility}
        />
      </div>
    );
  },
};
