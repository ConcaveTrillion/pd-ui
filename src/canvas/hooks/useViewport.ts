/**
 * useViewport — returns the current `ViewportState` (scale + pan) from the
 * nearest `<PageImageCanvas>`.  Throws a descriptive error when called outside one.
 */

import type { ViewportState } from '../types';
import { useCanvasContext } from '../context';

export function useViewport(): ViewportState {
  return useCanvasContext('useViewport').viewport;
}
