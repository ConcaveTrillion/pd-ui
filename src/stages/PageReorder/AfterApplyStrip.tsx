import * as React from 'react';
import { Button } from '../../primitives/Button.js';
import { CheckCircle } from '../../icons/index.js';
import {
  REORDER_AFTER_APPLY_STRIP,
  REORDER_AFTER_APPLY_STRIP_UNDO,
} from '../../testids/index.js';

// ─── Public types ─────────────────────────────────────────────────────────────

export interface AfterApplyStripProps {
  /** Number of swaps that were accepted. */
  acceptedCount: number;
  /** Number of swaps that were skipped. */
  skippedCount: number;
  /**
   * Callback for the Undo affordance. When omitted the Undo button is hidden.
   */
  onUndo?: () => void;
  /** Override the root element's data-testid. Defaults to `REORDER_AFTER_APPLY_STRIP`. */
  'data-testid'?: string;
}

// ─── Component ────────────────────────────────────────────────────────────────

/**
 * AfterApplyStrip — post-apply confirmation strip for the Page Reorder stage.
 *
 * Renders a success-toned inline strip summarising accepted/skipped swap
 * counts and optionally a ghost "Undo" button.
 *
 * Design source: wf09/pages-tab.jsx lines 630-645.
 */
export function AfterApplyStrip({
  acceptedCount,
  skippedCount,
  onUndo,
  'data-testid': testId = REORDER_AFTER_APPLY_STRIP,
}: AfterApplyStripProps): React.ReactElement {
  const undoButton =
    onUndo != null ? (
      <Button
        variant="ghost"
        size="sm"
        data-testid={REORDER_AFTER_APPLY_STRIP_UNDO}
        onClick={onUndo}
      >
        Undo
      </Button>
    ) : null;

  return (
    <div className="after-apply-strip" data-testid={testId}>
      <CheckCircle
        className="after-apply-strip__icon"
        size={15}
        aria-hidden="true"
      />
      <span className="after-apply-strip__summary">
        {`Accepted ${acceptedCount} · Skipped ${skippedCount}`}
      </span>
      <div className="after-apply-strip__spacer" />
      {undoButton}
    </div>
  );
}

AfterApplyStrip.displayName = 'AfterApplyStrip';
