import * as React from 'react';
import { cn } from './cn.js';

export type SummaryCellTone = 'clean' | 'dirty' | 'warn' | 'neutral';

export interface SummaryCellProps {
  /** Short label shown above the value. */
  label: string;
  /** Primary numeric or text value. */
  value: string;
  /** Optional descriptor shown below the value. */
  sub?: string;
  /** Semantic tone modifier that tints the value text. */
  tone?: SummaryCellTone;
  className?: string;
}

/**
 * SummaryCell — a single metric cell inside a SummaryStrip.
 *
 * Displays a label / value / optional sub-label.
 * Used in wf03/wf11/wf-pw across page-list stages.
 * Token-only styling; no hex literals.
 */
export function SummaryCell({
  label,
  value,
  sub,
  tone,
  className,
}: SummaryCellProps): React.ReactElement {
  return (
    <div
      className={cn(
        'summary-cell',
        tone != null && tone !== 'neutral' ? `summary-cell--${tone}` : undefined,
        className,
      )}
      role="status"
      aria-label={`${label}: ${value}`}
    >
      <div className="summary-cell__label">{label}</div>
      <div className="summary-cell__value">{value}</div>
      {sub != null ? <div className="summary-cell__sub">{sub}</div> : null}
    </div>
  );
}

SummaryCell.displayName = 'SummaryCell';
