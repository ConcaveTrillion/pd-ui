import * as React from 'react';
import { cn } from './cn.js';
import { SummaryCell } from './SummaryCell.js';
import type { SummaryCellTone } from './SummaryCell.js';

export interface SummaryStripCell {
  /** Unique key for the cell. Defaults to using label if not provided. */
  key?: string;
  /** Short label shown above the value. */
  label: string;
  /** Primary numeric or text value. */
  value: string;
  /** Optional descriptor shown below the value. */
  sub?: string;
  /** Semantic tone modifier. */
  tone?: SummaryCellTone;
}

export interface SummaryStripProps {
  /** Ordered list of cell descriptors to render. */
  cells: SummaryStripCell[];
  className?: string;
}

/**
 * SummaryStrip — a horizontal row of SummaryCell metric tiles.
 *
 * Composes one or more SummaryCells in a flex row with dividers.
 * Used in wf03/wf11/wf-pw page-list stages to surface aggregate counts.
 * Token-only styling; no hex literals.
 */
export function SummaryStrip({ cells, className }: SummaryStripProps): React.ReactElement {
  return (
    <div className={cn('summary-strip', className)}>
      {cells.map((cell, i) => (
        <SummaryCell
          key={cell.key ?? `${cell.label}-${i}`}
          label={cell.label}
          value={cell.value}
          {...(cell.sub !== undefined ? { sub: cell.sub } : {})}
          {...(cell.tone !== undefined ? { tone: cell.tone } : {})}
        />
      ))}
    </div>
  );
}

SummaryStrip.displayName = 'SummaryStrip';
