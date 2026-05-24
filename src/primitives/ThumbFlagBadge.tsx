import * as React from 'react';
import { cn } from './cn.js';
import { FlagChip } from './FlagChip.js';
import type { FlagChipProps, FlagKind } from './FlagChip.js';

export interface ThumbFlagBadgeProps extends Omit<FlagChipProps, 'className'> {
  /** Flag kind — forwarded to the inner FlagChip. */
  kind: FlagKind;
  className?: string;
}

/**
 * ThumbFlagBadge — an overlay badge showing a flag kind on a thumbnail.
 *
 * Wraps FlagChip in a positioned container so it can be anchored over
 * a thumbnail image. Tone mapping is inherited from FlagChip's CSS
 * `data-kind` attribute; no hex literals.
 *
 * Used in wf03/wf11/wf-pw page thumbnail grids.
 */
export function ThumbFlagBadge({ kind, className, ...rest }: ThumbFlagBadgeProps): React.ReactElement {
  return (
    <span className={cn('thumb-flag-badge', className)}>
      <FlagChip kind={kind} {...rest} />
    </span>
  );
}

ThumbFlagBadge.displayName = 'ThumbFlagBadge';
