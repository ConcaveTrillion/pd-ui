/**
 * RotateHandle Storybook stories.
 */

import React, { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { ArtifactViewer } from './ArtifactViewer.js';

const BLANK_PNG =
  'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwADhQGAWjR9awAAAABJRU5ErkJggg==';

const meta: Meta = {
  title: 'Stages/PageWorkbench/RotateHandle',
  parameters: { layout: 'padded' },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj;

/**
 * Interactive — drag handle changes rotation angle.
 */
function RotateInteractiveStory() {
  const [deg, setDeg] = useState(0);
  return (
    <div style={{ height: 400, display: 'flex', flexDirection: 'column', gap: 8 }}>
      <div style={{ fontSize: 12, color: 'var(--ink-3)', fontFamily: 'var(--mono-font)' }}>
        Rotation: {deg.toFixed(1)}&deg;
      </div>
      <ArtifactViewer
        imageSrc={BLANK_PNG}
        pageWidth={2400}
        pageHeight={3200}
        overlayMode="rotate"
        rotationDeg={deg}
        onRotationChange={setDeg}
      />
    </div>
  );
}

export const Interactive: Story = {
  render: () => <RotateInteractiveStory />,
};

/**
 * PreRotated — starts at 15 degrees.
 */
export const PreRotated: Story = {
  render: () => (
    <div style={{ height: 400, display: 'flex', flexDirection: 'column' }}>
      <ArtifactViewer
        imageSrc={BLANK_PNG}
        pageWidth={2400}
        pageHeight={3200}
        overlayMode="rotate"
        rotationDeg={15}
      />
    </div>
  ),
};
