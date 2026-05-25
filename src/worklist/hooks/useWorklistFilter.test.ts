/**
 * Tests for useWorklistFilter hook (M6.5, issue #154).
 */

import { describe, it, expect } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useWorklistFilter } from './useWorklistFilter';
import type { WordListItem, MatchStatus } from '../types';

function makeWord(text: string, confidence: number | null | undefined): WordListItem {
  return {
    text,
    ocr_confidence: confidence,
    bounding_box: {
      top_left: { x: 0, y: 0 },
      bottom_right: { x: 10, y: 5 },
    },
  };
}

const WORDS: WordListItem[] = [
  makeWord('alpha', 0.95),
  makeWord('beta', 0.6),
  makeWord('gamma', 0.3),
  makeWord('delta', null),
  makeWord('epsilon', undefined),
];

const STATUS_MAP: Record<string, MatchStatus> = {
  alpha: 'exact',
  beta: 'fuzzy',
  gamma: 'mismatch',
  delta: 'none',
  epsilon: 'none',
};

describe('useWorklistFilter', () => {
  it('returns all items when no filter specified', () => {
    const { result } = renderHook(() => useWorklistFilter(WORDS, {}, () => 'none'));
    expect(result.current).toHaveLength(WORDS.length);
  });

  it('filters by matchStatus', () => {
    const { result } = renderHook(() =>
      useWorklistFilter(WORDS, { matchStatus: 'exact' }, (w) => STATUS_MAP[w.text] ?? 'none'),
    );
    expect(result.current).toHaveLength(1);
    expect(result.current[0]?.text).toBe('alpha');
  });

  it('filters by multiple matchStatus values', () => {
    const { result } = renderHook(() =>
      useWorklistFilter(
        WORDS,
        { matchStatus: ['exact', 'fuzzy'] },
        (w) => STATUS_MAP[w.text] ?? 'none',
      ),
    );
    expect(result.current).toHaveLength(2);
    const texts = result.current.map((w) => w.text);
    expect(texts).toContain('alpha');
    expect(texts).toContain('beta');
  });

  it('filters by searchQuery (case-insensitive)', () => {
    const { result } = renderHook(() =>
      useWorklistFilter(WORDS, { searchQuery: 'ETA' }, () => 'none'),
    );
    expect(result.current).toHaveLength(1);
    expect(result.current[0]?.text).toBe('beta');
  });

  it('returns empty array when no matches', () => {
    const { result } = renderHook(() =>
      useWorklistFilter(WORDS, { searchQuery: 'zzz' }, () => 'none'),
    );
    expect(result.current).toHaveLength(0);
  });

  it('filters by minimum confidence', () => {
    const { result } = renderHook(() =>
      useWorklistFilter(WORDS, { minConfidence: 0.7 }, () => 'none'),
    );
    // alpha (0.95) and beta (0.6 — below 0.7 so excluded) and gamma (0.3)
    // Only alpha passes
    expect(result.current).toHaveLength(1);
    expect(result.current[0]?.text).toBe('alpha');
  });

  it('memoizes result — returns same reference when inputs unchanged', () => {
    const filter = { matchStatus: 'exact' as MatchStatus };
    const getStatus = (w: WordListItem) => STATUS_MAP[w.text] ?? 'none';
    const { result, rerender } = renderHook(({ words, f, gs }) => useWorklistFilter(words, f, gs), {
      initialProps: { words: WORDS, f: filter, gs: getStatus },
    });
    const first = result.current;
    rerender({ words: WORDS, f: filter, gs: getStatus });
    expect(result.current).toBe(first);
  });
});
