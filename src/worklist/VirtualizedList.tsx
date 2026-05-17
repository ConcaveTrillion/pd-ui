/**
 * VirtualizedList — generic internal base for WordList, LineList, PageList.
 *
 * Shared keyboard navigation + virtuoso rendering machinery.
 * Not exported from the worklist barrel — internal use only.
 */

import * as React from 'react'
import { Virtuoso } from 'react-virtuoso'

export interface VirtualizedListProps<TItem> {
  items: TItem[]
  selectedIndex?: number | null | undefined
  onSelect?: ((index: number) => void) | undefined
  'aria-label'?: string | undefined
  className?: string | undefined
  renderItem: (item: TItem, index: number, isSelected: boolean) => React.ReactNode
  defaultAriaLabel: string
}

function VirtualizedListInner<TItem>(
  {
    items,
    selectedIndex: controlledSelectedIndex,
    onSelect,
    'aria-label': ariaLabel,
    className,
    renderItem,
    defaultAriaLabel,
  }: VirtualizedListProps<TItem>,
  ref: React.ForwardedRef<HTMLDivElement>,
) {
  const [internalIndex, setInternalIndex] = React.useState<number | null>(null)

  const isControlled = controlledSelectedIndex !== undefined
  const selectedIndex = isControlled ? controlledSelectedIndex : internalIndex

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

  const renderRow = React.useCallback(
    (index: number, item: TItem) => {
      const isSelected = selectedIndex === index
      const content = renderItem(item, index, isSelected)

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
    [selectedIndex, renderItem, handleSelect],
  )

  return (
    <div
      ref={ref}
      role="listbox"
      aria-label={ariaLabel ?? defaultAriaLabel}
      tabIndex={0}
      onKeyDown={handleKeyDown}
      className={`virtualized-list${className ? ` ${className}` : ''}`}
      style={{
        outline: 'none',
        height: '100%',
        minHeight: 0,
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <Virtuoso<TItem>
        data={items}
        itemContent={renderRow}
        style={{ flex: 1 }}
      />
    </div>
  )
}

// Cast forwardRef output to generic function signature
export const VirtualizedList = React.forwardRef(VirtualizedListInner) as <TItem>(
  props: VirtualizedListProps<TItem> & { ref?: React.Ref<HTMLDivElement> },
) => React.ReactElement | null
