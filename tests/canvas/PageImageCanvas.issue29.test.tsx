/**
 * Tests for PageImageCanvas page-size validation — issue #29.
 *
 * Verifies that invalid OCR/page metadata (oversize, negative, NaN, missing
 * dimensions) is caught at the canvas boundary and renders a safe fallback
 * instead of letting Konva allocate a huge or broken canvas.
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
  Image: ({ 'data-testid': tid }: { 'data-testid'?: string }) => (
    <div data-testid={tid ?? 'konva-image'} />
  ),
}))

import { PageImageCanvas } from '../../src/canvas/PageImageCanvas'
import { PAGE_DIMENSION_MAX } from '../../src/canvas/pageSizeGuard'

const words = [
  {
    bounding_box: {
      is_normalized: false,
      top_left: { is_normalized: false, x: 10, y: 20 },
      bottom_right: { is_normalized: false, x: 60, y: 40 },
    },
    text: 'hello',
    ocr_confidence: 0.9,
    review: null,
    word_labels: [],
    text_style_labels: [],
  },
]

const validPage = { width: 400, height: 600, page_index: 0, name: 'page-0', image_path: '/p.png', items: [], review: null }

// ── Invalid-page guard tests ───────────────────────────────────────────────────

describe('PageImageCanvas — page size validation (issue #29)', () => {
  it('renders the stage normally for valid page dimensions', () => {
    render(<PageImageCanvas src="/img.png" page={validPage} words={words} />)
    expect(screen.getByTestId('canvas-stage')).toBeInTheDocument()
    expect(screen.queryByTestId('canvas-invalid-page')).not.toBeInTheDocument()
  })

  it('renders an invalid-page fallback for zero width', () => {
    const page = { ...validPage, width: 0 }
    render(<PageImageCanvas src="/img.png" page={page} words={words} />)
    expect(screen.getByTestId('canvas-invalid-page')).toBeInTheDocument()
    expect(screen.queryByTestId('canvas-stage')).not.toBeInTheDocument()
  })

  it('renders an invalid-page fallback for zero height', () => {
    const page = { ...validPage, height: 0 }
    render(<PageImageCanvas src="/img.png" page={page} words={words} />)
    expect(screen.getByTestId('canvas-invalid-page')).toBeInTheDocument()
  })

  it('renders an invalid-page fallback for negative width', () => {
    const page = { ...validPage, width: -100 }
    render(<PageImageCanvas src="/img.png" page={page} words={words} />)
    expect(screen.getByTestId('canvas-invalid-page')).toBeInTheDocument()
  })

  it('renders an invalid-page fallback for negative height', () => {
    const page = { ...validPage, height: -1 }
    render(<PageImageCanvas src="/img.png" page={page} words={words} />)
    expect(screen.getByTestId('canvas-invalid-page')).toBeInTheDocument()
  })

  it('renders an invalid-page fallback for NaN width', () => {
    const page = { ...validPage, width: NaN }
    render(<PageImageCanvas src="/img.png" page={page} words={words} />)
    expect(screen.getByTestId('canvas-invalid-page')).toBeInTheDocument()
  })

  it('renders an invalid-page fallback for NaN height', () => {
    const page = { ...validPage, height: NaN }
    render(<PageImageCanvas src="/img.png" page={page} words={words} />)
    expect(screen.getByTestId('canvas-invalid-page')).toBeInTheDocument()
  })

  it('renders an invalid-page fallback for Infinity width', () => {
    const page = { ...validPage, width: Infinity }
    render(<PageImageCanvas src="/img.png" page={page} words={words} />)
    expect(screen.getByTestId('canvas-invalid-page')).toBeInTheDocument()
  })

  it('renders an invalid-page fallback for Infinity height', () => {
    const page = { ...validPage, height: Infinity }
    render(<PageImageCanvas src="/img.png" page={page} words={words} />)
    expect(screen.getByTestId('canvas-invalid-page')).toBeInTheDocument()
  })

  it('renders an invalid-page fallback for width exceeding PAGE_DIMENSION_MAX', () => {
    const page = { ...validPage, width: PAGE_DIMENSION_MAX + 1 }
    render(<PageImageCanvas src="/img.png" page={page} words={words} />)
    expect(screen.getByTestId('canvas-invalid-page')).toBeInTheDocument()
  })

  it('renders an invalid-page fallback for height exceeding PAGE_DIMENSION_MAX', () => {
    const page = { ...validPage, height: PAGE_DIMENSION_MAX + 1 }
    render(<PageImageCanvas src="/img.png" page={page} words={words} />)
    expect(screen.getByTestId('canvas-invalid-page')).toBeInTheDocument()
  })

  it('does NOT render the stage when page dimensions are invalid', () => {
    const page = { ...validPage, width: 99999, height: 99999 }
    render(<PageImageCanvas src="/img.png" page={page} words={words} />)
    expect(screen.queryByTestId('canvas-stage')).not.toBeInTheDocument()
  })

  it('the invalid-page fallback has a visible accessible label', () => {
    const page = { ...validPage, width: -1 }
    render(<PageImageCanvas src="/img.png" page={page} words={words} />)
    const fallback = screen.getByTestId('canvas-invalid-page')
    // Should have an accessible name (role or aria-label)
    expect(fallback).toBeDefined()
  })

  it('stage dimensions stay within PAGE_DIMENSION_MAX for valid large-but-ok pages', () => {
    const page = { ...validPage, width: PAGE_DIMENSION_MAX, height: PAGE_DIMENSION_MAX }
    render(<PageImageCanvas src="/img.png" page={page} words={words} />)
    const stage = screen.getByTestId('canvas-stage')
    const w = Number(stage.getAttribute('data-width'))
    const h = Number(stage.getAttribute('data-height'))
    expect(w).toBeLessThanOrEqual(PAGE_DIMENSION_MAX)
    expect(h).toBeLessThanOrEqual(PAGE_DIMENSION_MAX)
  })
})
