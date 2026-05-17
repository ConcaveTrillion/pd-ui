/**
 * useWorklistSort — memoized sort for WordList items.
 *
 * Sort keys:
 *   - `"index"`      — original array order (no-op, returns original array).
 *   - `"confidence"` — descending `ocr_confidence`; null/undefined sort last.
 *   - `"text"`       — ascending alphabetical on `item.text`.
 *
 * The hook never mutates the input array.
 * Memoizes result — re-sorts only when `items` or `sortKey` changes.
 */

import { useMemo } from 'react'
import type { WordListItem } from '../types'

export type WorklistSortKey = 'index' | 'confidence' | 'text'

/**
 * Memoized hook that sorts `items` by `sortKey`.
 *
 * @param items   - Array of word-like items to sort.
 * @param sortKey - Sort key; defaults to `"index"` (original order).
 * @returns Sorted array (new reference only when output changes).
 */
export function useWorklistSort<TItem extends WordListItem>(
  items: TItem[],
  sortKey: WorklistSortKey = 'index',
): TItem[] {
  return useMemo(() => {
    if (sortKey === 'index') return items

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const sorted = [...items].sort((a: any, b: any) => {
      if (sortKey === 'confidence') {
        const ca: number | null | undefined = (a as WordListItem).ocr_confidence
        const cb: number | null | undefined = (b as WordListItem).ocr_confidence
        if (ca == null && cb == null) return 0
        if (ca == null) return 1
        if (cb == null) return -1
        return cb - ca
      }
      // 'text'
      const ta: string = (a as WordListItem).text
      const tb: string = (b as WordListItem).text
      return ta.localeCompare(tb)
    })
    return sorted
  }, [items, sortKey])
}
