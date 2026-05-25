import * as React from 'react';
import { Button } from '../../primitives/Button.js';
import {
  SOURCE_BANNER,
  SOURCE_BANNER_GENERATE,
  SOURCE_BANNER_REGENERATE,
  sourceBulkActionTestId,
} from '../../testids/index.js';

/**
 * The three operational states of the SourceBanner.
 *
 * - `'idle'`       — no active job; CTAs for Generate / Re-generate are available.
 * - `'generating'` — thumbnail generation is in progress; a progress bar and page
 *                    counter are shown.
 * - `'selection'`  — one or more pages are selected; bulk-action buttons are shown.
 */
export type SourceBannerState = 'idle' | 'generating' | 'selection';

/**
 * Bulk actions that can be applied to a selection of pages.
 *
 * - `'page'`      — mark pages as normal body pages.
 * - `'cover'`     — mark pages as front cover.
 * - `'back'`      — mark pages as back cover.
 * - `'blank'`     — mark pages as intentionally blank.
 * - `'duplicate'` — mark pages as duplicate (will be excluded).
 * - `'remove'`    — permanently remove pages from the project.
 */
export type SourceBulkAction = 'page' | 'cover' | 'back' | 'blank' | 'duplicate' | 'remove';

export interface SourceBannerProps {
  /** Current operational state — determines which content branch is rendered. */
  state: SourceBannerState;

  /**
   * Fractional progress in [0, 1]. Only used when `state='generating'`.
   * Clamped to [0, 1] before rendering.
   */
  progress?: number;

  /**
   * Current page index being processed. Shown alongside the progress bar
   * when `state='generating'`.
   */
  currentPage?: number;

  /**
   * Total page count. Shown alongside the progress bar when `state='generating'`.
   */
  totalPages?: number;

  /**
   * Number of currently selected pages. Displayed in the selection banner
   * when `state='selection'`.
   */
  selectedCount?: number;

  /**
   * Called when a bulk-action button is clicked in selection state.
   * Receives the action key.
   */
  onBulkAction?: (action: SourceBulkAction) => void;

  /** Called when the "Generate" CTA is clicked in idle state. */
  onGenerate?: () => void;

  /** Called when the "Re-generate" CTA is clicked in idle state. */
  onRegenerate?: () => void;

  /** Override the root element's data-testid. Defaults to `SOURCE_BANNER`. */
  'data-testid'?: string;
}

// ── Bulk action labels ────────────────────────────────────────────────────────

const BULK_ACTION_LABEL: Record<SourceBulkAction, string> = {
  page: 'Page',
  cover: 'Cover',
  back: 'Back',
  blank: 'Blank',
  duplicate: 'Duplicate',
  remove: 'Remove',
};

const BULK_ACTIONS_NON_DANGER: SourceBulkAction[] = [
  'page',
  'cover',
  'back',
  'blank',
  'duplicate',
];

// ── Component ─────────────────────────────────────────────────────────────────

/**
 * SourceBanner — horizontal stage banner for the Source ingestion stage.
 *
 * Renders one of three discriminated content branches based on `state`:
 *
 * - **idle** — CTA bar with Generate (primary) and Re-generate (ghost) buttons.
 * - **generating** — progress bar + "{currentPage} of {totalPages}" page counter.
 * - **selection** — "{selectedCount} selected" label + per-SourceBulkAction buttons.
 *
 * CSS hooks: `data-state` on the root `<section>` for per-state theming.
 */
export const SourceBanner = React.forwardRef<HTMLElement, SourceBannerProps>(
  function SourceBanner(
    {
      state,
      progress,
      currentPage,
      totalPages,
      selectedCount,
      onBulkAction,
      onGenerate,
      onRegenerate,
      'data-testid': testId = SOURCE_BANNER,
    },
    ref,
  ) {
    return (
      <section
        ref={ref}
        className="source-banner"
        data-state={state}
        data-testid={testId}
        aria-label="Source stage banner"
      >
        {state === 'idle' ? (
          <div className="source-banner__idle">
            <span className="source-banner__idle-label">
              Source pages
            </span>
            <div className="source-banner__idle-actions">
              <Button
                variant="primary"
                size="sm"
                data-testid={SOURCE_BANNER_GENERATE}
                {...(onGenerate != null ? { onClick: onGenerate } : {})}
              >
                Generate
              </Button>
              {onRegenerate != null ? (
                <Button
                  variant="ghost"
                  size="sm"
                  data-testid={SOURCE_BANNER_REGENERATE}
                  onClick={onRegenerate}
                >
                  Re-generate
                </Button>
              ) : null}
            </div>
          </div>
        ) : state === 'generating' ? (
          <div className="source-banner__generating">
            <div className="source-banner__progress-track" role="progressbar" aria-valuenow={progress != null ? Math.round(Math.max(0, Math.min(1, progress)) * 100) : 0} aria-valuemin={0} aria-valuemax={100}>
              <div
                className="source-banner__progress-fill"
                style={{ width: `${Math.round(Math.max(0, Math.min(1, progress ?? 0)) * 100)}%` }}
              />
            </div>
            <span className="source-banner__page-counter">
              {currentPage != null && totalPages != null
                ? `${currentPage} of ${totalPages}`
                : null}
            </span>
          </div>
        ) : (
          // state === 'selection'
          <div className="source-banner__selection">
            <span className="source-banner__selection-count">
              {selectedCount != null ? `${selectedCount} selected` : '0 selected'}
            </span>
            <div className="source-banner__bulk-actions">
              {BULK_ACTIONS_NON_DANGER.map((action) => (
                <Button
                  key={action}
                  variant="ghost"
                  size="sm"
                  data-testid={sourceBulkActionTestId(action)}
                  {...(onBulkAction != null
                    ? { onClick: () => onBulkAction(action) }
                    : {})}
                >
                  {BULK_ACTION_LABEL[action]}
                </Button>
              ))}
              <Button
                variant="danger"
                size="sm"
                data-testid={sourceBulkActionTestId('remove')}
                {...(onBulkAction != null
                  ? { onClick: () => onBulkAction('remove') }
                  : {})}
              >
                {BULK_ACTION_LABEL.remove}
              </Button>
            </div>
          </div>
        )}
      </section>
    );
  },
);

SourceBanner.displayName = 'SourceBanner';
