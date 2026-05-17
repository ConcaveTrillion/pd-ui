/**
 * Tests for <PageList> (M6.3, issue #152).
 *
 * Verifies basic render, render-prop, and selection for PageList.
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

import { PageList } from './PageList'
import type { PageListItem, PageRowProps } from './types'

const THREE_PAGES: PageListItem[] = [
  { page_index: 0, name: 'Page 1', width: 800, height: 1200 },
  { page_index: 1, name: 'Page 2', width: 800, height: 1200 },
  { page_index: 2, name: null, width: 800, height: 1200 },
]

describe('<PageList>', () => {
  it('renders with default row', () => {
    render(<PageList items={THREE_PAGES} />)
    const list = screen.getByRole('listbox')
    expect(list).toBeDefined()
  })

  it('renders with aria-label', () => {
    render(<PageList items={THREE_PAGES} aria-label="Page list" />)
    expect(screen.getByRole('listbox', { name: 'Page list' })).toBeDefined()
  })

  it('renders custom renderRow', () => {
    render(
      <PageList
        items={THREE_PAGES}
        renderRow={(p: PageRowProps<PageListItem>) => (
          <span key={p.index} data-testid={`page-${p.index}`}>
            page:{p.item.page_index ?? '?'}
          </span>
        )}
      />,
    )
    expect(screen.getByText('page:0')).toBeDefined()
    expect(screen.getByText('page:1')).toBeDefined()
    expect(screen.getByText('page:2')).toBeDefined()
  })

  it('passes isSelected=true for selectedIndex', () => {
    render(
      <PageList
        items={THREE_PAGES}
        selectedIndex={0}
        renderRow={(p: PageRowProps<PageListItem>) => (
          <span key={p.index}>{p.isSelected ? 'SEL' : 'NO'}:{p.index}</span>
        )}
      />,
    )
    expect(screen.getByText('SEL:0')).toBeDefined()
    expect(screen.getByText('NO:1')).toBeDefined()
  })

  it('calls onSelect on ArrowDown', () => {
    const onSelect = vi.fn()
    render(<PageList items={THREE_PAGES} onSelect={onSelect} />)
    const list = screen.getByRole('listbox')
    fireEvent.keyDown(list, { key: 'ArrowDown' })
    expect(onSelect).toHaveBeenCalledWith(0)
  })

  it('renders empty list without error', () => {
    render(<PageList items={[]} />)
    expect(screen.getByRole('listbox')).toBeDefined()
  })
})
