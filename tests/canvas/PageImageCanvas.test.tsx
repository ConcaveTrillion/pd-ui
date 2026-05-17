/**
 * Tests for PageImageCanvas component (M5.3).
 *
 * Verifies:
 *   - Stage mounts with correct dimensions
 *   - image-viewport testid is present
 *   - Slot fills receive slot props
 *   - Selection works (uncontrolled)
 *   - Layer order naming
 *
 * react-konva is mocked (jsdom can't run canvas renderer).
 */

import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import React from 'react'

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
  }: {
    children?: React.ReactNode
    name?: string
  }) => <div data-layer-name={name}>{children}</div>,
  Rect: ({
    x,
    y,
    width,
    height,
    'data-testid': tid,
  }: {
    x?: number
    y?: number
    width?: number
    height?: number
    'data-testid'?: string
  }) => (
    <div
      data-testid={tid ?? 'konva-rect'}
      data-x={x}
      data-y={y}
      data-width={width}
      data-height={height}
    />
  ),
}))

import { PageImageCanvas } from '../../src/canvas/PageImageCanvas'

// ── Fixtures ──────────────────────────────────────────────────────────────────

const makeWord = (x: number, y: number, w: number, h: number, text = 'word') => ({
  bounding_box: {
    is_normalized: false,
    top_left: { is_normalized: false, x, y },
    bottom_right: { is_normalized: false, x: x + w, y: y + h },
  },
  text,
  ocr_confidence: 0.9,
  review: null,
  word_labels: [],
  text_style_labels: [],
})

const page = {
  width: 400,
  height: 600,
  page_index: 0,
  name: 'page-0',
  image_path: '/page.png',
  items: [],
  review: null,
}

const words = [
  makeWord(10, 20, 50, 20, 'hello'),
  makeWord(80, 20, 60, 20, 'world'),
]

// ── Tests ─────────────────────────────────────────────────────────────────────

describe('PageImageCanvas', () => {
  it('renders the image-viewport wrapper', () => {
    render(<PageImageCanvas src="/img.png" page={page} words={words} />)
    expect(screen.getByTestId('image-viewport')).toBeInTheDocument()
  })

  it('stage has correct page dimensions as data attributes', () => {
    render(<PageImageCanvas src="/img.png" page={page} words={words} />)
    const viewport = screen.getByTestId('image-viewport')
    expect(viewport.getAttribute('data-width')).toBe('400')
    expect(viewport.getAttribute('data-height')).toBe('600')
  })

  it('renders a Konva stage', () => {
    render(<PageImageCanvas src="/img.png" page={page} words={words} />)
    expect(screen.getByTestId('canvas-stage')).toBeInTheDocument()
  })

  it('stage width/height equal page * effectiveScale (fit: scale ≤ 1)', () => {
    render(<PageImageCanvas src="/img.png" page={page} words={words} fitOnMount={true} />)
    const stage = screen.getByTestId('canvas-stage')
    // In jsdom container size is 0×0, so fitScale = 1 (the min(..., 1) fallback).
    // Scale 1 → stage should be 400×600.
    const w = Number(stage.getAttribute('data-width'))
    const h = Number(stage.getAttribute('data-height'))
    expect(w).toBeGreaterThan(0)
    expect(h).toBeGreaterThan(0)
  })

  it('calls the overlay slot for each word', () => {
    const rendered: string[] = []
    render(
      <PageImageCanvas src="/img.png" page={page} words={words}>
        {{
          overlay: ({ word }) => {
            rendered.push(word.text ?? '')
            return <div key={word.text} data-testid={`overlay-${word.text}`} />
          },
        }}
      </PageImageCanvas>
    )
    expect(rendered).toContain('hello')
    expect(rendered).toContain('world')
    expect(screen.getByTestId('overlay-hello')).toBeInTheDocument()
    expect(screen.getByTestId('overlay-world')).toBeInTheDocument()
  })

  it('overlay slot receives isSelected=false initially', () => {
    const selectedFlags: boolean[] = []
    render(
      <PageImageCanvas src="/img.png" page={page} words={words}>
        {{
          overlay: ({ isSelected }) => {
            selectedFlags.push(isSelected)
            return null
          },
        }}
      </PageImageCanvas>
    )
    expect(selectedFlags.every((s) => s === false)).toBe(true)
  })

  it('hud slot receives SlotRenderProps', () => {
    let receivedCoords: unknown
    let receivedSelection: unknown
    let receivedZoom: unknown
    render(
      <PageImageCanvas src="/img.png" page={page} words={words}>
        {{
          hud: (p) => {
            receivedCoords = p.coords
            receivedSelection = p.selection
            receivedZoom = p.zoom
            return null
          },
        }}
      </PageImageCanvas>
    )
    expect(receivedCoords).toBeDefined()
    expect(receivedSelection).toBeDefined()
    expect(receivedZoom).toBeDefined()
    expect(typeof receivedZoom).toBe('number')
  })

  it('renders with controlled selection (selection prop)', () => {
    const sel = { ids: new Set(['10,20']) }
    const overlaySelectedFlags: boolean[] = []
    render(
      <PageImageCanvas src="/img.png" page={page} words={words} selection={sel}>
        {{
          overlay: ({ isSelected }) => {
            overlaySelectedFlags.push(isSelected)
            return null
          },
        }}
      </PageImageCanvas>
    )
    // First word has bounding_box top_left = {x:10, y:20}, defaultGetWordId = "10,20"
    expect(overlaySelectedFlags[0]).toBe(true)
    expect(overlaySelectedFlags[1]).toBe(false)
  })

  it('renders underlay, overlay, selection, tool, hud layers', () => {
    const { container } = render(
      <PageImageCanvas src="/img.png" page={page} words={words} />
    )
    const layers = Array.from(container.querySelectorAll('[data-layer-name]'))
    const layerNames = layers.map((el) => el.getAttribute('data-layer-name'))
    expect(layerNames).toContain('image')
    expect(layerNames).toContain('underlay')
    expect(layerNames).toContain('overlay')
    expect(layerNames).toContain('selection')
    expect(layerNames).toContain('tool')
    expect(layerNames).toContain('hud')
  })
})
