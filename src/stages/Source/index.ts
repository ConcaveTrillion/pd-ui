/**
 * Source stage barrel.
 *
 * Public exports from this subpath:
 *   - SourceBanner
 *   - Types: SourceBannerProps, SourceBannerState, SourceBulkAction
 */

export { SourceBanner } from './SourceBanner.js';
export type {
  SourceBannerProps,
  SourceBannerState,
  SourceBulkAction,
} from './SourceBanner.js';
// ─── FileToolbar (Phase 2 M3) ─────────────────────────────────────────────────
export { FileToolbar } from './FileToolbar.js';
export type {
  FileToolbarProps,
  SourceFilter,
  SourceDensity,
  SourceFilterCounts,
} from './FileToolbar.js';
// ─── ThumbCard (Phase 2 M3) ───────────────────────────────────────────────────
export { ThumbCard } from './ThumbCard.js';
export type {
  ThumbCardProps,
  SourcePage,
  SourcePageRole,
  SourcePageStatus,
  ThumbDensity,
} from './ThumbCard.js';
export { BulkBar } from './BulkBar.js';
export type { BulkBarProps, BulkAction } from './BulkBar.js';
// ─── InsertDialog (Phase 2 M3) ────────────────────────────────────────────────
export { InsertDialog } from './InsertDialog.js';
export type {
  InsertDialogProps,
  InsertPosition,
  InsertKind,
  InsertAnchorOption,
  InsertSubmission,
} from './InsertDialog.js';
