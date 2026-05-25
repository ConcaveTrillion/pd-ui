import * as React from 'react';
import { BulkActionBar } from '../../primitives/BulkActionBar.js';
import { Button } from '../../primitives/Button.js';

// ─── Types ────────────────────────────────────────────────────────────────────

export type CropBulkAction =
  | 'redeskew' // Re-deskew only
  | 'rerunCrop' // Re-run from initial_crop
  | 'acceptAsIs' // Accept as-is (mark reviewed)
  | 'restoreDefault'; // Restore default bbox

export interface CropBulkBarProps {
  selectedCount: number;
  /** Pre-formatted flag summary (e.g. "2 over-crop · 1 deskew fail"). */
  flagSummary?: string;
  onAction: (action: CropBulkAction) => void;
  onClear?: () => void;
  /** Variant — passed to BulkActionBar. Default 'dock'. */
  variant?: 'dock' | 'float';
  'data-testid'?: string;
}

// ─── Component ────────────────────────────────────────────────────────────────

/**
 * CropBulkBar — Crop-stage bulk-actions bar.
 *
 * Composes the Phase 1 `BulkActionBar` primitive (variant='dock'|'float')
 * and fills its `actions` slot with the four crop-specific action buttons:
 *   - Re-deskew only
 *   - Re-run crop (N) — shows selected count
 *   - Accept as-is
 *   - Restore default
 *
 * Spec §6.2 line 276.
 */
export const CropBulkBar = React.forwardRef<HTMLDivElement, CropBulkBarProps>(
  function CropBulkBar(
    {
      selectedCount,
      flagSummary,
      onAction,
      onClear,
      variant = 'dock',
      'data-testid': testId,
    },
    ref,
  ) {
    const actions = (
      <>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onAction('redeskew')}
          data-testid="crop-bulk-bar-action-redeskew"
        >
          Re-deskew
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onAction('rerunCrop')}
          data-testid="crop-bulk-bar-action-rerunCrop"
        >
          Re-run crop ({selectedCount})
        </Button>
        <Button
          variant="primary"
          size="sm"
          onClick={() => onAction('acceptAsIs')}
          data-testid="crop-bulk-bar-action-acceptAsIs"
        >
          Accept as-is
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onAction('restoreDefault')}
          data-testid="crop-bulk-bar-action-restoreDefault"
        >
          Restore default
        </Button>
      </>
    );

    return (
      <BulkActionBar
        ref={ref}
        count={selectedCount}
        {...(flagSummary != null ? { flagSummary } : {})}
        actions={actions}
        {...(onClear != null ? { onClear } : {})}
        variant={variant}
        data-testid={testId ?? 'crop-bulk-bar'}
      />
    );
  },
);

CropBulkBar.displayName = 'CropBulkBar';
