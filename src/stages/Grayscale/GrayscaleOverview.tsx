import * as React from 'react';
import { StatTile } from '../../primitives/StatTile.js';
import {
  GRAYSCALE_OVERVIEW,
  GRAYSCALE_OVERVIEW_STAT_PROCESSED,
  GRAYSCALE_OVERVIEW_STAT_FLAGGED,
  GRAYSCALE_OVERVIEW_STAT_AVG,
  GRAYSCALE_OVERVIEW_STAT_TOTAL,
} from '../../testids/index.js';

// ── Types ─────────────────────────────────────────────────────────────────────

export interface GrayscaleStats {
  pagesProcessed: number;
  pagesFlagged: number;
  avgSecondsPerPage: number;
  totalSeconds: number;
  /** Optional mode breakdown for summary cards. */
  standardCount?: number;
  perceptualCount?: number;
}

export interface GrayscaleOverviewProps {
  stats: GrayscaleStats;
  'data-testid'?: string;
}

// ── Helpers ───────────────────────────────────────────────────────────────────

/** Format a seconds value as a compact human-readable string. */
function fmtSeconds(sec: number): string {
  if (sec < 60) return `${sec.toFixed(1)}s`;
  const m = Math.floor(sec / 60);
  const s = Math.round(sec % 60);
  return `${m}m ${s}s`;
}

// ── Component ─────────────────────────────────────────────────────────────────

/**
 * GrayscaleOverview — summary panel for the Grayscale processing stage.
 *
 * Renders a top row of four stat tiles (pages processed, pages flagged,
 * avg seconds per page, total time) and an optional bottom row of two
 * summary cards for mode breakdown (standard vs perceptual) when both
 * `standardCount` and `perceptualCount` are provided.
 */
export function GrayscaleOverview({
  stats,
  'data-testid': testId = GRAYSCALE_OVERVIEW,
}: GrayscaleOverviewProps): React.ReactElement {
  const {
    pagesProcessed,
    pagesFlagged,
    avgSecondsPerPage,
    totalSeconds,
    standardCount,
    perceptualCount,
  } = stats;

  const showModeBreakdown = standardCount != null && perceptualCount != null;

  return (
    <section className="grayscale-overview" data-testid={testId}>
      {/* Top row — 4 stat tiles */}
      <div className="grayscale-overview__stat-row">
        <div data-testid={GRAYSCALE_OVERVIEW_STAT_PROCESSED}>
          <StatTile label="Pages Processed" value={String(pagesProcessed)} tone="neutral" />
        </div>
        <div data-testid={GRAYSCALE_OVERVIEW_STAT_FLAGGED}>
          <StatTile
            label="Pages Flagged"
            value={String(pagesFlagged)}
            tone={pagesFlagged > 0 ? 'dirty' : 'neutral'}
          />
        </div>
        <div data-testid={GRAYSCALE_OVERVIEW_STAT_AVG}>
          <StatTile label="Avg / Page" value={fmtSeconds(avgSecondsPerPage)} />
        </div>
        <div data-testid={GRAYSCALE_OVERVIEW_STAT_TOTAL}>
          <StatTile label="Total Time" value={fmtSeconds(totalSeconds)} />
        </div>
      </div>

      {/* Bottom row — mode breakdown summary cards (conditional) */}
      {showModeBreakdown ? (
        <div className="grayscale-overview__mode-row">
          <div className="grayscale-overview__mode-card">
            <div className="grayscale-overview__mode-card-label">Standard Mode</div>
            <div className="grayscale-overview__mode-card-value">{standardCount}</div>
            <div className="grayscale-overview__mode-card-sub">pages</div>
          </div>
          <div className="grayscale-overview__mode-card">
            <div className="grayscale-overview__mode-card-label">Perceptual Mode</div>
            <div className="grayscale-overview__mode-card-value">{perceptualCount}</div>
            <div className="grayscale-overview__mode-card-sub">pages</div>
          </div>
        </div>
      ) : null}
    </section>
  );
}

GrayscaleOverview.displayName = 'GrayscaleOverview';
