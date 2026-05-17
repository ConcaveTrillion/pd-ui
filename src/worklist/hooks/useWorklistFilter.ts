/**
 * useWorklistFilter — memoized filter predicate for WordList / LineList items.
 *
 * Returns a filtered subset of `items` based on:
 *   - `matchStatus`: single status string or array of status strings
 *   - `searchQuery`: case-insensitive substring match on item.text
 *   - `minConfidence`: minimum `ocr_confidence` (items with null/undefined are excluded)
 *
 * When no filter criteria are provided, returns the original `items` array
 * (same reference) — no re-allocation.
 *
 * `getMatchStatus` is required to derive the status for each item; callers
 * should memoize the function reference (e.g. `useCallback`) to preserve
 * the memoized result across renders.
 */

import { useMemo } from 'react'
import type { WordListItem, MatchStatus } from '../types'

export interface WorklistFilterOptions {
  /**
   * Filter to items with this match status.
   * Pass a single string or an array of strings for multi-status filter.
   * When omitted, all statuses pass.
   */
  matchStatus?: MatchStatus | MatchStatus[] | undefined
  /**
   * Case-insensitive substring match on `item.text`.
   * Empty string / omitted = no text filter.
   */
  searchQuery?: string | undefined
  /**
   * Minimum `ocr_confidence` value (inclusive).
   * Items with `null` or `undefined` confidence are excluded when set.
   */
  minConfidence?: number | undefined
}

/**
 * Memoized hook that filters `items` by the given `options`.
 *
 * @param items      - Array of word-like items to filter.
 * @param options    - Filter criteria.
 * @param getMatchStatus - Derives `MatchStatus` for each item.
 * @returns Filtered array (new reference only when output changes).
 */
export function useWorklistFilter<TItem extends WordListItem>(
  items: TItem[],
  options: WorklistFilterOptions,
  getMatchStatus: (item: TItem) => MatchStatus,
): TItem[] {
  const { matchStatus, searchQuery, minConfidence } = options

  return useMemo(() => {
    const statusSet: ReadonlySet<MatchStatus> | null = matchStatus == null
      ? null
      : new Set(Array.isArray(matchStatus) ? matchStatus : [matchStatus])

    const queryLower = searchQuery ? searchQuery.toLowerCase() : null
    const minConf = minConfidence ?? null

    // Fast path: no criteria at all
    if (statusSet === null && queryLower === null && minConf === null) {
      return items
    }

    return items.filter((item) => {
      if (statusSet !== null) {
        const status = getMatchStatus(item)
        if (!statusSet.has(status)) return false
      }

      if (queryLower !== null) {
        if (!item.text.toLowerCase().includes(queryLower)) return false
      }

      if (minConf !== null) {
        const conf = item.ocr_confidence
        if (conf == null || conf < minConf) return false
      }

      return true
    })
  }, [items, matchStatus, searchQuery, minConfidence, getMatchStatus])
}
