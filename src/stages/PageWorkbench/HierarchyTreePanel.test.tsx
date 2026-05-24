/**
 * Tests for HierarchyTreePanel + TreeRow (Phase 2 M2).
 */

import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'

import { HierarchyTreePanel } from './HierarchyTreePanel.js'
import type { TreeNode } from './HierarchyTreePanel.js'
import {
  HIERARCHY_TREE_PANEL,
  treeRowTestId,
} from '../../testids/index.js'

// ---------------------------------------------------------------------------
// Fixtures
// ---------------------------------------------------------------------------

const SIMPLE_TREE: ReadonlyArray<TreeNode> = [
  {
    id: 'block-1',
    type: 'block',
    label: 'Block 1',
    children: [
      {
        id: 'para-1',
        type: 'paragraph',
        label: 'Paragraph 1',
        children: [
          {
            id: 'line-1',
            type: 'line',
            label: 'Line 1',
            children: [
              { id: 'word-1', type: 'word', label: 'Hello' },
              { id: 'word-2', type: 'word', label: 'World' },
            ],
          },
        ],
      },
    ],
  },
  {
    id: 'block-2',
    type: 'block',
    label: 'Block 2',
    children: [
      {
        id: 'para-2',
        type: 'paragraph',
        label: 'Paragraph 2',
      },
    ],
  },
]

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function renderPanel(
  props: Partial<React.ComponentProps<typeof HierarchyTreePanel>> = {},
) {
  return render(
    <HierarchyTreePanel
      tree={SIMPLE_TREE}
      {...props}
    />,
  )
}

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe('HierarchyTreePanel', () => {
  it('renders all tree nodes when fully expanded (default)', () => {
    renderPanel()
    expect(screen.getByTestId(treeRowTestId('block-1'))).toBeTruthy()
    expect(screen.getByTestId(treeRowTestId('para-1'))).toBeTruthy()
    expect(screen.getByTestId(treeRowTestId('line-1'))).toBeTruthy()
    expect(screen.getByTestId(treeRowTestId('word-1'))).toBeTruthy()
    expect(screen.getByTestId(treeRowTestId('word-2'))).toBeTruthy()
    expect(screen.getByTestId(treeRowTestId('block-2'))).toBeTruthy()
    expect(screen.getByTestId(treeRowTestId('para-2'))).toBeTruthy()
  })

  it('uses HIERARCHY_TREE_PANEL testid by default', () => {
    renderPanel()
    expect(screen.getByTestId(HIERARCHY_TREE_PANEL)).toBeTruthy()
  })

  it('forwards data-testid to outer container', () => {
    renderPanel({ 'data-testid': 'custom-tree' })
    expect(screen.getByTestId('custom-tree')).toBeTruthy()
    expect(document.querySelector('[data-testid="custom-tree"]')?.getAttribute('role')).toBe('tree')
  })

  it('renders empty state when tree is empty', () => {
    render(<HierarchyTreePanel tree={[]} />)
    expect(document.querySelector('.hierarchy-tree-panel__empty')).not.toBeNull()
  })

  // ── Expand / collapse ──────────────────────────────────────────────────────

  it('collapses a subtree when the expand toggle is clicked', () => {
    renderPanel()
    // block-1 is expanded by default — children are visible
    expect(screen.getByTestId(treeRowTestId('para-1'))).toBeTruthy()

    // Click the toggle button inside the block-1 row
    const block1Row = screen.getByTestId(treeRowTestId('block-1'))
    const toggleBtn = block1Row.querySelector('.tree-row__toggle')
    expect(toggleBtn).not.toBeNull()
    fireEvent.click(toggleBtn!)

    // para-1 should no longer be visible
    expect(screen.queryByTestId(treeRowTestId('para-1'))).toBeNull()
  })

  it('expands a collapsed subtree when the expand toggle is clicked again', () => {
    renderPanel({ defaultExpandedIds: [] })
    // block-1 starts collapsed — children not rendered
    expect(screen.queryByTestId(treeRowTestId('para-1'))).toBeNull()

    // Click the toggle button inside the block-1 row
    const block1Row = screen.getByTestId(treeRowTestId('block-1'))
    const toggleBtn = block1Row.querySelector('.tree-row__toggle')
    fireEvent.click(toggleBtn!)

    // para-1 should now be visible
    expect(screen.getByTestId(treeRowTestId('para-1'))).toBeTruthy()
  })

  it('defaultExpandedIds seeds initial expanded set', () => {
    renderPanel({ defaultExpandedIds: ['block-1'] })
    // Only block-1 is expanded; para-1 has children but is not in defaultExpandedIds
    // so line-1 should not be visible
    expect(screen.getByTestId(treeRowTestId('para-1'))).toBeTruthy()
    expect(screen.queryByTestId(treeRowTestId('line-1'))).toBeNull()
  })

  // ── Selection ──────────────────────────────────────────────────────────────

  it('clicking a row fires onSelect with the node id', () => {
    const onSelect = vi.fn()
    renderPanel({ onSelect })
    fireEvent.click(screen.getByTestId(treeRowTestId('word-1')))
    expect(onSelect).toHaveBeenCalledOnce()
    expect(onSelect).toHaveBeenCalledWith('word-1')
  })

  it('selected row has aria-selected=true', () => {
    renderPanel({ selectedId: 'para-1' })
    const para1Row = screen.getByTestId(treeRowTestId('para-1'))
    expect(para1Row.getAttribute('aria-selected')).toBe('true')
  })

  it('non-selected rows have aria-selected=false', () => {
    renderPanel({ selectedId: 'para-1' })
    const word1Row = screen.getByTestId(treeRowTestId('word-1'))
    expect(word1Row.getAttribute('aria-selected')).toBe('false')
  })

  it('no row is selected when selectedId is undefined', () => {
    renderPanel()
    const block1Row = screen.getByTestId(treeRowTestId('block-1'))
    expect(block1Row.getAttribute('aria-selected')).toBe('false')
  })

  // ── Type change ───────────────────────────────────────────────────────────

  it('onTypeChange fires with (id, nextType) when select changes', () => {
    const onTypeChange = vi.fn()
    renderPanel({ onTypeChange })
    const word1Row = screen.getByTestId(treeRowTestId('word-1'))
    const select = word1Row.querySelector('select')
    expect(select).not.toBeNull()
    fireEvent.change(select!, { target: { value: 'line' } })
    expect(onTypeChange).toHaveBeenCalledOnce()
    expect(onTypeChange).toHaveBeenCalledWith('word-1', 'line')
  })

  it('type-change select is not rendered when onTypeChange is not provided', () => {
    renderPanel()
    const word1Row = screen.getByTestId(treeRowTestId('word-1'))
    const select = word1Row.querySelector('select')
    expect(select).toBeNull()
  })

  // ── Badge rendering ────────────────────────────────────────────────────────

  it('renders a type badge inside each row', () => {
    renderPanel()
    const block1Row = screen.getByTestId(treeRowTestId('block-1'))
    const badge = block1Row.querySelector('.badge')
    expect(badge).not.toBeNull()
    expect(badge?.textContent).toBe('block')
  })
})
