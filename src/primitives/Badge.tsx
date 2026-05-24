import * as React from 'react';
import { cn } from './cn.js';

export type BadgeVariant = 'default' | 'primary' | 'danger';

/**
 * Semantic tone for the Badge.  Each tone maps to a status token in tokens.css:
 *   neutral         → --ink-2 / --bg-raised (no tint)
 *   brand           → --accent
 *   clean / exact   → --exact
 *   dirty / fuzzy / review → --fuzzy
 *   running / ocr   → --ocr
 *   failed / mismatch / error → --mismatch
 *   gt              → --gt
 */
export type BadgeTone =
  | 'neutral'
  | 'brand'
  | 'clean'
  | 'exact'
  | 'dirty'
  | 'fuzzy'
  | 'review'
  | 'running'
  | 'ocr'
  | 'failed'
  | 'mismatch'
  | 'error'
  | 'gt';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  /** Structural variant (pre-existing, non-breaking). */
  variant?: BadgeVariant;
  /** Semantic tone — maps to status tokens in tokens.css. */
  tone?: BadgeTone;
  /** When true, renders a small coloured dot before children (only for non-neutral tones). */
  dot?: boolean;
  /** When true, applies monospace font family via badge--mono class. */
  mono?: boolean;
}

export const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(function Badge(
  { className, variant, tone, dot, mono, children, ...props },
  ref,
) {
  const isNeutral = tone === undefined || tone === 'neutral';

  return (
    <span
      ref={ref}
      className={cn(
        'badge',
        variant === 'default' ? undefined : variant,
        tone !== undefined ? `badge--tone-${tone}` : undefined,
        dot ? 'badge--dot' : undefined,
        mono ? 'badge--mono' : undefined,
        className,
      )}
      {...props}
    >
      {dot && !isNeutral ? (
        <span className="badge__dot" aria-hidden="true" />
      ) : null}
      {children}
    </span>
  );
});

Badge.displayName = 'Badge';
