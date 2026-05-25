import * as React from 'react';
import { Popover, PopoverAnchor, PopoverContent } from '../../primitives/Popover.js';
import { Button } from '../../primitives/Button.js';
import { Badge } from '../../primitives/Badge.js';
import type { BadgeTone } from '../../primitives/Badge.js';
import {
  SCANNO_INLINE_MARK_POPOVER,
  SCANNO_INLINE_MARK_POPOVER_ACCEPT,
  SCANNO_INLINE_MARK_POPOVER_DISMISS,
  SCANNO_INLINE_MARK_POPOVER_PROMOTE,
} from '../../testids/index.js';

// ─── Types ────────────────────────────────────────────────────────────────────

/**
 * The source that flagged this inline mark token.
 *
 * - `'rule'`   — matched a pattern/dictionary rule
 * - `'ocr'`    — flagged as low-confidence OCR output
 * - `'manual'` — manually marked by the user
 */
export type InlineMarkSource = 'rule' | 'ocr' | 'manual';

/** A scanno token passed to InlineMarkPopover. */
export interface InlineMarkToken {
  /** Display text of the suspect token. */
  text: string;
  /** Detection source that flagged this token. */
  source: InlineMarkSource;
  /** Confidence score in [0, 1]. Rendered as percentage when present. */
  confidence?: number;
  /** Rule identifier when source is 'rule'. */
  ruleId?: string;
}

/** Props for InlineMarkPopover. */
export interface InlineMarkPopoverProps {
  /** Token data to display. */
  token: InlineMarkToken;
  /** Whether the popover is open (controlled). */
  open: boolean;
  /** Called when the popover requests to close (Radix outside-click / Escape). */
  onClose: () => void;
  /** Called when the user accepts the suggestion. */
  onAccept?: () => void;
  /** Called when the user dismisses the suggestion. */
  onDismiss?: () => void;
  /** Called when the user promotes the token to a new candidate. */
  onPromote?: () => void;
}

// ─── Source → badge tone map ──────────────────────────────────────────────────

const sourceTone: Record<InlineMarkSource, BadgeTone> = {
  rule: 'fuzzy',
  ocr: 'ocr',
  manual: 'gt',
};

// ─── Component ────────────────────────────────────────────────────────────────

/**
 * InlineMarkPopover — controlled popover on token click.
 *
 * Displays token text, confidence percentage (when present), source badge,
 * optional ruleId, and three action buttons: Accept, Dismiss, Promote.
 *
 * Composes the Radix-based `Popover` primitive.  The parent controls `open`
 * and `onClose`; all three action callbacks are optional.
 */
export function InlineMarkPopover({
  token,
  open,
  onClose,
  ...optionalCallbacks
}: InlineMarkPopoverProps) {
  const { onAccept, onDismiss, onPromote } = optionalCallbacks;

  return (
    <Popover
      open={open}
      onOpenChange={(isOpen) => {
        if (!isOpen) onClose();
      }}
    >
      {/* Anchor keeps the popover attached to the inline token site. */}
      <PopoverAnchor />
      <PopoverContent
        side="bottom"
        align="center"
        sideOffset={8}
        data-testid={SCANNO_INLINE_MARK_POPOVER}
        className="inline-mark-popover"
      >
        {/* ── Header: token text + confidence ─────────────────────────── */}
        <div className="inline-mark-popover__header">
          <span className="inline-mark-popover__token mono">{token.text}</span>
          {token.confidence !== undefined ? (
            <span className="inline-mark-popover__confidence">
              {Math.round(token.confidence * 100)}%
            </span>
          ) : null}
        </div>

        {/* ── Meta row: source badge + optional ruleId ─────────────────── */}
        <div className="inline-mark-popover__meta">
          <Badge tone={sourceTone[token.source]}>{token.source}</Badge>
          {token.ruleId !== undefined ? (
            <span className="inline-mark-popover__rule-id mono">{token.ruleId}</span>
          ) : null}
        </div>

        {/* ── Divider ──────────────────────────────────────────────────── */}
        <div className="inline-mark-popover__divider" aria-hidden="true" />

        {/* ── Actions ──────────────────────────────────────────────────── */}
        <div className="inline-mark-popover__actions">
          <Button
            variant="primary"
            size="sm"
            full
            data-testid={SCANNO_INLINE_MARK_POPOVER_ACCEPT}
            {...(onAccept !== undefined ? { onClick: onAccept } : {})}
          >
            Accept
          </Button>
          <Button
            variant="ghost"
            size="sm"
            full
            data-testid={SCANNO_INLINE_MARK_POPOVER_DISMISS}
            {...(onDismiss !== undefined ? { onClick: onDismiss } : {})}
          >
            Dismiss
          </Button>
          <Button
            variant="ghost"
            size="sm"
            full
            data-testid={SCANNO_INLINE_MARK_POPOVER_PROMOTE}
            {...(onPromote !== undefined ? { onClick: onPromote } : {})}
          >
            Promote
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}

InlineMarkPopover.displayName = 'InlineMarkPopover';
