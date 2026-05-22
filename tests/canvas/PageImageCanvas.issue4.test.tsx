/**
 * Tests for issue #4: expose pointer-events slot for multi-mode drag interception.
 *
 * Verifies that onStagePointerDown, onStagePointerMove, onStagePointerUp props
 * are accepted and fire with the CoordContext so consumers can attach custom
 * drag handlers without needing an out-of-band overlay div.
 *
 * react-konva is mocked (jsdom can't run canvas renderer).
 */
import { describe, it, expect, vi } from 'vitest'
import { render, act } from '@testing-library/react'
import React from 'react'

// Capture Stage event handlers to simulate pointer events.
type StageEventHandler = (e: {
  target: {
    getStage: () => {
      getPointerPosition: () => { x: number; y: number } | null
    } | null
  }
}) => void

let capturedMouseDown: StageEventHandler | undefined
let capturedMouseMove: StageEventHandler | undefined
let capturedMouseUp: StageEventHandler | undefined

vi.mock('react-konva', () => ({
  Stage: ({
    children,
    width,
    height,
    'data-testid': tid,
    onMouseDown,
    onMouseMove,
    onMouseUp,
    onMouseLeave,
  }: {
    children?: React.ReactNode
    width?: number
    height?: number
    'data-testid'?: string
    onMouseDown?: StageEventHandler
    onMouseMove?: StageEventHandler
    onMouseUp?: StageEventHandler
    onMouseLeave?: () => void
  }) => {
    // Capture handlers for test simulation.
    capturedMouseDown = onMouseDown
    capturedMouseMove = onMouseMove
    capturedMouseUp = onMouseUp
    return (
      <div data-testid={tid ?? 'konva-stage'} data-width={width} data-height={height}>
        {children}
      </div>
    )
  },
  Layer: ({ children, name }: { children?: React.ReactNode; name?: string }) => (
    <div data-layer-name={name}>{children}</div>
  ),
  Rect: () => <div data-testid="konva-rect" />,
  Image: () => <div data-testid="konva-image" />,
}))

import { PageImageCanvas } from '../../src/canvas/PageImageCanvas'
import type { CoordContext } from '../../src/canvas/types'

const PAGE = { width: 400, height: 300 }
const WORDS: Array<{ bounding_box: { top_left: { x: number; y: number }; bottom_right: { x: number; y: number } }; text: string }> = []

/** Build a fake KonvaEventObject with a pointer position. */
function fakeEvent(x: number, y: number) {
  return {
    target: {
      getStage: () => ({
        getPointerPosition: () => ({ x, y }),
      }),
    },
  }
}

describe('PageImageCanvas — pointer-events stage callbacks (#4)', () => {
  beforeEach(() => {
    capturedMouseDown = undefined
    capturedMouseMove = undefined
    capturedMouseUp = undefined
  })

  it('renders without error when pointer callbacks are not provided', () => {
    expect(() => {
      render(<PageImageCanvas src="test.png" page={PAGE} words={WORDS} />)
    }).not.toThrow()
  })

  it('accepts onStagePointerDown prop without TypeScript error', () => {
    const onDown = vi.fn()
    expect(() => {
      render(
        <PageImageCanvas
          src="test.png"
          page={PAGE}
          words={WORDS}
          onStagePointerDown={onDown}
        />,
      )
    }).not.toThrow()
  })

  it('fires onStagePointerDown with (e, CoordContext) when stage fires mousedown', () => {
    const onDown = vi.fn()
    render(
      <PageImageCanvas
        src="test.png"
        page={PAGE}
        words={WORDS}
        onStagePointerDown={onDown}
      />,
    )
    act(() => {
      capturedMouseDown?.(fakeEvent(100, 80))
    })
    expect(onDown).toHaveBeenCalledOnce()
    // Second arg is CoordContext
    const [, ctx] = onDown.mock.calls[0] as [unknown, CoordContext]
    expect(ctx).toHaveProperty('scale')
    expect(ctx).toHaveProperty('pageWidth', 400)
    expect(ctx).toHaveProperty('pageHeight', 300)
  })

  it('fires onStagePointerMove with (e, CoordContext) when stage fires mousemove', () => {
    const onMove = vi.fn()
    render(
      <PageImageCanvas
        src="test.png"
        page={PAGE}
        words={WORDS}
        onStagePointerMove={onMove}
      />,
    )
    act(() => {
      capturedMouseMove?.(fakeEvent(150, 90))
    })
    expect(onMove).toHaveBeenCalledOnce()
    const [, ctx] = onMove.mock.calls[0] as [unknown, CoordContext]
    expect(ctx).toHaveProperty('pageWidth', 400)
  })

  it('fires onStagePointerUp with (e, CoordContext) when stage fires mouseup', () => {
    const onUp = vi.fn()
    render(
      <PageImageCanvas
        src="test.png"
        page={PAGE}
        words={WORDS}
        onStagePointerUp={onUp}
      />,
    )
    act(() => {
      capturedMouseUp?.(fakeEvent(200, 100))
    })
    expect(onUp).toHaveBeenCalledOnce()
    const [, ctx] = onUp.mock.calls[0] as [unknown, CoordContext]
    expect(ctx).toHaveProperty('pageWidth', 400)
  })

  it('does not fire pointer callbacks when props are undefined', () => {
    const onDown = vi.fn()
    render(<PageImageCanvas src="test.png" page={PAGE} words={WORDS} />)
    act(() => {
      capturedMouseDown?.(fakeEvent(10, 20))
    })
    expect(onDown).not.toHaveBeenCalled()
  })
})
