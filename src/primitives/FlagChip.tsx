import * as React from 'react';
import { cn } from './cn.js';

/**
 * Semantic flag kind vocabulary — covers the flag taxonomy used across
 * source / image / OCR pipeline stages.
 *
 * Consumers may pass arbitrary `string` kinds; known kinds get token-mapped
 * tones via CSS `data-kind` attribute.
 */
export type FlagKind =
  | 'blurry'
  | 'skew'
  | 'dark'
  | 'sparse'
  | 'cropped'
  | 'asymmetric'
  | 'loose'
  | 'under'
  | 'over'
  | 'halftone'
  | 'mixed'
  | 'residual'
  | 'baseline'
  | 'overflow'
  | 'blank'
  | 'misaligned'
  | 'low-conf'
  | 'no-text'
  | 'garbled'
  | 'mixed-lang'
  | 'errored'
  | (string & Record<never, never>);

export interface FlagChipProps {
  /** Flag kind — used to look up the tone if `tone` not provided. */
  kind: FlagKind;
  /** Count badge rendered inside the chip. Omitted if not provided. */
  count?: number;
  /** Whether the chip is selected/active — adds a tinted background. */
  active?: boolean;
  /** Click handler — makes the chip interactive. */
  onClick?: () => void;
  /** Mutes the chip (dimmed, deemphasized). */
  mute?: boolean;
  /** Override displayed text — defaults to `kind`. */
  label?: string;
  /** Override CSS custom property for the dot/border tone color. */
  tone?: string;
  className?: string;
}

/**
 * FlagChip — inline pill showing a flag category + optional count.
 *
 * Tone is driven by `data-kind` attribute in CSS (avoids inline hex).
 * Use `tone` prop only for non-standard kinds that need a custom color.
 */
export function FlagChip({
  kind,
  count,
  active,
  onClick,
  mute,
  label,
  tone,
  className,
}: FlagChipProps): React.ReactElement {
  const style: React.CSSProperties = tone != null ? { ['--flag-tone' as string]: tone } : {};

  return (
    <span
      className={cn(
        'flag-chip',
        active ? 'flag-chip--active' : undefined,
        mute ? 'flag-chip--muted' : undefined,
        className,
      )}
      data-kind={kind}
      style={style}
      onClick={onClick}
      onKeyDown={
        onClick != null
          ? (e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                onClick();
              }
            }
          : undefined
      }
      role={onClick != null ? 'button' : undefined}
      tabIndex={onClick != null ? 0 : undefined}
    >
      <span className="flag-chip__dot" />
      <span className="flag-chip__label">{label ?? kind}</span>
      {count != null ? <span className="flag-chip__count">{count}</span> : null}
    </span>
  );
}

FlagChip.displayName = 'FlagChip';
