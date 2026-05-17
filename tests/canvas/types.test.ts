/**
 * Tests for canvas slot API types (M5.1).
 *
 * Verifies bboxToRect conversion and type shape expectations.
 */

import { describe, it, expect } from 'vitest'
import { bboxToRect } from '../../src/canvas/types'

describe('bboxToRect', () => {
  it('converts a valid bounding_box to a CanvasRect', () => {
    const bb = {
      top_left: { x: 10, y: 20 },
      bottom_right: { x: 110, y: 70 },
    }
    const rect = bboxToRect(bb)
    expect(rect).toEqual({ x: 10, y: 20, width: 100, height: 50 })
  })

  it('returns null for null bounding_box', () => {
    expect(bboxToRect(null)).toBeNull()
  })

  it('returns null for undefined bounding_box', () => {
    expect(bboxToRect(undefined)).toBeNull()
  })

  it('handles zero-size bbox', () => {
    const bb = {
      top_left: { x: 5, y: 5 },
      bottom_right: { x: 5, y: 5 },
    }
    const rect = bboxToRect(bb)
    expect(rect).toEqual({ x: 5, y: 5, width: 0, height: 0 })
  })

  it('handles bbox with fractional coordinates', () => {
    const bb = {
      top_left: { x: 0.5, y: 1.25 },
      bottom_right: { x: 10.75, y: 20.5 },
    }
    const rect = bboxToRect(bb)
    expect(rect).toEqual({ x: 0.5, y: 1.25, width: 10.25, height: 19.25 })
  })
})

describe('canvas types file shape', () => {
  it('exports bboxToRect as a function', () => {
    expect(typeof bboxToRect).toBe('function')
  })
})
