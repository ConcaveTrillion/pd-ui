/**
 * <ConfidenceBar> — horizontal progress bar showing OCR confidence (0–1).
 *
 * Uses CSS custom properties for color; no hex literals.
 * Uses role="progressbar" and aria-valuenow for accessibility.
 */

import * as React from 'react'
import { cn } from '../primitives/cn'

export interface ConfidenceBarProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * OCR confidence value in the range [0, 1].
   * Values outside this range are clamped. null/undefined renders as 0.
   */
  confidence: number | null | undefined
}

/**
 * <ConfidenceBar> — narrow horizontal bar showing OCR confidence.
 *
 * The fill color transitions from var(--mismatch) (low) through
 * var(--fuzzy) (mid) to var(--exact) (high), driven by a data attribute
 * so consuming apps can override via CSS.
 */
export const ConfidenceBar = React.forwardRef<HTMLDivElement, ConfidenceBarProps>(
  function ConfidenceBar({ confidence, className, style, ...props }, ref) {
    const raw = confidence ?? 0
    const pct = Math.max(0, Math.min(100, Math.round(raw * 100)))

    // Derive fill color token based on confidence bucket
    const fillColor =
      pct >= 80
        ? 'var(--exact)'
        : pct >= 50
          ? 'var(--fuzzy)'
          : 'var(--mismatch)'

    return (
      <div
        ref={ref}
        data-testid="confidence-bar"
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={pct}
        aria-label={`Confidence: ${pct}%`}
        className={cn('confidence-bar', className)}
        style={{
          position: 'relative',
          height: '4px',
          background: 'color-mix(in srgb, var(--ink-4) 15%, transparent)',
          borderRadius: '2px',
          overflow: 'hidden',
          ...style,
        }}
        {...props}
      >
        <div
          style={{
            position: 'absolute',
            inset: 0,
            width: `${pct}%`,
            background: fillColor,
            borderRadius: '2px',
            transition: 'width 120ms ease',
          }}
        />
      </div>
    )
  },
)

ConfidenceBar.displayName = 'ConfidenceBar'
