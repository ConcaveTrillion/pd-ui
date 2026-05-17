/**
 * Tests for useWorklistSort hook (M6.5, issue #154).
 */

import { describe, it, expect } from 'vitest'
import { renderHook } from '@testing-library/react'
import { useWorklistSort } from './useWorklistSort'
import type { WordListItem } from '../types'

function makeWord(text: string, confidence?: number | null): WordListItem {
  return {
    text,
    ocr_confidence: confidence,
    bounding_box: {
      top_left: { x: 0, y: 0 },
      bottom_right: { x: 10, y: 5 },
    },
  }
}

const WORDS: WordListItem[] = [
  makeWord('gamma', 0.3),
  makeWord('alpha', 0.95),
  makeWord('beta', 0.6),
  makeWord('delta', null),
]

describe('useWorklistSort', () => {
  it('returns items in original order for sortKey "index"', () => {
    const { result } = renderHook(() =>
      useWorklistSort(WORDS, 'index'),
    )
    expect(result.current.map((w) => w.text)).toEqual(['gamma', 'alpha', 'beta', 'delta'])
  })

  it('sorts by confidence descending for sortKey "confidence"', () => {
    const { result } = renderHook(() =>
      useWorklistSort(WORDS, 'confidence'),
    )
    const texts = result.current.map((w) => w.text)
    // alpha (0.95), beta (0.6), gamma (0.3), delta (null — last)
    expect(texts[0]).toBe('alpha')
    expect(texts[1]).toBe('beta')
    expect(texts[2]).toBe('gamma')
    expect(texts[3]).toBe('delta')
  })

  it('sorts alphabetically for sortKey "text"', () => {
    const { result } = renderHook(() =>
      useWorklistSort(WORDS, 'text'),
    )
    const texts = result.current.map((w) => w.text)
    expect(texts).toEqual(['alpha', 'beta', 'delta', 'gamma'])
  })

  it('does not mutate the input array', () => {
    const original = [...WORDS]
    renderHook(() => useWorklistSort(WORDS, 'text'))
    expect(WORDS.map((w) => w.text)).toEqual(original.map((w) => w.text))
  })

  it('memoizes result — returns same reference when inputs unchanged', () => {
    const { result, rerender } = renderHook(
      ({ words, key }) => useWorklistSort(words, key),
      { initialProps: { words: WORDS, key: 'index' as const } },
    )
    const first = result.current
    rerender({ words: WORDS, key: 'index' })
    expect(result.current).toBe(first)
  })
})
