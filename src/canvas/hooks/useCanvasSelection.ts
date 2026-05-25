/**
 * useCanvasSelection — returns `{ selection, setSelection }` from the nearest
 * `<PageImageCanvas>`.  Throws a descriptive error when called outside one.
 */

import type { SelectionState } from '../types';
import { useCanvasContext } from '../context';

export interface CanvasSelectionHandle {
  selection: SelectionState;
  setSelection: (s: SelectionState) => void;
}

export function useCanvasSelection(): CanvasSelectionHandle {
  const ctx = useCanvasContext('useCanvasSelection');
  return { selection: ctx.selection, setSelection: ctx.setSelection };
}
