import * as React from 'react';
import { Button } from '../../primitives/Button.js';
import {
  VALIDATION_DOWNLOAD_FOOTER,
  VALIDATION_DOWNLOAD_FOOTER_DOWNLOAD,
  VALIDATION_DOWNLOAD_FOOTER_FIX,
} from '../../testids/index.js';

// ─── Public types ─────────────────────────────────────────────────────────────

/** Discriminated union props for DownloadFooter. */
export type DownloadFooterProps =
  | {
      /** Pass: all checks green. Renders a primary Download button. */
      state: 'pass';
      fixableCount?: never;
      /** Called when the user clicks Download. Button is disabled when absent. */
      onDownload?: () => void;
      /** Called when the user clicks Fix. Not rendered in pass state. */
      onFix?: never;
      /** Override the root element's data-testid. */
      'data-testid'?: string;
    }
  | {
      /** Warn: checks passed with warnings. Renders "Download anyway" + "Fix & rebuild". */
      state: 'warn';
      fixableCount?: never;
      /** Called when the user clicks Download anyway. Button is disabled when absent. */
      onDownload?: () => void;
      /** Called when the user clicks Fix & rebuild. Button is disabled when absent. */
      onFix?: () => void;
      /** Override the root element's data-testid. */
      'data-testid'?: string;
    }
  | {
      /** Error: checks failed. Download is disabled; renders "Fix all (N)". */
      state: 'error';
      /** Count of auto-fixable errors. Required when state is 'error'. */
      fixableCount: number;
      /** Unused in error state — Download is always disabled. */
      onDownload?: () => void;
      /** Called when the user clicks Fix all (N). Button is disabled when absent. */
      onFix?: () => void;
      /** Override the root element's data-testid. */
      'data-testid'?: string;
    };

// ─── Component ────────────────────────────────────────────────────────────────

/**
 * DownloadFooter — contextual CTA footer for the Validation stage.
 *
 * Discriminated by `state`:
 *   - pass  → primary "Download" button (disabled when `onDownload` absent)
 *   - warn  → ghost "Download anyway" + primary "Fix & rebuild"
 *   - error → ghost "Download" (always disabled) + primary "Fix all (N)"
 *
 * Design ref: wf02/validation-panel.jsx lines 170-206.
 */
export function DownloadFooter({
  state,
  fixableCount,
  onDownload,
  onFix,
  'data-testid': testId = VALIDATION_DOWNLOAD_FOOTER,
}: DownloadFooterProps): React.ReactElement {
  // ── Pass ──────────────────────────────────────────────────────────────────
  if (state === 'pass') {
    return (
      <div
        data-testid={testId}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          padding: '16px',
          borderTop: '1px solid var(--border-1)',
        }}
      >
        <div style={{ flex: 1 }} />
        <Button
          variant="primary"
          size="lg"
          data-testid={VALIDATION_DOWNLOAD_FOOTER_DOWNLOAD}
          {...(onDownload != null ? { onClick: onDownload } : { disabled: true })}
        >
          Download
        </Button>
      </div>
    );
  }

  // ── Warn ──────────────────────────────────────────────────────────────────
  if (state === 'warn') {
    return (
      <div
        data-testid={testId}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          padding: '16px',
          borderTop: '1px solid var(--border-1)',
        }}
      >
        <div style={{ flex: 1 }} />
        <Button
          variant="ghost"
          size="lg"
          data-testid={VALIDATION_DOWNLOAD_FOOTER_DOWNLOAD}
          {...(onDownload != null ? { onClick: onDownload } : { disabled: true })}
        >
          Download anyway
        </Button>
        <Button
          variant="primary"
          size="lg"
          data-testid={VALIDATION_DOWNLOAD_FOOTER_FIX}
          {...(onFix != null ? { onClick: onFix } : { disabled: true })}
        >
          Fix &amp; rebuild
        </Button>
      </div>
    );
  }

  // ── Error ─────────────────────────────────────────────────────────────────
  return (
    <div
      data-testid={testId}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        padding: '16px',
        borderTop: '1px solid var(--border-1)',
      }}
    >
      <div style={{ flex: 1, fontSize: 12.5, color: 'var(--ink-2)' }}>
        Download disabled until errors resolved.
      </div>
      <Button variant="ghost" size="lg" disabled data-testid={VALIDATION_DOWNLOAD_FOOTER_DOWNLOAD}>
        Download
      </Button>
      <Button
        variant="primary"
        size="lg"
        data-testid={VALIDATION_DOWNLOAD_FOOTER_FIX}
        {...(onFix != null ? { onClick: onFix } : { disabled: true })}
      >
        Fix all ({fixableCount})
      </Button>
    </div>
  );
}

DownloadFooter.displayName = 'DownloadFooter';
