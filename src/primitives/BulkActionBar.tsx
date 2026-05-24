import * as React from 'react';
import { cn } from './cn.js';
import { Button } from './Button.js';
import { KeyCap } from './KeyCap.js';

/**
 * Visual variant of BulkActionBar:
 *   dock  — fixed-height bottom bar docked inside a panel, with a top border
 *           (wf03 / wf11 / wf-pw pattern: bg-surface, border-top)
 *   float — absolutely-positioned floating card above scroll content
 *           (wf10 crops-grid pattern: bg-surface, border, shadow-floating)
 *
 * When omitted, no variant modifier class is added; layout is controlled by
 * the consumer's CSS.
 */
export type BulkActionBarVariant = 'dock' | 'float';

export interface BulkActionBarProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Number of currently selected items.
   * Rendered as "{count} selected".
   */
  count: number;
  /**
   * Optional descriptive summary shown alongside the count — e.g.
   * "2 over-crop · 1 deskew·fail".
   */
  flagSummary?: string;
  /**
   * Slot for stage-specific action buttons (e.g. Re-run, Mark as, Open workbench).
   * Renders in the actions container between the count/summary and the Clear button.
   */
  actions?: React.ReactNode;
  /**
   * Called when the user clicks the Clear button.
   * When omitted the Clear button is rendered but disabled.
   */
  onClear?: () => void;
  /**
   * Layout variant. See BulkActionBarVariant.
   */
  variant?: BulkActionBarVariant;
}

/**
 * BulkActionBar — sticky bulk-selection action bar.
 *
 * Cross-stage molecule used across crops-grid, pages-table, and worklist stages.
 * Appears when one or more items are selected; provides a count, optional flag
 * summary, a stage-specific action slot, and a keyboard-hint + Clear button.
 *
 * Ported from:
 *   - wf03/wf03-variations.jsx `BulkActionBar` (dock variant)
 *   - wf10/crops-grid.jsx `BulkActionBar` (float variant)
 *
 * Note: the design source.jsx exports a similar component as `BulkBar` (for the
 * source-management stage with an inverted --ink-1 background). That component
 * has a different visual language and is intentionally NOT merged here; this
 * `BulkActionBar` targets the `--bg-surface` pattern used in 4 of the 5 cross-stage
 * files. The issue title says "BulkBar" but the port-plan Table 4 target is
 * `BulkActionBar` — we use `BulkActionBar` as the canonical export name.
 */
export const BulkActionBar = React.forwardRef<HTMLDivElement, BulkActionBarProps>(
  function BulkActionBar(
    { className, count, flagSummary, actions, onClear, variant, ...props },
    ref,
  ) {
    return (
      <div
        ref={ref}
        className={cn(
          'bulk-action-bar',
          variant != null ? `bulk-action-bar--${variant}` : undefined,
          className,
        )}
        {...props}
      >
        {/* Left: count + optional flag summary */}
        <div className="bulk-action-bar__info">
          <span className="bulk-action-bar__count">{count} selected</span>
          {flagSummary != null ? (
            <span
              className="bulk-action-bar__flag-summary"
              data-testid="bulk-action-bar-flag-summary"
            >
              {flagSummary}
            </span>
          ) : null}
        </div>

        {/* Center: stage-specific action slot */}
        {actions != null ? (
          <div
            className="bulk-action-bar__actions"
            data-testid="bulk-action-bar-actions"
          >
            {actions}
          </div>
        ) : null}

        {/* Right: keyboard hint + clear */}
        <div className="bulk-action-bar__end">
          <span className="bulk-action-bar__hint">
            <KeyCap keys="Shift" />
            +<KeyCap keys="click" /> to range-select &middot;{' '}
            <KeyCap keys="esc" /> to clear
          </span>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClear}
            disabled={onClear == null}
            aria-label="Clear selection"
          >
            Clear
          </Button>
        </div>
      </div>
    );
  },
);

BulkActionBar.displayName = 'BulkActionBar';
