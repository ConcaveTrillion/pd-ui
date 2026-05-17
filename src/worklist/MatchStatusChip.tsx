/**
 * <MatchStatusChip> — compact status chip for word/line match status.
 *
 * Renders a small colored chip indicating exact/fuzzy/mismatch/none.
 * Uses CSS custom properties for color; no hex literals.
 * Pairs with <StatusPip> (from primitives) for larger status indicators.
 */

import * as React from 'react'
import { cn } from '../primitives/cn'
import type { MatchStatus } from './types'

export interface MatchStatusChipProps extends React.HTMLAttributes<HTMLSpanElement> {
  /** The match status to display. */
  status: MatchStatus
  /** Optional label text. When omitted, renders just the colored dot. */
  label?: string | undefined
}

// Color token map — drives both text and background via color-mix
const statusToken: Record<MatchStatus, string> = {
  exact: 'var(--exact)',
  fuzzy: 'var(--fuzzy)',
  mismatch: 'var(--mismatch)',
  none: 'var(--ink-3)',
}

/**
 * <MatchStatusChip> — colored chip for a word/line match status.
 * Exported from the worklist barrel for use in custom renderRow fills.
 */
export const MatchStatusChip = React.forwardRef<HTMLSpanElement, MatchStatusChipProps>(
  function MatchStatusChip({ status, label, className, style, ...props }, ref) {
    const token = statusToken[status]

    return (
      <span
        ref={ref}
        data-testid={`match-status-chip-${status}`}
        className={cn('match-status-chip', className)}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '4px',
          padding: '1px 6px',
          borderRadius: '3px',
          fontSize: 'var(--text-xs)',
          fontWeight: 500,
          color: token,
          background: `color-mix(in srgb, ${token} 12%, var(--bg-surface))`,
          border: `1px solid color-mix(in srgb, ${token} 25%, transparent)`,
          ...style,
        }}
        {...props}
      >
        <span
          style={{
            width: '6px',
            height: '6px',
            borderRadius: '50%',
            background: token,
            flexShrink: 0,
          }}
        />
        {label !== undefined && <span>{label}</span>}
      </span>
    )
  },
)

MatchStatusChip.displayName = 'MatchStatusChip'
