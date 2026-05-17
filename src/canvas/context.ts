/**
 * CanvasInternalContext — carries coord, selection, and viewport state down to
 * hooks and slot fills without prop-drilling.
 *
 * This context is provided only by `<PageImageCanvas>`.  All canvas hooks
 * (useCanvasCoords, useViewport, useCanvasSelection) read from here.
 */

import { createContext, useContext } from 'react'
import type { CoordContext, SelectionState, ViewportState } from './types'

export interface CanvasContextValue {
  coords: CoordContext
  selection: SelectionState
  viewport: ViewportState
  setSelection: (s: SelectionState) => void
}

export const CanvasInternalContext = createContext<CanvasContextValue | null>(null)

/**
 * Read the canvas internal context.
 * Throws with a descriptive error if called outside `<PageImageCanvas>`.
 */
export function useCanvasContext(hookName: string): CanvasContextValue {
  const ctx = useContext(CanvasInternalContext)
  if (!ctx) {
    throw new Error(
      `${hookName} must be called inside <PageImageCanvas>. ` +
        'Make sure this hook is only used in components rendered as slot fills ' +
        'or children of a PageImageCanvas.',
    )
  }
  return ctx
}
