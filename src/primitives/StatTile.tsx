import * as React from 'react';
import { cn } from './cn.js';

export type StatTileTone = 'clean' | 'dirty' | 'neutral';

export interface StatTileProps {
  /** Short uppercase label shown above the value. */
  label: string;
  /** Primary numeric or text value. */
  value: string;
  /** Optional secondary descriptor shown below the value. */
  sub?: string;
  /** Semantic tone modifier that tints the value text. */
  tone?: StatTileTone;
  className?: string;
}

/**
 * StatTile — a compact read-only metric tile.
 *
 * Renders a label / value / optional sub-label card.
 * Used in wf01 (source stats), wf05 (library stats), final/hyphen_join.
 * Token-only styling; no hex literals.
 */
export function StatTile({ label, value, sub, tone, className }: StatTileProps): React.ReactElement {
  return (
    <div
      className={cn(
        'stat-tile',
        tone != null && tone !== 'neutral' ? `stat-tile--${tone}` : undefined,
        className,
      )}
    >
      <div className="stat-tile__label">{label}</div>
      <div className="stat-tile__value">{value}</div>
      {sub != null ? <div className="stat-tile__sub">{sub}</div> : null}
    </div>
  );
}

StatTile.displayName = 'StatTile';
