import * as React from 'react';
import { Button } from '../../primitives/Button.js';
import { Segmented } from '../../primitives/Segmented.js';
import type { SegmentedOption } from '../../primitives/Segmented.js';

// ─── Types ────────────────────────────────────────────────────────────────────

export type SourceFilter = 'all' | 'marked' | 'skipped' | 'unmarked' | 'inserts';
export type SourceDensity = 's' | 'm' | 'l';

export interface SourceFilterCounts {
  all: number;
  marked: number;
  skipped: number;
  unmarked: number;
  inserts: number;
}

export interface FileToolbarProps {
  filter: SourceFilter;
  onFilterChange: (next: SourceFilter) => void;
  counts: SourceFilterCounts;
  density: SourceDensity;
  onDensityChange: (next: SourceDensity) => void;
  onInsert?: () => void;
  'data-testid'?: string;
}

// ─── Constants ────────────────────────────────────────────────────────────────

const FILTER_LABELS: Record<SourceFilter, string> = {
  all: 'All',
  marked: 'Marked',
  skipped: 'Skipped',
  unmarked: 'Unmarked',
  inserts: 'Inserts',
};

const DENSITY_OPTIONS: SegmentedOption[] = [
  { value: 's', label: 'S' },
  { value: 'm', label: 'M' },
  { value: 'l', label: 'L' },
];

const ALL_FILTERS: SourceFilter[] = ['all', 'marked', 'skipped', 'unmarked', 'inserts'];

// ─── Component ────────────────────────────────────────────────────────────────

/**
 * FileToolbar — Source-stage filter/density/insert toolbar.
 *
 * Left: five filter chips (All / Marked / Skipped / Unmarked / Inserts) with
 * per-filter counts. Middle: density Segmented (S / M / L).
 * Right: optional Insert page CTA.
 *
 * All colors are CSS custom properties — no hex literals.
 */
export const FileToolbar = React.forwardRef<HTMLDivElement, FileToolbarProps>(
  function FileToolbar(
    {
      filter,
      onFilterChange,
      counts,
      density,
      onDensityChange,
      onInsert,
      'data-testid': testId,
    },
    ref,
  ) {
    return (
      <div
        ref={ref}
        className="file-toolbar"
        {...(testId !== undefined ? { 'data-testid': testId } : {})}
      >
        {/* Left: filter chip group */}
        <div className="file-toolbar__filters" role="group" aria-label="Filter files">
          {ALL_FILTERS.map((f) => {
            const isActive = filter === f;
            return (
              <button
                key={f}
                type="button"
                className={`file-toolbar__chip${isActive ? ' file-toolbar__chip--active' : ''}`}
                aria-pressed={isActive}
                data-testid={`file-toolbar-filter-${f}`}
                onClick={() => {
                  onFilterChange(f);
                }}
              >
                <span className="file-toolbar__chip-label">{FILTER_LABELS[f]}</span>
                <span className="file-toolbar__chip-count">{counts[f]}</span>
              </button>
            );
          })}
        </div>

        {/* Middle: density Segmented */}
        <div className="file-toolbar__density">
          <Segmented
            options={DENSITY_OPTIONS}
            value={density}
            onChange={(val) => {
              onDensityChange(val as SourceDensity);
            }}
            size="sm"
          />
        </div>

        {/* Right: Insert page CTA */}
        {onInsert !== undefined ? (
          <div className="file-toolbar__actions">
            <Button
              size="sm"
              onClick={onInsert}
              data-testid="file-toolbar-insert"
            >
              Insert page
            </Button>
          </div>
        ) : null}
      </div>
    );
  },
);

FileToolbar.displayName = 'FileToolbar';
