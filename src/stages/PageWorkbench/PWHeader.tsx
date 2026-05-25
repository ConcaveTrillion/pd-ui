/**
 * PWHeader — PageWorkbench title bar (Phase 2 M2).
 *
 * Layout (left → center → right):
 *   LEFT:   Breadcrumb (project / stage / page)
 *   CENTER: Page counter "p N of M" + Prev / Next buttons
 *   RIGHT:  EditModeSelector + actionsSlot
 *
 * Prev is disabled when currentIdx === 0.
 * Next is disabled when currentIdx >= total − 1.
 *
 * All colors use design-system CSS custom properties (no hex literals).
 */
import * as React from 'react';
import { Breadcrumb } from '../../shell/Breadcrumb.js';
import { Button } from '../../primitives/Button.js';
import { Icon } from '../../icons/Icon.js';
import { EditModeSelector } from './EditModeSelector.js';
import type { EditMode } from './EditModeSelector.js';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface PWHeaderProps {
  /** Breadcrumb segments rendered at the left of the header. */
  breadcrumb: ReadonlyArray<{ label: string; href?: string }>;
  /** 0-based index of the current page. */
  currentIdx: number;
  /** Total number of pages in the sequence. */
  total: number;
  /** Called when the user clicks Prev; omit or leave undefined to hide Prev. */
  onPrev?: () => void;
  /** Called when the user clicks Next; omit or leave undefined to hide Next. */
  onNext?: () => void;
  /** Currently active overlay edit mode (controlled). */
  mode: EditMode;
  /** Called with the newly selected mode when the user changes the segmented control. */
  onModeChange: (mode: EditMode) => void;
  /** Slot for action buttons rendered to the right of EditModeSelector. */
  actionsSlot?: React.ReactNode;
  /** Optional testid forwarded to the root <header> element. */
  'data-testid'?: string;
}

// ─── Helper: crumb rendering ─────────────────────────────────────────────────

function CrumbItem({ item, isLast }: { item: { label: string; href?: string }; isLast: boolean }) {
  return (
    <>
      <li>
        {item.href != null ? (
          <a
            href={item.href}
            style={{
              color: isLast ? 'var(--ink-1)' : 'var(--ink-3)',
              fontWeight: isLast ? 600 : undefined,
              textDecoration: 'none',
            }}
          >
            {item.label}
          </a>
        ) : (
          <span
            style={{
              color: isLast ? 'var(--ink-1)' : 'var(--ink-3)',
              fontWeight: isLast ? 600 : undefined,
            }}
          >
            {item.label}
          </span>
        )}
      </li>
      {!isLast && (
        <li aria-hidden="true" style={{ color: 'var(--ink-4)', lineHeight: 1 }}>
          <Icon name="chevR" size={11} />
        </li>
      )}
    </>
  );
}

// ─── Component ───────────────────────────────────────────────────────────────

/**
 * PWHeader — PageWorkbench header bar.
 *
 * Composes the existing `Breadcrumb` shell primitive, design-system `Button`
 * primitives for page navigation, and `EditModeSelector` for the overlay-mode
 * segmented control. An `actionsSlot` accepts arbitrary action buttons at the
 * far right (e.g. "Mark reviewed", "Find similar").
 *
 * Controlled: callers own `currentIdx`, `mode`, and their respective setters.
 */
export function PWHeader({
  breadcrumb,
  currentIdx,
  total,
  onPrev,
  onNext,
  mode,
  onModeChange,
  actionsSlot,
  'data-testid': testId,
}: PWHeaderProps) {
  const isPrevDisabled = currentIdx <= 0;
  const isNextDisabled = currentIdx >= total - 1;

  const testidProps = testId !== undefined ? { 'data-testid': testId } : {};

  return (
    <header
      className="pw-header"
      style={{
        height: 56,
        padding: '0 var(--space-8)',
        borderBottom: '1px solid var(--border-1)',
        background: 'var(--bg-surface)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 'var(--space-4)',
        flexShrink: 0,
      }}
      {...testidProps}
    >
      {/* ── LEFT: Breadcrumb ─────────────────────────────────────── */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 'var(--space-3)',
          minWidth: 0,
          overflow: 'hidden',
        }}
      >
        <Breadcrumb>
          {breadcrumb.map((item, i) => (
            <CrumbItem key={i} item={item} isLast={i === breadcrumb.length - 1} />
          ))}
        </Breadcrumb>
      </div>

      {/* ── CENTER: Page counter + Prev/Next ─────────────────────── */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 'var(--space-2)',
          flexShrink: 0,
        }}
      >
        <Button
          variant="ghost"
          size="sm"
          icon={<Icon name="chevL" size={12} />}
          disabled={isPrevDisabled}
          onClick={onPrev}
          aria-label="Previous page"
          data-testid="pw-header-prev"
        >
          Prev
        </Button>

        <span
          data-testid="pw-header-counter"
          style={{
            fontSize: 12,
            color: 'var(--ink-2)',
            minWidth: 84,
            textAlign: 'center',
            userSelect: 'none',
          }}
        >
          {'p '}
          <span style={{ color: 'var(--ink-1)', fontWeight: 600 }}>{currentIdx + 1}</span>
          <span style={{ color: 'var(--ink-4)' }}>{' of '}</span>
          <span style={{ color: 'var(--ink-2)' }}>{total}</span>
        </span>

        <Button
          variant="ghost"
          size="sm"
          iconRight={<Icon name="chevR" size={12} />}
          disabled={isNextDisabled}
          onClick={onNext}
          aria-label="Next page"
          data-testid="pw-header-next"
        >
          Next
        </Button>
      </div>

      {/* ── RIGHT: EditModeSelector + actionsSlot ────────────────── */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 'var(--space-2)',
          flexShrink: 0,
        }}
      >
        <EditModeSelector mode={mode} onModeChange={onModeChange} />
        {actionsSlot != null && (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 'var(--space-2)',
              marginLeft: 'var(--space-2)',
              paddingLeft: 'var(--space-2)',
              borderLeft: '1px solid var(--border-1)',
            }}
          >
            {actionsSlot}
          </div>
        )}
      </div>
    </header>
  );
}

PWHeader.displayName = 'PWHeader';
