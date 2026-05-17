/**
 * Tests for <WordList> (M6.2, issue #151).
 *
 * Verifies:
 * - render with fixture words
 * - render-prop slot injection (custom row content)
 * - keyboard navigation (ArrowDown, ArrowUp, Enter)
 * - controlled selection via selectedIndex/onSelect
 * - default plain-text row when renderRow is omitted
 *
 * react-virtuoso is mocked (jsdom has no layout engine; Virtuoso renders
 * nothing in jsdom). The mock renders all items directly so tests can
 * assert on content.
 */

import * as React from 'react'
import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'

// Mock react-virtuoso before importing WordList
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

import { WordList } from './WordList'
import type { WordListItem, WordRowProps } from './types'

// ── fixture ───────────────────────────────────────────────────────────────────

function makeWord(text: string, idx: number): WordListItem {
  return {
    text,
    ocr_confidence: 0.9,
    bounding_box: {
      top_left: { x: idx * 10, y: 0 },
      bottom_right: { x: idx * 10 + 8, y: 12 },
    },
  }
}

const THREE_WORDS: WordListItem[] = [
  makeWord('alpha', 0),
  makeWord('beta', 1),
  makeWord('gamma', 2),
]

// 200 words for large-list render check
const TWO_HUNDRED: WordListItem[] = Array.from({ length: 200 }, (_, i) =>
  makeWord(`word-${i}`, i),
)

// ── rendering ─────────────────────────────────────────────────────────────────

describe('<WordList>', () => {
  it('renders with default plain-text rows', () => {
    render(<WordList items={THREE_WORDS} />)
    expect(screen.getByText('alpha')).toBeDefined()
    expect(screen.getByText('beta')).toBeDefined()
    expect(screen.getByText('gamma')).toBeDefined()
  })

  it('renders with custom renderRow', () => {
    render(
      <WordList
        items={THREE_WORDS}
        renderRow={(p: WordRowProps<WordListItem>) => (
          <span key={p.index} data-testid={`row-${p.index}`} className="custom-row">
            CUSTOM:{p.item.text}
          </span>
        )}
      />,
    )
    expect(screen.getByText('CUSTOM:alpha')).toBeDefined()
    expect(screen.getByText('CUSTOM:beta')).toBeDefined()
  })

  it('passes isSelected=true for the selected index', () => {
    render(
      <WordList
        items={THREE_WORDS}
        selectedIndex={1}
        renderRow={(p: WordRowProps<WordListItem>) => (
          <span key={p.index} data-testid={`sel-${p.index}`}>
            {p.isSelected ? 'SELECTED' : 'NOT'}:{p.item.text}
          </span>
        )}
      />,
    )
    expect(screen.getByText('SELECTED:beta')).toBeDefined()
    expect(screen.getByText('NOT:alpha')).toBeDefined()
    expect(screen.getByText('NOT:gamma')).toBeDefined()
  })

  it('renders the list container with correct role', () => {
    render(<WordList items={THREE_WORDS} aria-label="Test word list" />)
    const list = screen.getByRole('listbox', { name: 'Test word list' })
    expect(list).toBeDefined()
  })

  it('applies className to outer container', () => {
    const { container } = render(
      <WordList items={THREE_WORDS} className="my-custom-class" />,
    )
    const outer = container.firstElementChild
    expect(outer?.className).toContain('my-custom-class')
  })

  it('renders empty list without error', () => {
    render(<WordList items={[]} />)
    const list = screen.getByRole('listbox')
    expect(list).toBeDefined()
  })

  it('passes matchStatus from getMatchStatus to renderRow', () => {
    render(
      <WordList
        items={THREE_WORDS}
        getMatchStatus={(item) => item.text === 'beta' ? 'fuzzy' : 'exact'}
        renderRow={(p: WordRowProps<WordListItem>) => (
          <span key={p.index} data-testid={`ms-${p.index}`}>
            {p.matchStatus}:{p.item.text}
          </span>
        )}
      />,
    )
    expect(screen.getByText('exact:alpha')).toBeDefined()
    expect(screen.getByText('fuzzy:beta')).toBeDefined()
    expect(screen.getByText('exact:gamma')).toBeDefined()
  })
})

// ── keyboard navigation ───────────────────────────────────────────────────────

describe('<WordList> keyboard navigation', () => {
  it('calls onSelect with 0 when ArrowDown pressed with no selection', () => {
    const onSelect = vi.fn()
    render(<WordList items={THREE_WORDS} onSelect={onSelect} />)
    const list = screen.getByRole('listbox')
    fireEvent.keyDown(list, { key: 'ArrowDown' })
    expect(onSelect).toHaveBeenCalledWith(0)
  })

  it('calls onSelect with next index on ArrowDown', () => {
    const onSelect = vi.fn()
    render(<WordList items={THREE_WORDS} selectedIndex={0} onSelect={onSelect} />)
    const list = screen.getByRole('listbox')
    fireEvent.keyDown(list, { key: 'ArrowDown' })
    expect(onSelect).toHaveBeenCalledWith(1)
  })

  it('does not exceed last index on ArrowDown', () => {
    const onSelect = vi.fn()
    render(<WordList items={THREE_WORDS} selectedIndex={2} onSelect={onSelect} />)
    const list = screen.getByRole('listbox')
    fireEvent.keyDown(list, { key: 'ArrowDown' })
    expect(onSelect).not.toHaveBeenCalled()
  })

  it('calls onSelect with prev index on ArrowUp', () => {
    const onSelect = vi.fn()
    render(<WordList items={THREE_WORDS} selectedIndex={1} onSelect={onSelect} />)
    const list = screen.getByRole('listbox')
    fireEvent.keyDown(list, { key: 'ArrowUp' })
    expect(onSelect).toHaveBeenCalledWith(0)
  })

  it('does not go below 0 on ArrowUp', () => {
    const onSelect = vi.fn()
    render(<WordList items={THREE_WORDS} selectedIndex={0} onSelect={onSelect} />)
    const list = screen.getByRole('listbox')
    fireEvent.keyDown(list, { key: 'ArrowUp' })
    expect(onSelect).not.toHaveBeenCalled()
  })

  it('calls onSelect on Enter for currently selected item', () => {
    const onSelect = vi.fn()
    render(<WordList items={THREE_WORDS} selectedIndex={1} onSelect={onSelect} />)
    const list = screen.getByRole('listbox')
    fireEvent.keyDown(list, { key: 'Enter' })
    expect(onSelect).toHaveBeenCalledWith(1)
  })
})

// ── large list ────────────────────────────────────────────────────────────────

describe('<WordList> 200-item list', () => {
  it('renders without crash with 200 items', () => {
    render(<WordList items={TWO_HUNDRED} />)
    const list = screen.getByRole('listbox')
    expect(list).toBeDefined()
    expect(screen.getByText('word-0')).toBeDefined()
    expect(screen.getByText('word-199')).toBeDefined()
  })
})
