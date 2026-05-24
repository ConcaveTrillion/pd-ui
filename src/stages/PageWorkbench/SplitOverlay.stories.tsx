/**
 * SplitOverlay Storybook stories.
 *
 * Since SplitOverlay renders Konva shapes, we show it composed inside
 * ArtifactViewer for a working demo, and also provide a type docs story.
 */

import React, { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import { ArtifactViewer } from './ArtifactViewer.js'

const BLANK_PNG =
  'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwADhQGAWjR9awAAAABJRU5ErkJggg=='

const meta: Meta = {
  title: 'Stages/PageWorkbench/SplitOverlay',
  parameters: { layout: 'padded' },
  tags: ['autodocs'],
}

export default meta

type Story = StoryObj

/**
 * Default — split at center (0.5). Draggable.
 */
function SplitDefaultStory() {
  const [splitX, setSplitX] = useState(0.5)
  return (
    <div style={{ height: 400, display: 'flex', flexDirection: 'column' }}>
      <div style={{ marginBottom: 8, fontSize: 12, color: 'var(--ink-3)' }}>
        splitX: {splitX.toFixed(3)}
      </div>
      <ArtifactViewer
        imageSrc={BLANK_PNG}
        pageWidth={2400}
        pageHeight={3200}
        overlayMode="split"
        splitProposal={{ splitX, onSplitXChange: setSplitX }}
      />
    </div>
  )
}

export const Default: Story = {
  render: () => <SplitDefaultStory />,
}

/**
 * LeftAligned — split at 0.25.
 */
export const LeftAligned: Story = {
  render: () => (
    <div style={{ height: 400, display: 'flex', flexDirection: 'column' }}>
      <ArtifactViewer
        imageSrc={BLANK_PNG}
        pageWidth={2400}
        pageHeight={3200}
        overlayMode="split"
        splitProposal={{ splitX: 0.25 }}
      />
    </div>
  ),
}

/**
 * ReadOnly — no onSplitXChange callback.
 */
export const ReadOnly: Story = {
  render: () => (
    <div style={{ height: 400, display: 'flex', flexDirection: 'column' }}>
      <ArtifactViewer
        imageSrc={BLANK_PNG}
        pageWidth={2400}
        pageHeight={3200}
        overlayMode="split"
        splitProposal={{ splitX: 0.6 }}
      />
    </div>
  ),
}
