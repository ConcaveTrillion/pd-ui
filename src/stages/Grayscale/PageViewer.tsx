/**
 * PageViewer — Grayscale stage per-page before/split/after viewer.
 *
 * Spec §6.2: "Split before/after viewer (Before/Split/After segmented)
 * with 13-page thumbnail scroller + re-run button. Composes ArtifactViewer."
 *
 * Layout:
 *   - Top toolbar: Before/Split/After Segmented + optional Re-run button
 *   - Center: ArtifactViewer composing PageImageCanvas
 *   - Bottom: horizontal thumbnail scroller (≈13 pages)
 *
 * Mode mapping to ArtifactViewer:
 *   - 'before' → imageSrc=beforeImageUrl, overlayMode='view'
 *   - 'after'  → imageSrc=afterImageUrl,  overlayMode='view'
 *   - 'split'  → imageSrc=afterImageUrl,  overlayMode='split', splitProposal={splitX:0.5}
 *     (consumer controls the actual split position via the splitProposal callback;
 *      we ship splitX=0.5 as the default starting position.)
 */

import * as React from 'react';
import { ArtifactViewer } from '../PageWorkbench/ArtifactViewer.js';
import { Segmented } from '../../primitives/Segmented.js';
import type { SegmentedOption } from '../../primitives/Segmented.js';
import { Button } from '../../primitives/Button.js';
import { PAGE_VIEWER, PAGE_VIEWER_RERUN, pageViewerThumbTestId } from '../../testids/index.js';

// ── Types ─────────────────────────────────────────────────────────────────────

export type PageViewerMode = 'before' | 'split' | 'after';

export interface PageViewerPage {
  id: string;
  pageNumber: number;
  /** Pre-processing image URL. */
  beforeImageUrl: string;
  /** Post-processing image URL. */
  afterImageUrl: string;
  pageWidth: number;
  pageHeight: number;
}

export interface PageViewerThumb {
  id: string;
  pageNumber: number;
  thumbnailUrl: string;
}

export interface PageViewerProps {
  page: PageViewerPage;
  mode: PageViewerMode;
  onModeChange: (mode: PageViewerMode) => void;
  /** ~13 surrounding pages for the thumbnail scroller. */
  thumbs?: ReadonlyArray<PageViewerThumb>;
  /** Active page id in the scroller. */
  activeThumbId?: string;
  onThumbClick?: (id: string) => void;
  onRerun?: () => void;
  'data-testid'?: string;
}

// ── Constants ─────────────────────────────────────────────────────────────────

const MODE_OPTIONS: SegmentedOption[] = [
  { value: 'before', label: 'Before' },
  { value: 'split', label: 'Split' },
  { value: 'after', label: 'After' },
];

// ── Component ─────────────────────────────────────────────────────────────────

/**
 * Per-page detail viewer for the Grayscale stage.
 *
 * Shows a Before/Split/After mode toggle at the top, an ArtifactViewer
 * in the center, and a horizontal thumbnail scroller at the bottom for
 * quick page-jumping. An optional "Re-run on this page" button appears
 * in the toolbar when `onRerun` is provided.
 */
export const PageViewer = React.forwardRef<HTMLDivElement, PageViewerProps>(function PageViewer(
  {
    page,
    mode,
    onModeChange,
    thumbs,
    activeThumbId,
    onThumbClick,
    onRerun,
    'data-testid': testId = PAGE_VIEWER,
  },
  ref,
) {
  // ── Derive ArtifactViewer props from mode ──────────────────────────────
  // 'before' — show the raw scan in view mode
  // 'after'  — show the processed scan in view mode
  // 'split'  — show the processed scan with a draggable split line overlay;
  //            splitX=0.5 is the initial position; consumer owns state
  const imageSrc = mode === 'before' ? page.beforeImageUrl : page.afterImageUrl;

  const overlayMode = mode === 'split' ? 'split' : 'view';

  const splitProposal = mode === 'split' ? { splitX: 0.5 } : undefined;

  return (
    <div ref={ref} className="pv" data-testid={testId}>
      {/* ── Top toolbar ─────────────────────────────────────────────────── */}
      <div className="pv__toolbar">
        {/* Mode segmented (wrapper div owns testid so Segmented internals stay clean) */}
        <div className="pv__mode-toggle" data-testid={`${testId}-mode-toggle`}>
          <Segmented
            options={MODE_OPTIONS}
            value={mode}
            onChange={(v) => onModeChange(v as PageViewerMode)}
            size="sm"
          />
        </div>

        {onRerun !== undefined && (
          <Button variant="ghost" size="sm" data-testid={PAGE_VIEWER_RERUN} onClick={onRerun}>
            Re-run on this page
          </Button>
        )}
      </div>

      {/* ── Center: image viewer ─────────────────────────────────────────── */}
      <div className="pv__viewer">
        <ArtifactViewer
          imageSrc={imageSrc}
          pageWidth={page.pageWidth}
          pageHeight={page.pageHeight}
          overlayMode={overlayMode}
          {...(splitProposal !== undefined ? { splitProposal } : {})}
        />
      </div>

      {/* ── Bottom: thumbnail scroller ──────────────────────────────────── */}
      {thumbs !== undefined && thumbs.length > 0 && (
        <div
          className="pv__thumb-scroller"
          data-testid={`${testId}-thumb-scroller`}
          role="group"
          aria-label="Page thumbnails"
        >
          {thumbs.map((thumb) => {
            const isActive = thumb.id === activeThumbId;
            return (
              <button
                key={thumb.id}
                type="button"
                className="pv__thumb"
                data-testid={pageViewerThumbTestId(thumb.id)}
                data-active={isActive ? 'true' : 'false'}
                aria-pressed={isActive}
                aria-label={`Page ${thumb.pageNumber}`}
                onClick={() => onThumbClick?.(thumb.id)}
              >
                <img
                  src={thumb.thumbnailUrl}
                  alt={`Thumbnail for page ${thumb.pageNumber}`}
                  className="pv__thumb-img"
                />
                <span className="pv__thumb-num">{thumb.pageNumber}</span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
});

PageViewer.displayName = 'PageViewer';
