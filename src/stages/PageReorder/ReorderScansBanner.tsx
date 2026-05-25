import * as React from 'react';
import { Banner } from '../../primitives/Banner.js';
import { Button } from '../../primitives/Button.js';
import { Icon } from '../../icons/index.js';
import {
  REORDER_SCANS_BANNER,
  REORDER_SCANS_BANNER_SKIP,
  REORDER_SCANS_BANNER_AUTO_APPLY,
  REORDER_SCANS_BANNER_REDETECT,
  REORDER_SCANS_BANNER_SORT,
} from '../../testids/index.js';

// ─── Types ────────────────────────────────────────────────────────────────────

export type ReorderSortBy = 'confidence' | 'position';

interface DetectedProps {
  state: 'detected';
  /** Total number of out-of-order scans detected. */
  detected: number;
  /** Number of high-confidence swaps. */
  highCount: number;
  /** Number of medium-confidence swaps. */
  mediumCount: number;
  /** Currently active sort key for the swap list. */
  sortBy: ReorderSortBy;
  /** Called with the new sort key when the sort select changes. */
  onSort: (sort: ReorderSortBy) => void;
  /** Called when the user clicks "Auto-apply (N high)". */
  onAutoApply: () => void;
  /** Called when the user clicks "Skip stage". */
  onSkip: () => void;
  /** Override the root element's data-testid. */
  'data-testid'?: string;
}

interface CleanProps {
  state: 'clean';
  /** Called when the user clicks "Re-detect". */
  onRedetect: () => void;
  /** Override the root element's data-testid. */
  'data-testid'?: string;
}

/** Discriminated-union props for ReorderScansBanner. */
export type ReorderScansBannerProps = DetectedProps | CleanProps;

// ─── Component ────────────────────────────────────────────────────────────────

/**
 * ReorderScansBanner — top-of-stage banner for the Page Reorder workflow.
 *
 * Two state-discriminated variants:
 *   - `detected`: Shows sparkles icon, detected/high/medium counts, a sort
 *     select, a "Skip stage" ghost button, and a "Auto-apply (N high)" primary
 *     button.
 *   - `clean`: Shows a green checkmark icon, headline "Scans look in order",
 *     and a "Re-detect" ghost button.
 *
 * Design source: wf09/pages-tab.jsx lines 530-578.
 */
export function ReorderScansBanner(props: ReorderScansBannerProps): React.ReactElement {
  const testId =
    (props['data-testid'] !== undefined ? props['data-testid'] : undefined) ?? REORDER_SCANS_BANNER;

  if (props.state === 'clean') {
    return (
      <Banner
        tone="success"
        headline="Scans look in order"
        subtext="Filename sequence matches OCR'd page numbers. No swaps needed."
        leadingSlot={<Icon name="checkCircle" size={22} aria-hidden="true" />}
        actions={
          <Button
            variant="ghost"
            size="md"
            icon={<Icon name="refresh" size={14} aria-hidden="true" />}
            data-testid={REORDER_SCANS_BANNER_REDETECT}
            onClick={props.onRedetect}
          >
            Re-detect
          </Button>
        }
        data-testid={testId}
      />
    );
  }

  // detected state
  const { detected, highCount, mediumCount, sortBy, onSort, onAutoApply, onSkip } = props;

  const countText = `${detected} detected · ${highCount} high · ${mediumCount} medium`;

  const leadingSlot = (
    <span className="reorder-scans-banner__sparkle-icon" aria-hidden="true">
      <Icon name="sparkles" size={18} />
    </span>
  );

  const sortSelect = (
    <label className="reorder-scans-banner__sort-label">
      <span className="reorder-scans-banner__sort-text">Sort</span>
      <select
        className="reorder-scans-banner__sort-select"
        value={sortBy}
        data-testid={REORDER_SCANS_BANNER_SORT}
        onChange={(e) => {
          onSort(e.target.value as ReorderSortBy);
        }}
      >
        <option value="confidence">Confidence</option>
        <option value="position">Position</option>
      </select>
    </label>
  );

  const actions = (
    <>
      {sortSelect}
      <Button variant="ghost" size="md" data-testid={REORDER_SCANS_BANNER_SKIP} onClick={onSkip}>
        Skip stage
      </Button>
      <Button
        variant="primary"
        size="md"
        icon={<Icon name="sparkles" size={14} aria-hidden="true" />}
        data-testid={REORDER_SCANS_BANNER_AUTO_APPLY}
        onClick={onAutoApply}
      >
        {`Auto-apply (${highCount} high)`}
      </Button>
    </>
  );

  return (
    <Banner
      tone="info"
      headline={`Found ${detected} likely out-of-order scan${detected === 1 ? '' : 's'}`}
      subtext={countText}
      leadingSlot={leadingSlot}
      actions={actions}
      data-testid={testId}
    />
  );
}

ReorderScansBanner.displayName = 'ReorderScansBanner';
