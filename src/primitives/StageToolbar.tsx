import * as React from 'react';
import { cn } from './cn.js';

export interface StageToolbarProps {
  /** Left slot — typically filter chip group. */
  leftSlot?: React.ReactNode;
  /** Center slot — typically density toggle or view-mode segmented. */
  centerSlot?: React.ReactNode;
  /** Right slot — typically primary actions / CTAs. */
  rightSlot?: React.ReactNode;
  /** When true, makes the toolbar sticky at the top of its scroll container. */
  sticky?: boolean;
  className?: string;
  'data-testid'?: string;
  /** Accessible label for the toolbar landmark. */
  'aria-label'?: string;
}

/**
 * StageToolbar — 3-slot horizontal toolbar shell for stage page headers.
 *
 * Replaces stage-specific toolbar chrome (FileToolbar, CropToolbar, etc.)
 * with a generic slot-based surface. Sticky positioning is CSS-only via
 * the `data-sticky` attribute so consumers can style it with tokens.
 *
 * Distinct from FilterToolbar, which is a single-line search input.
 */
export function StageToolbar({
  leftSlot,
  centerSlot,
  rightSlot,
  sticky,
  className,
  'data-testid': testId,
  'aria-label': ariaLabel,
}: StageToolbarProps): React.ReactElement {
  return (
    <div
      className={cn('stage-toolbar', className)}
      data-sticky={sticky === true ? 'true' : undefined}
      role="toolbar"
      aria-label={ariaLabel ?? 'Stage toolbar'}
      data-testid={testId}
    >
      {leftSlot !== undefined && leftSlot !== null && (
        <div className="stage-toolbar__left">{leftSlot}</div>
      )}
      {centerSlot !== undefined && centerSlot !== null && (
        <div className="stage-toolbar__center">{centerSlot}</div>
      )}
      {rightSlot !== undefined && rightSlot !== null && (
        <div className="stage-toolbar__right">{rightSlot}</div>
      )}
    </div>
  );
}

StageToolbar.displayName = 'StageToolbar';
