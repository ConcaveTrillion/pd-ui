/**
 * Type-level tests for WordList API types (M6.1, issue #150).
 *
 * Verifies that generic TWord constraints flow through render-prop types,
 * and that MatchStatus / WordRowProps / WordListProps are correctly typed.
 */

import type { ReactNode } from 'react'
import type {
  MatchStatus,
  WordRowProps,
  WordListProps,
} from '../../src/worklist/types'

// ── MatchStatus ───────────────────────────────────────────────────────────────

// MatchStatus must include at least these four variants
const _exact: MatchStatus = 'exact'
const _fuzzy: MatchStatus = 'fuzzy'
const _mismatch: MatchStatus = 'mismatch'
const _none: MatchStatus = 'none'
void _exact; void _fuzzy; void _mismatch; void _none

// ── Custom TWord flows through WordRowProps ───────────────────────────────────

interface CustomWord {
  text: string
  ocr_confidence?: number | null
  bounding_box: { top_left: { x: number; y: number }; bottom_right: { x: number; y: number } }
  customField: string
}

// WordRowProps<CustomWord> must expose the custom field on `item`
type _RowProps = WordRowProps<CustomWord>
const _rowTest: _RowProps = {
  item: { text: 'hello', bounding_box: { top_left: { x: 0, y: 0 }, bottom_right: { x: 1, y: 1 } }, customField: 'test' },
  index: 0,
  isSelected: false,
  matchStatus: 'exact',
}
// Access custom field — must not error
const _cf: string = _rowTest.item.customField
void _cf

// ── WordListProps renderRow slot ──────────────────────────────────────────────

type _ListProps = WordListProps<CustomWord>

// renderRow must accept WordRowProps<CustomWord> and return ReactNode
const _minimalList: _ListProps = {
  items: [],
  renderRow: (p: WordRowProps<CustomWord>): ReactNode => p.item.text,
}
void _minimalList

// renderRow is optional
const _noRenderRow: _ListProps = {
  items: [],
}
void _noRenderRow

// onSelect callback typing
const _withOnSelect: _ListProps = {
  items: [],
  onSelect: (idx: number) => { void idx },
}
void _withOnSelect
