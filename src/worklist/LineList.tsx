/**
 * <LineList> — virtualized block/line review panel.
 *
 * Thin shell over VirtualizedList parameterized with BlockListItem.
 * Accepts a `renderRow` render-prop for custom row content.
 *
 * Phase 1: line-level review panels use this to display Block items
 * (filtered to block_category === 'LINE', 'PARAGRAPH', etc. by the caller).
 */

import * as React from 'react'
import { VirtualizedList } from './VirtualizedList'
import type { LineListProps, BlockListItem, BlockRowProps } from './types'

// ── default row renderer ──────────────────────────────────────────────────────

function DefaultBlockRow<TBlock extends BlockListItem>({
  item,
  isSelected,
}: BlockRowProps<TBlock>) {
  return (
    <div
      className={`line-list-row${isSelected ? ' line-list-row--selected' : ''}`}
      style={{
        padding: 'var(--space-1) var(--space-2)',
        background: isSelected
          ? 'color-mix(in srgb, var(--accent) 15%, var(--bg-raised))'
          : 'transparent',
        fontSize: 'var(--text-sm)',
        color: 'var(--ink-1)',
        userSelect: 'none',
      }}
    >
      {item.block_category ?? 'BLOCK'}
    </div>
  )
}

// ── <LineList> ────────────────────────────────────────────────────────────────

function LineListInner<TBlock extends BlockListItem = BlockListItem>(
  {
    items,
    renderRow,
    selectedIndex,
    onSelect,
    'aria-label': ariaLabel,
    className,
  }: LineListProps<TBlock>,
  ref: React.ForwardedRef<HTMLDivElement>,
) {
  const renderItem = React.useCallback(
    (item: TBlock, index: number, isSelected: boolean) => {
      const rowProps: BlockRowProps<TBlock> = { item, index, isSelected }
      return renderRow
        ? renderRow(rowProps)
        : <DefaultBlockRow<TBlock> item={item} index={index} isSelected={isSelected} />
    },
    [renderRow],
  )

  return (
    <VirtualizedList<TBlock>
      ref={ref}
      items={items}
      selectedIndex={selectedIndex}
      onSelect={onSelect}
      aria-label={ariaLabel}
      className={className}
      renderItem={renderItem}
      defaultAriaLabel="Line list"
    />
  )
}

/**
 * <LineList> — virtualized block/line panel with render-prop rows.
 * Forwards a ref to the outer container div.
 */
export const LineList = React.forwardRef(LineListInner) as <
  TBlock extends BlockListItem = BlockListItem,
>(
  props: LineListProps<TBlock> & { ref?: React.Ref<HTMLDivElement> },
) => React.ReactElement | null

;(LineList as { displayName?: string }).displayName = 'LineList'
