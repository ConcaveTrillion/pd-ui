/**
 * IllustOverlay Storybook stories.
 */

import type { Meta, StoryObj } from '@storybook/react';
import { ArtifactViewer } from './ArtifactViewer.js';
import type { IllustBbox } from './ArtifactViewer.js';

const BLANK_PNG =
  'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwADhQGAWjR9awAAAABJRU5ErkJggg==';

const meta: Meta = {
  title: 'Stages/PageWorkbench/IllustOverlay',
  parameters: { layout: 'padded' },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj;

const ONE_BOX: IllustBbox[] = [{ id: 'ill1', bbox: [0.15, 0.2, 0.7, 0.45], label: 'plate image' }];

const TWO_BOXES: IllustBbox[] = [
  { id: 'ill1', bbox: [0.15, 0.2, 0.7, 0.35], label: 'main plate' },
  { id: 'ill2', bbox: [0.55, 0.62, 0.35, 0.12], label: 'caption block' },
];

/**
 * SingleBox — one illustration highlighted.
 */
export const SingleBox: Story = {
  render: () => (
    <div style={{ height: 400, display: 'flex', flexDirection: 'column' }}>
      <ArtifactViewer
        imageSrc={BLANK_PNG}
        pageWidth={2400}
        pageHeight={3200}
        overlayMode="illust"
        illustBboxes={ONE_BOX}
      />
    </div>
  ),
};

/**
 * TwoBoxes — two illustrations highlighted.
 */
export const TwoBoxes: Story = {
  render: () => (
    <div style={{ height: 400, display: 'flex', flexDirection: 'column' }}>
      <ArtifactViewer
        imageSrc={BLANK_PNG}
        pageWidth={2400}
        pageHeight={3200}
        overlayMode="illust"
        illustBboxes={TWO_BOXES}
      />
    </div>
  ),
};

/**
 * Empty — no illustration bboxes.
 */
export const Empty: Story = {
  render: () => (
    <div style={{ height: 400, display: 'flex', flexDirection: 'column' }}>
      <ArtifactViewer
        imageSrc={BLANK_PNG}
        pageWidth={2400}
        pageHeight={3200}
        overlayMode="illust"
        illustBboxes={[]}
      />
    </div>
  ),
};
