/**
 * <WordList> — virtualized, keyboard-navigable word review panel.
 *
 * Uses react-virtuoso for DOM-windowing (matches pd-ui peerDependency).
 *
 * Render-prop API (spec §6):
 *   renderRow={(p) => <MyRow word={p.item} selected={p.isSelected} />}
 *
 * Keyboard navigation:
 *   ArrowDown → select next (clamped at last item)
 *   ArrowUp   → select prev (clamped at 0)
 *   Enter     → confirm current selection (re-calls onSelect)
 *
 * When `selectedIndex` is provided (controlled mode), selection changes
 * are propagated via `onSelect`. When omitted, the list manages selection
 * internally.
 */

import * as React from 'react'
import { Virtuoso } from 'react-virtuoso'
import type {
  WordListProps,
  WordListItem,
  WordRowProps,
  MatchStatus,
} from './types'

// ── default row renderer ──────────────────────────────────────────────────────

function DefaultWordRow<TWord extends WordListItem>({
  item,
  isSelected,
  matchStatus,
}: WordRowProps<TWord>) {
  return (
    <div
      className={`word-list-row${isSelected ? ' word-list-row--selected' : ''} word-list-row--${matchStatus}`}
      style={{
        padding: 'var(--space-1) var(--space-2)',
        background: isSelected
          ? 'color-mix(in srgb, var(--accent) 15%, var(--bg-raised))'
          : 'transparent',
        fontFamily: 'var(--font-mono)',
        fontSize: 'var(--text-sm)',
        color: 'var(--ink-1)',
        cursor: 'pointer',
        userSelect: 'none',
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
      }}
    >
      {item.text}
    </div>
  )
}

// ── <WordList> ────────────────────────────────────────────────────────────────

function WordListInner<TWord extends WordListItem = WordListItem>(
  {
    items,
    renderRow,
    getMatchStatus,
    selectedIndex: controlledSelectedIndex,
    onSelect,
    'aria-label': ariaLabel = 'Word list',
    className,
  }: WordListProps<TWord>,
  ref: React.ForwardedRef<HTMLDivElement>,
) {
  // Internal selection state for uncontrolled mode
  const [internalIndex, setInternalIndex] = React.useState<number | null>(null)

  const isControlled = controlledSelectedIndex !== undefined
  const selectedIndex = isControlled ? controlledSelectedIndex : internalIndex

  const resolveMatchStatus = React.useCallback(
    (item: TWord): MatchStatus => {
      return getMatchStatus ? getMatchStatus(item) : 'none'
    },
    [getMatchStatus],
  )

  const handleSelect = React.useCallback(
    (idx: number) => {
      if (!isControlled) {
        setInternalIndex(idx)
      }
      onSelect?.(idx)
    },
    [isControlled, onSelect],
  )

  const handleKeyDown = React.useCallback(
    (e: React.KeyboardEvent<HTMLDivElement>) => {
      if (items.length === 0) return

      if (e.key === 'ArrowDown') {
        e.preventDefault()
        const current = selectedIndex ?? -1
        if (current < items.length - 1) {
          handleSelect(current + 1)
        }
      } else if (e.key === 'ArrowUp') {
        e.preventDefault()
        const current = selectedIndex ?? 0
        if (current > 0) {
          handleSelect(current - 1)
        }
      } else if (e.key === 'Enter') {
        e.preventDefault()
        if (selectedIndex !== null && selectedIndex !== undefined) {
          handleSelect(selectedIndex)
        }
      }
    },
    [items.length, selectedIndex, handleSelect],
  )

  const renderItem = React.useCallback(
    (index: number, item: TWord) => {
      const isSelected = selectedIndex === index
      const matchStatus = resolveMatchStatus(item)
      const rowProps: WordRowProps<TWord> = { item, index, isSelected, matchStatus }

      const content = renderRow ? renderRow(rowProps) : (
        <DefaultWordRow<TWord>
          item={item}
          index={index}
          isSelected={isSelected}
          matchStatus={matchStatus}
        />
      )

      return (
        <div
          key={index}
          role="option"
          aria-selected={isSelected}
          tabIndex={0}
          onClick={() => { handleSelect(index) }}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault()
              handleSelect(index)
            }
          }}
          style={{ cursor: 'pointer' }}
        >
          {content}
        </div>
      )
    },
    [selectedIndex, resolveMatchStatus, renderRow, handleSelect],
  )

  return (
    <div
      ref={ref}
      role="listbox"
      aria-label={ariaLabel}
      tabIndex={0}
      onKeyDown={handleKeyDown}
      className={`word-list${className ? ` ${className}` : ''}`}
      style={{
        outline: 'none',
        height: '100%',
        minHeight: 0,
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <Virtuoso<TWord>
        data={items}
        itemContent={renderItem}
        style={{ flex: 1 }}
      />
    </div>
  )
}

/**
 * <WordList> — virtualized word review panel with render-prop rows.
 *
 * Forwards a ref to the outer container div for scroll control.
 */
export const WordList = React.forwardRef(WordListInner) as <
  TWord extends WordListItem = WordListItem,
>(
  props: WordListProps<TWord> & { ref?: React.Ref<HTMLDivElement> },
) => React.ReactElement | null

// Cast forwardRef output to generic function signature while preserving displayName
;(WordList as { displayName?: string }).displayName = 'WordList'
