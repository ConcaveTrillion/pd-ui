/**
 * @concavetrillion/pd-ui/canvas
 *
 * Slot-based Konva canvas for page-image rendering with overlay layers.
 *
 * Primary export: `<PageImageCanvas>` — the stage shell.
 * Slot helpers:   `BBoxLayer`, `WordHitLayer`, `MarqueeSelectLayer`.
 * Hooks:          `useCanvasCoords`, `useViewport`, `useCanvasSelection`.
 * Types:          `CanvasProps`, `SlotRenderProps`, `WordSlotProps`,
 *                 `CoordContext`, `SelectionState`, `ViewportState`,
 *                 `CanvasRect`, `bboxToRect`.
 */

// Component
export { PageImageCanvas } from './PageImageCanvas'

// Slot helpers
export { BBoxLayer } from './layers/BBoxLayer'
export { WordHitLayer } from './layers/WordHitLayer'
export { MarqueeSelectLayer } from './layers/MarqueeSelectLayer'

// Hooks
export { useCanvasCoords } from './hooks/useCanvasCoords'
export { useViewport } from './hooks/useViewport'
export { useCanvasSelection } from './hooks/useCanvasSelection'

// Types
export type {
  CanvasProps,
  CanvasWord,
  CanvasPage,
  SlotRenderProps,
  WordSlotProps,
  CoordContext,
  SelectionState,
  ViewportState,
  CanvasRect,
  PageBBox,
  PagePoint,
} from './types'
export { bboxToRect } from './types'
