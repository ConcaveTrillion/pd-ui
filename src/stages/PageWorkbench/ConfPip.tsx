/**
 * ConfPip — confidence pip indicator (INTERNAL).
 *
 * Renders a small colored badge whose tone reflects OCR confidence:
 *   ≥ 0.9  → exact   (var(--exact),    green)
 *   ≥ 0.7  → fuzzy   (var(--fuzzy),    amber)
 *   < 0.7  → mismatch (var(--mismatch), red)
 *
 * NOT exported from the PageWorkbench barrel — internal only.
 */
import * as React from 'react';

export interface ConfPipProps {
  /** Confidence value 0–1. */
  confidence: number;
}

/**
 * ConfPip — visual confidence indicator used inside WordCard and WordRow.
 *
 * Uses CSS custom properties only; no hex literals.
 */
export function ConfPip({ confidence }: ConfPipProps): React.ReactElement {
  const tone =
    confidence >= 0.9 ? 'var(--exact)' : confidence >= 0.7 ? 'var(--fuzzy)' : 'var(--mismatch)';

  const sym = confidence >= 0.9 ? '✓' : confidence >= 0.7 ? '↻' : '✗';

  return (
    <span
      className="conf-pip"
      aria-label={`Confidence ${Math.round(confidence * 100)}%`}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 3,
        padding: '1px 5px',
        borderRadius: 3,
        fontSize: 10,
        fontWeight: 600,
        background: `color-mix(in oklab, ${tone} 14%, var(--bg-surface))`,
        border: `1px solid color-mix(in oklab, ${tone} 50%, var(--border-1))`,
        color: 'var(--ink-1)',
      }}
    >
      <span style={{ color: tone }}>{sym}</span>
      <span style={{ fontVariantNumeric: 'tabular-nums' }}>{confidence.toFixed(2)}</span>
    </span>
  );
}
