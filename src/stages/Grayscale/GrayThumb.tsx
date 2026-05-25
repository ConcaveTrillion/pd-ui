import * as React from 'react';
import { GRAY_THUMB, grayThumbTestId } from '../../testids/index.js';

// ─── Types ────────────────────────────────────────────────────────────────────

/** A single page in the Grayscale stage. */
export interface GrayPage {
  id: string;
  pageNumber: number;
  thumbnailUrl: string;
  /** Optional processing status. */
  status?: 'pending' | 'processing' | 'done' | 'error';
}

/** Props for the GrayThumb component. */
export interface GrayThumbProps {
  page: GrayPage;
  /** Estimated processing seconds (overlays the thumbnail). */
  estimatedSeconds: number;
  /** Optional click handler. */
  onClick?: (id: string) => void;
  /** Whether to render as a button or just a div. Default: false (div). */
  interactive?: boolean;
  'data-testid'?: string;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

/** Format seconds as a short human-readable estimate string. */
function formatEstimate(seconds: number): string {
  return `~${seconds}s`;
}

// ─── Component ────────────────────────────────────────────────────────────────

/**
 * GrayThumb — per-page thumbnail card for the Grayscale stage.
 *
 * Smaller than Source's ThumbCard: no role badge, no checkbox.
 * Overlays a page-number badge (top-left) and a time estimate (bottom-right).
 *
 * When `interactive` is true and `onClick` is provided, wraps the
 * thumbnail body in a `<button>` that fires `onClick(page.id)`.
 */
export const GrayThumb = React.forwardRef<HTMLElement, GrayThumbProps>(
  function GrayThumb(
    {
      page,
      estimatedSeconds,
      onClick,
      interactive = false,
      'data-testid': testId = GRAY_THUMB,
    },
    ref,
  ) {
    const handleClick = () => {
      if (onClick !== undefined) {
        onClick(page.id);
      }
    };

    const thumbnailContent = (
      <>
        <img
          src={page.thumbnailUrl}
          alt={`page ${page.pageNumber}`}
          className="gray-thumb__image"
        />
        <span
          className="gray-thumb__pageno"
          aria-label={`page ${page.pageNumber}`}
        >
          {page.pageNumber}
        </span>
        <span className="gray-thumb__estimate" aria-label={`estimate ${formatEstimate(estimatedSeconds)}`}>
          {formatEstimate(estimatedSeconds)}
        </span>
      </>
    );

    return (
      <article
        ref={ref}
        className="gray-thumb"
        {...(page.status !== undefined ? { 'data-status': page.status } : {})}
        data-testid={testId ?? grayThumbTestId(page.id)}
      >
        {interactive && onClick !== undefined ? (
          <button
            type="button"
            className="gray-thumb__body"
            onClick={handleClick}
            aria-label={`Process page ${page.pageNumber}`}
          >
            {thumbnailContent}
          </button>
        ) : (
          <div className="gray-thumb__body">
            {thumbnailContent}
          </div>
        )}
      </article>
    );
  },
);

GrayThumb.displayName = 'GrayThumb';
