import * as React from 'react';
import { cn } from './cn.js';
import type { FlagKind } from './FlagChip.js';

export interface RowFlagBadgeProps {
  /** Flag kind — used for CSS tone mapping via `data-kind`. */
  kind: FlagKind;
  className?: string;
}

/**
 * RowFlagBadge — compact inline badge showing a flag kind in a table row.
 *
 * Smaller than FlagChip (no count, no interaction). Tone is driven by
 * `data-kind` attribute in CSS so no hex is needed in component code.
 */
export function RowFlagBadge({ kind, className }: RowFlagBadgeProps): React.ReactElement {
  return (
    <span className={cn('row-flag-badge', className)} data-kind={kind}>
      <span className="row-flag-badge__dot" />
      {kind}
    </span>
  );
}

RowFlagBadge.displayName = 'RowFlagBadge';
