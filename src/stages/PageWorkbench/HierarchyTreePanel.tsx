/**
 * HierarchyTreePanel — right-drawer tree panel for PageWorkbench.
 *
 * Displays the block/paragraph/line/word hierarchy with expand/collapse
 * controls, type badges, and selection support.
 *
 * Phase 2 M2 — spec §6.2 line 344.
 */

import React, { useCallback, useRef, useState } from 'react'
import { HIERARCHY_TREE_PANEL } from '../../testids/index.js'
import { TreeRow } from './TreeRow.js'

// ---------------------------------------------------------------------------
// Types (public — exported)
// ---------------------------------------------------------------------------

export type TreeNodeType = 'block' | 'paragraph' | 'line' | 'word'

export interface TreeNode {
  id: string
  type: TreeNodeType
  label: string
  children?: ReadonlyArray<TreeNode>
}

export interface HierarchyTreePanelProps {
  /** The tree nodes to render. */
  tree: ReadonlyArray<TreeNode>

  /** The currently-selected node id. */
  selectedId?: string

  /** Called when the user clicks a node row. */
  onSelect?: (id: string) => void

  /** Called when the user changes the type of a node. */
  onTypeChange?: (id: string, nextType: TreeNodeType) => void

  /**
   * Ids that should be expanded on first render (uncontrolled).
   * By default all nodes with children are expanded.
   */
  defaultExpandedIds?: ReadonlyArray<string>

  /** Forwarded to the outer `<nav>` element. */
  'data-testid'?: string
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Collect all node ids that have children (used for "expand all" default). */
function collectExpandable(nodes: ReadonlyArray<TreeNode>): string[] {
  const ids: string[] = []
  for (const node of nodes) {
    if ((node.children?.length ?? 0) > 0) {
      ids.push(node.id)
      ids.push(...collectExpandable(node.children!))
    }
  }
  return ids
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

/**
 * HierarchyTreePanel — renders the block/paragraph/line/word tree.
 *
 * Expanded state is uncontrolled (managed internally). `defaultExpandedIds`
 * seeds the initial expanded set; when omitted, all expandable nodes start
 * expanded.
 *
 * @example
 *   <HierarchyTreePanel
 *     tree={pageTree}
 *     selectedId={selectedId}
 *     onSelect={setSelectedId}
 *     onTypeChange={(id, type) => dispatch({ type: 'setNodeType', id, nodeType: type })}
 *   />
 */
export function HierarchyTreePanel({
  tree,
  selectedId,
  onSelect,
  onTypeChange,
  defaultExpandedIds,
  'data-testid': testId,
}: HierarchyTreePanelProps): React.ReactElement {
  // Determine initial expanded set.
  // Compute once at mount; subsequent prop changes do not re-seed the state
  // (uncontrolled pattern — mirroring standard React uncontrolled inputs).
  const initialExpandedRef = useRef<ReadonlySet<string> | null>(null)
  if (initialExpandedRef.current === null) {
    initialExpandedRef.current =
      defaultExpandedIds !== undefined
        ? new Set(defaultExpandedIds)
        : new Set(collectExpandable(tree))
  }

  const [expanded, setExpanded] = useState<ReadonlySet<string>>(
    initialExpandedRef.current,
  )

  const handleToggle = useCallback((id: string) => {
    setExpanded((prev) => {
      const next = new Set(prev)
      if (next.has(id)) {
        next.delete(id)
      } else {
        next.add(id)
      }
      return next
    })
  }, [])

  const outerTestId = testId ?? HIERARCHY_TREE_PANEL

  // Recursive render helper.
  function renderNodes(
    nodes: ReadonlyArray<TreeNode>,
    depth: number,
  ): React.ReactElement[] {
    const rows: React.ReactElement[] = []
    for (const node of nodes) {
      const isExpanded = expanded.has(node.id)
      const hasChildren = (node.children?.length ?? 0) > 0

      rows.push(
        <TreeRow
          key={node.id}
          node={node}
          depth={depth}
          expanded={isExpanded}
          onToggle={() => { handleToggle(node.id) }}
          selected={selectedId === node.id}
          {...(onSelect != null
            ? { onSelect: () => { onSelect(node.id) } }
            : {})}
          {...(onTypeChange != null
            ? { onTypeChange: (nextType: TreeNodeType) => { onTypeChange(node.id, nextType) } }
            : {})}
        />,
      )

      if (hasChildren && isExpanded) {
        rows.push(...renderNodes(node.children!, depth + 1))
      }
    }
    return rows
  }

  return (
    <div
      className="hierarchy-tree-panel"
      data-testid={outerTestId}
      role="tree"
      aria-label="Document hierarchy"
    >
      {tree.length === 0 ? (
        <div className="hierarchy-tree-panel__empty">No nodes</div>
      ) : (
        renderNodes(tree, 0)
      )}
    </div>
  )
}
