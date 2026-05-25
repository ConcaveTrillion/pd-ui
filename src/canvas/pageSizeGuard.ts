/**
 * pageSizeGuard — page-dimension validation and clamping for Konva stages.
 *
 * ## Why 8192?
 *
 * Browser canvas implementations cap the backing store at a hardware-dependent
 * limit.  Chrome on desktop silently returns a blank canvas for either axis
 * > 32767px.  Safari is stricter (~16384px).  Older Android WebView tops out
 * at 4096px.  Konva writes `canvas.width = stageWidth` directly, so an
 * oversized page dimension passed from OCR/page metadata will silently produce
 * a blank or frozen canvas.
 *
 * We use **8192px** as the hard cap:
 *   - Safely below the Safari 16384 limit.
 *   - Well below the Chrome 32767 limit.
 *   - Corresponds to a ~27-inch 300 DPI scan at ~200% zoom; any real book page
 *     with dimensions above this is almost certainly corrupt metadata, not a
 *     real page.
 *
 * `PageImageCanvas` validates the raw page props through this module before
 * passing anything to the Konva `<Stage>`.  Invalid pages cause the canvas to
 * render a `data-testid="canvas-invalid-page"` fallback instead of a Stage.
 */

/** Maximum allowed dimension (pixels) for either axis of a Konva stage. */
export const PAGE_DIMENSION_MAX = 8192

/** Fallback dimensions (1×1) used when clamping receives entirely invalid input. */
const FALLBACK_DIMENSION = 1

// ── Public API ────────────────────────────────────────────────────────────────

/** Discriminated-union result from `validatePageDimensions`. */
export type PageDimensionValidationResult =
  | { valid: true }
  | { valid: false; reason: string }

/**
 * Returns `true` when both `width` and `height` are:
 *   - Finite (not NaN, not ±Infinity)
 *   - Positive (> 0)
 *   - ≤ PAGE_DIMENSION_MAX
 */
export function isPageDimensionsValid(width: number, height: number): boolean {
  return (
    Number.isFinite(width) &&
    Number.isFinite(height) &&
    width > 0 &&
    height > 0 &&
    width <= PAGE_DIMENSION_MAX &&
    height <= PAGE_DIMENSION_MAX
  )
}

/**
 * Returns a discriminated-union result with a human-readable `reason` on
 * failure.  Prefer `isPageDimensionsValid` for boolean checks.
 */
export function validatePageDimensions(
  width: number,
  height: number,
): PageDimensionValidationResult {
  if (!Number.isFinite(width) || !Number.isFinite(height)) {
    return { valid: false, reason: `Page dimensions must be finite numbers (got ${width}×${height})` }
  }
  if (width <= 0 || height <= 0) {
    return { valid: false, reason: `Page dimensions must be positive (got ${width}×${height})` }
  }
  if (width > PAGE_DIMENSION_MAX || height > PAGE_DIMENSION_MAX) {
    return {
      valid: false,
      reason:
        `Page dimensions exceed the ${PAGE_DIMENSION_MAX}px per-axis render cap ` +
        `(got ${width}×${height}). ` +
        `Larger values risk freezing or blanking the canvas.`,
    }
  }
  return { valid: true }
}

/**
 * Clamps page dimensions to safe values for Konva stage allocation.
 *
 * - Non-finite or non-positive values on either axis → replaced by `FALLBACK_DIMENSION` (1px).
 * - Values exceeding `PAGE_DIMENSION_MAX` → clamped to `PAGE_DIMENSION_MAX`.
 * - Valid values → returned unchanged.
 *
 * This is used internally by `PageImageCanvas` only when rendering a *clamped*
 * fallback is acceptable (e.g. for the stage inside an error boundary state).
 * Prefer `isPageDimensionsValid` + the invalid-page UI for normal rendering.
 */
export function clampPageDimensions(
  width: number,
  height: number,
): { width: number; height: number } {
  // Infinity is finite-safe-clamped to PAGE_DIMENSION_MAX; NaN/-Infinity/≤0 → fallback.
  const safeWidth =
    Number.isNaN(width) || width <= 0
      ? FALLBACK_DIMENSION
      : Math.min(width, PAGE_DIMENSION_MAX)

  const safeHeight =
    Number.isNaN(height) || height <= 0
      ? FALLBACK_DIMENSION
      : Math.min(height, PAGE_DIMENSION_MAX)

  return { width: safeWidth, height: safeHeight }
}
