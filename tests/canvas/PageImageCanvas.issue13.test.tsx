/**
 * Tests for issue #13: selection-slot layer should be listening=true with click forwarding.
 *
 * Verifies that a `selectionLayerListening` prop is accepted and correctly
 * passed down to the selection layer so consumers can opt into Konva pointer-event routing.
 *
 * react-konva is mocked (jsdom can't run canvas renderer).
 */
import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import React from 'react'

// Capture listening values passed to the selection layer.
const layerListeningValues: Record<string, boolean | undefined> = {}

vi.mock('react-konva', () => ({
  Stage: ({
    children,
    width,
    height,
    'data-testid': tid,
  }: {
    children?: React.ReactNode
    width?: number
    height?: number
    'data-testid'?: string
  }) => (
    <div data-testid={tid ?? 'konva-stage'} data-width={width} data-height={height}>
      {children}
    </div>
  ),
  Layer: ({
    children,
    name,
    listening,
  }: {
    children?: React.ReactNode
    name?: string
    listening?: boolean
  }) => {
    // Record the listening prop for each named layer.
    if (name) {
      layerListeningValues[name] = listening
    }
    return (
      <div
        data-layer-name={name}
        data-listening={String(listening ?? 'undefined')}
      >
        {children}
      </div>
    )
  },
  Rect: () => <div data-testid="konva-rect" />,
  Image: () => <div data-testid="konva-image" />,
}))

import { PageImageCanvas } from '../../src/canvas/PageImageCanvas'

const PAGE = { width: 400, height: 300 }
const WORDS: Array<{ bounding_box: { top_left: { x: number; y: number }; bottom_right: { x: number; y: number } }; text: string }> = []

describe('PageImageCanvas — selectionLayerListening (#13)', () => {
  beforeEach(() => {
    // Reset captured values before each test.
    for (const k of Object.keys(layerListeningValues)) {
      delete layerListeningValues[k]
    }
  })

  it('renders without error when selectionLayerListening is not provided (default off)', () => {
    expect(() => {
      render(
        <PageImageCanvas src="test.png" page={PAGE} words={WORDS} />,
      )
    }).not.toThrow()
    expect(screen.getByTestId('image-viewport')).toBeTruthy()
  })

  it('selection layer has listening=false by default', () => {
    render(
      <PageImageCanvas src="test.png" page={PAGE} words={WORDS} />,
    )
    const selectionLayer = document.querySelector('[data-layer-name="selection"]')
    expect(selectionLayer).toBeTruthy()
    // Default: false (not listening)
    expect(selectionLayer?.getAttribute('data-listening')).toBe('false')
  })

  it('selection layer has listening=true when selectionLayerListening=true', () => {
    render(
      <PageImageCanvas
        src="test.png"
        page={PAGE}
        words={WORDS}
        selectionLayerListening={true}
      />,
    )
    const selectionLayer = document.querySelector('[data-layer-name="selection"]')
    expect(selectionLayer).toBeTruthy()
    expect(selectionLayer?.getAttribute('data-listening')).toBe('true')
  })

  it('selection layer has listening=false when selectionLayerListening=false (explicit)', () => {
    render(
      <PageImageCanvas
        src="test.png"
        page={PAGE}
        words={WORDS}
        selectionLayerListening={false}
      />,
    )
    const selectionLayer = document.querySelector('[data-layer-name="selection"]')
    expect(selectionLayer?.getAttribute('data-listening')).toBe('false')
  })

  it('selection slot render-prop is still called when selectionLayerListening=true', () => {
    let selectionSlotCalled = false
    render(
      <PageImageCanvas
        src="test.png"
        page={PAGE}
        words={WORDS}
        selectionLayerListening={true}
      >
        {{
          selection: () => {
            selectionSlotCalled = true
            return null
          },
        }}
      </PageImageCanvas>,
    )
    expect(selectionSlotCalled).toBe(true)
  })
})
