/**
 * <PageList> — virtualized page review panel.
 *
 * Thin shell over VirtualizedList parameterized with PageListItem.
 * Accepts a `renderRow` render-prop for custom row content.
 */

import * as React from 'react'
import { VirtualizedList } from './VirtualizedList'
import type { PageListProps, PageListItem, PageRowProps } from './types'

// ── default row renderer ──────────────────────────────────────────────────────

function DefaultPageRow<TPage extends PageListItem>({
  item,
  index,
  isSelected,
}: PageRowProps<TPage>) {
  const label = item.name ?? `Page ${(item.page_index ?? index) + 1}`
  return (
    <div
      className={`page-list-row${isSelected ? ' page-list-row--selected' : ''}`}
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
      {label}
    </div>
  )
}

// ── <PageList> ────────────────────────────────────────────────────────────────

function PageListInner<TPage extends PageListItem = PageListItem>(
  {
    items,
    renderRow,
    selectedIndex,
    onSelect,
    'aria-label': ariaLabel,
    className,
  }: PageListProps<TPage>,
  ref: React.ForwardedRef<HTMLDivElement>,
) {
  const renderItem = React.useCallback(
    (item: TPage, index: number, isSelected: boolean) => {
      const rowProps: PageRowProps<TPage> = { item, index, isSelected }
      return renderRow
        ? renderRow(rowProps)
        : <DefaultPageRow<TPage> item={item} index={index} isSelected={isSelected} />
    },
    [renderRow],
  )

  return (
    <VirtualizedList<TPage>
      ref={ref}
      items={items}
      selectedIndex={selectedIndex}
      onSelect={onSelect}
      aria-label={ariaLabel}
      className={className}
      renderItem={renderItem}
      defaultAriaLabel="Page list"
    />
  )
}

/**
 * <PageList> — virtualized page panel with render-prop rows.
 * Forwards a ref to the outer container div.
 */
export const PageList = React.forwardRef(PageListInner) as <
  TPage extends PageListItem = PageListItem,
>(
  props: PageListProps<TPage> & { ref?: React.Ref<HTMLDivElement> },
) => React.ReactElement | null

;(PageList as { displayName?: string }).displayName = 'PageList'
