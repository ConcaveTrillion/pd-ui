import * as React from 'react';
import {
  CROP_OVERVIEW,
  CROP_OVERVIEW_DISTRIBUTION,
  CROP_OVERVIEW_ACTIVITY,
  cropOverviewActivityTestId,
} from '../../testids/index.js';

// ── Types ─────────────────────────────────────────────────────────────────────

export type CropFlagKind = 'overCrop' | 'underCrop' | 'deskewFail' | 'edgeNoise';

export interface FlagDistributionEntry {
  kind: CropFlagKind;
  count: number;
}

export interface CropActivityEntry {
  id: string;
  timestamp: string; // ISO 8601
  message: string;
  /** Optional actor name. */
  actor?: string;
}

export interface CropOverviewProps {
  flagDistribution: ReadonlyArray<FlagDistributionEntry>;
  recentActivity: ReadonlyArray<CropActivityEntry>;
  'data-testid'?: string;
}

// ── Helpers ───────────────────────────────────────────────────────────────────

/** Map each flag kind to a CSS token variable for its color. */
const FLAG_TOKEN: Record<CropFlagKind, string> = {
  overCrop: 'var(--fuzzy)',
  underCrop: 'var(--fuzzy)',
  deskewFail: 'var(--mismatch)',
  edgeNoise: 'var(--ocr)',
};

/** Human-readable label for each flag kind. */
const FLAG_LABEL: Record<CropFlagKind, string> = {
  overCrop: 'Over-crop',
  underCrop: 'Under-crop',
  deskewFail: 'Deskew fail',
  edgeNoise: 'Edge noise',
};

/**
 * Format an ISO 8601 timestamp as a relative time string.
 * Returns strings like "2m ago", "1h ago", "3d ago".
 * Falls back to the raw timestamp string if parsing fails.
 */
function relativeTime(isoTimestamp: string, now: number = Date.now()): string {
  let ms: number;
  try {
    ms = new Date(isoTimestamp).getTime();
  } catch {
    return isoTimestamp;
  }
  if (Number.isNaN(ms)) return isoTimestamp;

  const diffSec = Math.round((now - ms) / 1000);
  if (diffSec < 60) return `${diffSec}s ago`;
  const diffMin = Math.round(diffSec / 60);
  if (diffMin < 60) return `${diffMin}m ago`;
  const diffHr = Math.round(diffMin / 60);
  if (diffHr < 24) return `${diffHr}h ago`;
  const diffDays = Math.round(diffHr / 24);
  return `${diffDays}d ago`;
}

// ── Sub-components ────────────────────────────────────────────────────────────

interface FlagDistributionProps {
  flagDistribution: ReadonlyArray<FlagDistributionEntry>;
  'data-testid'?: string;
}

function FlagDistribution({
  flagDistribution,
  'data-testid': testId = CROP_OVERVIEW_DISTRIBUTION,
}: FlagDistributionProps): React.ReactElement {
  const total = flagDistribution.reduce((sum, e) => sum + e.count, 0);

  return (
    <div
      className="crop-overview__distribution"
      data-testid={testId}
      style={{
        background: 'var(--bg-surface)',
        border: '1px solid var(--border-1)',
        borderRadius: 8,
        padding: '14px 16px',
      }}
    >
      <div
        style={{
          fontSize: 13,
          fontWeight: 600,
          color: 'var(--ink-1)',
          marginBottom: 12,
        }}
      >
        Flag distribution
      </div>

      {flagDistribution.length === 0 ? (
        <div
          className="crop-overview__distribution-empty"
          style={{ fontSize: 12, color: 'var(--ink-4)', padding: '4px 0' }}
        >
          No flags recorded.
        </div>
      ) : (
        <>
          {/* Stacked bar */}
          <div
            className="crop-overview__stacked-bar"
            role="img"
            aria-label="Flag distribution stacked bar"
            style={{
              display: 'flex',
              height: 12,
              borderRadius: 6,
              overflow: 'hidden',
              background: 'var(--bg-sunk)',
              marginBottom: 12,
            }}
          >
            {flagDistribution.map((entry) => {
              const pct = total > 0 ? (entry.count / total) * 100 : 0;
              return (
                <div
                  key={entry.kind}
                  className="crop-overview__bar-segment"
                  data-kind={entry.kind}
                  aria-valuenow={entry.count}
                  aria-valuemax={total}
                  aria-label={`${FLAG_LABEL[entry.kind]}: ${entry.count}`}
                  style={{
                    width: `${pct}%`,
                    background: FLAG_TOKEN[entry.kind],
                    flexShrink: 0,
                  }}
                />
              );
            })}
          </div>

          {/* Legend */}
          <div
            className="crop-overview__legend"
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '6px 16px',
            }}
          >
            {flagDistribution.map((entry) => (
              <div
                key={entry.kind}
                className="crop-overview__legend-item"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                  fontSize: 12,
                }}
              >
                <span
                  className="crop-overview__legend-chip"
                  style={{
                    display: 'inline-block',
                    width: 10,
                    height: 10,
                    borderRadius: 2,
                    background: FLAG_TOKEN[entry.kind],
                    flexShrink: 0,
                  }}
                />
                <span style={{ color: 'var(--ink-2)' }}>{FLAG_LABEL[entry.kind]}</span>
                <span className="mono" style={{ fontWeight: 600, color: 'var(--ink-1)' }}>
                  {entry.count}
                </span>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

interface RecentActivityProps {
  recentActivity: ReadonlyArray<CropActivityEntry>;
  'data-testid'?: string;
}

function RecentActivity({
  recentActivity,
  'data-testid': testId = CROP_OVERVIEW_ACTIVITY,
}: RecentActivityProps): React.ReactElement {
  const now = Date.now();

  return (
    <div
      className="crop-overview__activity"
      data-testid={testId}
      style={{
        background: 'var(--bg-surface)',
        border: '1px solid var(--border-1)',
        borderRadius: 8,
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          padding: '12px 16px',
          borderBottom: '1px solid var(--border-1)',
          fontSize: 13,
          fontWeight: 600,
          color: 'var(--ink-1)',
        }}
      >
        Recent activity
      </div>

      {recentActivity.length === 0 ? (
        <div
          className="crop-overview__activity-empty"
          style={{
            padding: '12px 16px',
            fontSize: 12,
            color: 'var(--ink-4)',
          }}
        >
          No recent activity.
        </div>
      ) : (
        <ul
          style={{
            listStyle: 'none',
            margin: 0,
            padding: 0,
          }}
        >
          {recentActivity.map((entry, i) => (
            <li
              key={entry.id}
              data-testid={cropOverviewActivityTestId(entry.id)}
              style={{
                padding: '10px 16px',
                borderTop: i === 0 ? undefined : '1px solid var(--border-1)',
                display: 'grid',
                gridTemplateColumns: '80px 1fr',
                gridTemplateRows: 'auto auto',
                columnGap: 12,
                rowGap: 2,
              }}
            >
              <span
                className="mono"
                style={{
                  fontSize: 11,
                  color: 'var(--ink-4)',
                  gridColumn: 1,
                  gridRow: '1 / -1',
                  alignSelf: 'start',
                }}
              >
                {relativeTime(entry.timestamp, now)}
              </span>
              <div
                style={{
                  fontSize: 12.5,
                  color: 'var(--ink-1)',
                  gridColumn: 2,
                  gridRow: 1,
                }}
              >
                {entry.message}
              </div>
              {entry.actor != null && (
                <div
                  className="mono"
                  style={{
                    fontSize: 11,
                    color: 'var(--ink-3)',
                    gridColumn: 2,
                    gridRow: 2,
                  }}
                >
                  {entry.actor}
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

// ── Component ─────────────────────────────────────────────────────────────────

/**
 * CropOverview — summary panel for the Crop processing stage.
 *
 * Renders two panels side by side:
 * - Left: Flag distribution — horizontal stacked bar with per-flag segments
 *   and a legend (chip + count per flag).
 * - Right: Recent activity — vertical list with relative timestamps, messages,
 *   and optional actor names.
 */
export function CropOverview({
  flagDistribution,
  recentActivity,
  'data-testid': testId = CROP_OVERVIEW,
}: CropOverviewProps): React.ReactElement {
  return (
    <section
      className="crop-overview"
      data-testid={testId}
      style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: 16,
      }}
    >
      <FlagDistribution flagDistribution={flagDistribution} />
      <RecentActivity recentActivity={recentActivity} />
    </section>
  );
}
