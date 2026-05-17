/**
 * Tests for <LineList> (M6.3, issue #152).
 *
 * Verifies basic render, render-prop, and selection for LineList.
 *
 * react-virtuoso is mocked.
 */

import * as React from 'react'
import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'

vi.mock('react-virtuoso', () => ({
  Virtuoso: <TData,>({
    data,
    itemContent,
  }: {
    data?: TData[]
    itemContent?: (index: number, item: TData) => React.ReactNode
  }) => (
    <div data-testid="virtuoso-mock">
      {(data ?? []).map((item, index) => (
        <div key={index}>{itemContent?.(index, item)}</div>
      ))}
    </div>
  ),
}))

import { LineList } from './LineList'
import type { BlockListItem, BlockRowProps } from './types'

const THREE_BLOCKS: BlockListItem[] = [
  { block_category: 'LINE', bounding_box: { top_left: { x: 0, y: 0 }, bottom_right: { x: 10, y: 5 } } },
  { block_category: 'LINE', bounding_box: { top_left: { x: 0, y: 10 }, bottom_right: { x: 10, y: 15 } } },
  { block_category: 'PARAGRAPH', bounding_box: { top_left: { x: 0, y: 20 }, bottom_right: { x: 10, y: 40 } } },
]

describe('<LineList>', () => {
  it('renders with default row', () => {
    render(<LineList items={THREE_BLOCKS} />)
    const list = screen.getByRole('listbox')
    expect(list).toBeDefined()
  })

  it('renders with aria-label', () => {
    render(<LineList items={THREE_BLOCKS} aria-label="Line list" />)
    expect(screen.getByRole('listbox', { name: 'Line list' })).toBeDefined()
  })

  it('renders custom renderRow', () => {
    render(
      <LineList
        items={THREE_BLOCKS}
        renderRow={(p: BlockRowProps<BlockListItem>) => (
          <span key={p.index} data-testid={`block-${p.index}`}>
            block:{p.item.block_category ?? 'none'}:{p.index}
          </span>
        )}
      />,
    )
    expect(screen.getByText('block:LINE:0')).toBeDefined()
    expect(screen.getByText('block:LINE:1')).toBeDefined()
    expect(screen.getByText('block:PARAGRAPH:2')).toBeDefined()
  })

  it('passes isSelected=true for selectedIndex', () => {
    render(
      <LineList
        items={THREE_BLOCKS}
        selectedIndex={1}
        renderRow={(p: BlockRowProps<BlockListItem>) => (
          <span key={p.index}>{p.isSelected ? 'SEL' : 'NO'}:{p.index}</span>
        )}
      />,
    )
    expect(screen.getByText('SEL:1')).toBeDefined()
    expect(screen.getByText('NO:0')).toBeDefined()
  })

  it('calls onSelect on ArrowDown', () => {
    const onSelect = vi.fn()
    render(<LineList items={THREE_BLOCKS} onSelect={onSelect} />)
    const list = screen.getByRole('listbox')
    fireEvent.keyDown(list, { key: 'ArrowDown' })
    expect(onSelect).toHaveBeenCalledWith(0)
  })

  it('renders empty list without error', () => {
    render(<LineList items={[]} />)
    expect(screen.getByRole('listbox')).toBeDefined()
  })
})
