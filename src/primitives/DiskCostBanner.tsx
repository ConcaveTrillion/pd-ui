import * as React from 'react';
import { cn } from './cn.js';

export interface DiskCostBannerProps {
  /** Human-readable disk size string, e.g. `"1.84 GB"`. */
  size: string;
  /** Optional prune action handler. Renders a "Prune…" button when provided. */
  onPrune?: () => void;
  className?: string;
}

/**
 * DiskCostBanner — inline artifact disk usage indicator.
 *
 * Shows "Stage artifacts: <size>" with an optional prune action.
 * Used in wf02/05/05b/09/10 pipeline-shell panels.
 * No icon import — icon class rendered via CSS `::before` on `.disk-cost-banner__icon`.
 */
export function DiskCostBanner({
  size,
  onPrune,
  className,
}: DiskCostBannerProps): React.ReactElement {
  return (
    <div className={cn('disk-cost-banner', className)}>
      <span className="disk-cost-banner__icon" aria-hidden="true" />
      <div className="disk-cost-banner__body">
        <span className="disk-cost-banner__prefix">Stage artifacts: </span>
        <span className="disk-cost-banner__size">{size}</span>
      </div>
      {onPrune != null ? (
        <button
          type="button"
          className="disk-cost-banner__prune"
          onClick={onPrune}
          aria-label="Prune stage artifacts"
        >
          Prune…
        </button>
      ) : null}
    </div>
  );
}

DiskCostBanner.displayName = 'DiskCostBanner';
