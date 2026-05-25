/**
 * PageReorder stage barrel (Phase 2 M8).
 */

// ─── AfterApplyStrip ──────────────────────────────────────────────────────────
export { AfterApplyStrip } from './AfterApplyStrip.js';
export type { AfterApplyStripProps } from './AfterApplyStrip.js';

// ─── ReorderScansBanner ───────────────────────────────────────────────────────
export { ReorderScansBanner } from './ReorderScansBanner.js';
export type { ReorderScansBannerProps, ReorderSortBy } from './ReorderScansBanner.js';

// ─── SwapRow ──────────────────────────────────────────────────────────────────
// PageThumb is internal to SwapRow — not exported from the stage barrel.
export { SwapRow } from './SwapRow.js';
export type { SwapRowProps, SwapData, SwapConfidence, SwapState } from './SwapRow.js';
export type { PageRef } from './PageThumb.js';
