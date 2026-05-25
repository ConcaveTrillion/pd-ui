import * as React from 'react';
import { CheckIcon } from '../../primitives/CheckIcon.js';
import { PageChip } from '../../primitives/PageChip.js';
import { Icon } from '../../icons/Icon.js';
import {
  VALIDATION_CHECK_ROW,
  validationCheckRowTestId,
} from '../../testids/index.js';

// ─── Public types ─────────────────────────────────────────────────────────────

/** A single affected page entry. */
export interface CheckRowPage {
  id: string;
  prefix: string;
}

/** The check descriptor passed to CheckRow. */
export interface CheckRowCheck {
  id: string;
  name: string;
  state: 'pass' | 'warn' | 'error' | 'running' | 'skip';
  affectedPages?: Array<CheckRowPage>;
}

export interface CheckRowProps {
  /** The validation check to display. */
  check: CheckRowCheck;
  /** Whether the row is currently expanded (controlled). */
  expanded: boolean;
  /** Called with `check.id` when the user toggles the row. */
  onToggle: (id: string) => void;
  /** Whether this is the last row (suppresses bottom border). */
  lastRow?: boolean;
  /** Forwarded to the root element for Playwright targeting. */
  'data-testid'?: string;
}

// ─── Constants ────────────────────────────────────────────────────────────────

const COLLAPSED_MAX = 5;

// ─── Component ────────────────────────────────────────────────────────────────

/**
 * CheckRow — collapsible validation check row.
 *
 * Collapsed: shows check name + CheckIcon + up to 5 PageChips (+ overflow badge).
 * Expanded: shows full affected-page list in a `<ul>`.
 *
 * The row toggle is a `<button>` — keyboard accessible (Enter / Space).
 *
 * Design ref: wf02/validation-panel.jsx lines 42-100.
 */
export function CheckRow({
  check,
  expanded,
  onToggle,
  lastRow,
  'data-testid': testId,
}: CheckRowProps): React.ReactElement {
  const { id, name, state, affectedPages } = check;
  const pages = affectedPages ?? [];

  const handleToggle = React.useCallback(() => {
    onToggle(id);
  }, [id, onToggle]);

  // Collapsed chips — up to COLLAPSED_MAX, then overflow badge
  const collapsedChips = pages.slice(0, COLLAPSED_MAX);
  const overflow = pages.length - COLLAPSED_MAX;

  // Expanded full list
  const expandedPages = pages;

  const canToggle = state !== 'pass' && state !== 'running';

  return (
    <div
      data-testid={testId ?? validationCheckRowTestId(id)}
      data-check-row={VALIDATION_CHECK_ROW}
      style={{
        borderBottom: lastRow === true ? 'none' : '1px solid var(--border-1)',
        background: expanded ? 'var(--bg-raised)' : 'transparent',
      }}
    >
      {/* Row header */}
      <button
        type="button"
        aria-expanded={expanded}
        onClick={handleToggle}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          padding: '12px 16px',
          cursor: 'pointer',
          width: '100%',
          background: 'transparent',
          border: 'none',
          textAlign: 'left',
        }}
      >
        <CheckIcon state={state} />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              flexWrap: 'wrap',
            }}
          >
            <span
              style={{ fontSize: 13, fontWeight: 600, color: 'var(--ink-1)' }}
            >
              {name}
            </span>
            {/* Collapsed page chips */}
            {!expanded && collapsedChips.length > 0 && (
              <div
                style={{ display: 'flex', gap: 4, flexWrap: 'wrap', alignItems: 'center' }}
              >
                {collapsedChips.map((page) => (
                  <PageChip key={page.id} prefix={page.prefix} />
                ))}
                {overflow > 0 && (
                  <span
                    style={{
                      fontSize: 11,
                      color: 'var(--ink-3)',
                      fontStyle: 'normal',
                    }}
                  >
                    +{overflow} more
                  </span>
                )}
              </div>
            )}
          </div>
        </div>
        {canToggle && (
          <span style={{ color: 'var(--ink-4)', flexShrink: 0, display: 'inline-flex' }}>
            <Icon name={expanded ? 'chevD' : 'chevR'} size={14} />
          </span>
        )}
      </button>

      {/* Expanded affected-pages region */}
      {expanded && expandedPages.length > 0 && (
        <div
          style={{
            padding: '0 16px 14px 50px',
            display: 'flex',
            flexDirection: 'column',
            gap: 10,
          }}
        >
          <div
            style={{
              fontSize: 11.5,
              color: 'var(--ink-3)',
            }}
          >
            Affected pages
          </div>
          <ul
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: 6,
              listStyle: 'none',
              margin: 0,
              padding: 0,
            }}
          >
            {expandedPages.map((page) => (
              <li key={page.id}>
                <PageChip prefix={page.prefix} />
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

CheckRow.displayName = 'CheckRow';
