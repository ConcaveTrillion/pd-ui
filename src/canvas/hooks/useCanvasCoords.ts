/**
 * useCanvasCoords — returns the current `CoordContext` from the nearest
 * `<PageImageCanvas>`.  Throws a descriptive error when called outside one.
 */

import type { CoordContext } from '../types';
import { useCanvasContext } from '../context';

export function useCanvasCoords(): CoordContext {
  return useCanvasContext('useCanvasCoords').coords;
}
