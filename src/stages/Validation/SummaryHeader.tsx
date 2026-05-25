import * as React from 'react';
import { Banner } from '../../primitives/Banner.js';
import { CheckIcon } from '../../primitives/CheckIcon.js';
import { Button } from '../../primitives/Button.js';
import { VALIDATION_SUMMARY_HEADER, VALIDATION_SUMMARY_HEADER_CTA } from '../../testids/index.js';

// ─── Public types ─────────────────────────────────────────────────────────────

/** Overall validation result state. */
export type ValidationState = 'pass' | 'warn' | 'error';

/** Count of validation check outcomes. */
export interface ValidationCounts {
  pass: number;
  warn: number;
  error: number;
  skip?: number;
}

export interface SummaryHeaderProps {
  /** Overall validation state — drives tone, headline, and primary CTA. */
  state: ValidationState;
  /** Count of checks in each outcome bucket. */
  counts: ValidationCounts;
  /**
   * Called when the user clicks Download (pass state).
   * Only rendered when `state === 'pass'`.
   */
  onDownload?: () => void;
  /**
   * Called when the user clicks Fix All (warn/error states).
   * Only rendered when `state` is `'warn'` or `'error'`.
   */
  onFixAll?: () => void;
  /** Override the root element's data-testid. Defaults to `VALIDATION_SUMMARY_HEADER`. */
  'data-testid'?: string;
}

// ─── Config ───────────────────────────────────────────────────────────────────

interface StateConfig {
  tone: 'success' | 'warning' | 'danger';
  title: string;
  subtitleFn: (counts: ValidationCounts) => string;
}

const STATE_CONFIG: Record<ValidationState, StateConfig> = {
  pass: {
    tone: 'success',
    title: 'Package validation passed',
    subtitleFn: (c) => `${c.pass} check${c.pass !== 1 ? 's' : ''} passed — ready to download.`,
  },
  warn: {
    tone: 'warning',
    title: 'Package ready with warnings',
    subtitleFn: (c) =>
      `${c.warn} check${c.warn !== 1 ? 's' : ''} raised warnings — review before uploading.`,
  },
  error: {
    tone: 'danger',
    title: 'Package has errors',
    subtitleFn: (c) =>
      `${c.error} check${c.error !== 1 ? 's' : ''} failed — fix before uploading to PGDP.`,
  },
};

// ─── Count chips ──────────────────────────────────────────────────────────────

interface CountChipsProps {
  counts: ValidationCounts;
}

function CountChips({ counts }: CountChipsProps): React.ReactElement {
  return (
    <span className="validation-summary-header__counts">
      {counts.pass > 0 ? (
        <span className="validation-summary-header__chip validation-summary-header__chip--pass">
          <CheckIcon state="pass" size={12} />
          {counts.pass}
        </span>
      ) : null}
      {counts.warn > 0 ? (
        <span className="validation-summary-header__chip validation-summary-header__chip--warn">
          <CheckIcon state="warn" size={12} />
          {counts.warn}
        </span>
      ) : null}
      {counts.error > 0 ? (
        <span className="validation-summary-header__chip validation-summary-header__chip--error">
          <CheckIcon state="error" size={12} />
          {counts.error}
        </span>
      ) : null}
      {counts.skip != null && counts.skip > 0 ? (
        <span className="validation-summary-header__chip validation-summary-header__chip--skip">
          <CheckIcon state="skip" size={12} />
          {counts.skip}
        </span>
      ) : null}
    </span>
  );
}

// ─── Component ────────────────────────────────────────────────────────────────

/**
 * SummaryHeader — pass/warn/error state banner for the Validation stage.
 *
 * Maps `state` to the shared `Banner` primitive via tone, renders check-count
 * chips inline, and surfaces a single primary CTA:
 *   - pass  → Download (calls `onDownload`)
 *   - warn  → Fix All  (calls `onFixAll`)
 *   - error → Fix All  (calls `onFixAll`)
 *
 * `DownloadFooter` (a later sibling) handles secondary actions like
 * "Download anyway" in the warn state.
 */
export function SummaryHeader({
  state,
  counts,
  onDownload,
  onFixAll,
  'data-testid': testId = VALIDATION_SUMMARY_HEADER,
}: SummaryHeaderProps): React.ReactElement {
  const config = STATE_CONFIG[state];

  const leadingSlot = (
    <CheckIcon state={state === 'pass' ? 'pass' : state === 'warn' ? 'warn' : 'error'} size={24} />
  );

  const headline = (
    <span className="validation-summary-header__headline-row">
      {config.title}
      <CountChips counts={counts} />
    </span>
  );

  let cta: React.ReactNode = null;
  if (state === 'pass' && onDownload != null) {
    cta = (
      <Button
        variant="primary"
        size="sm"
        data-testid={VALIDATION_SUMMARY_HEADER_CTA}
        onClick={onDownload}
      >
        Download
      </Button>
    );
  } else if ((state === 'warn' || state === 'error') && onFixAll != null) {
    cta = (
      <Button
        variant="primary"
        size="sm"
        data-testid={VALIDATION_SUMMARY_HEADER_CTA}
        onClick={onFixAll}
      >
        Fix All
      </Button>
    );
  }

  return (
    <Banner
      tone={config.tone}
      headline={headline}
      subtext={config.subtitleFn(counts)}
      leadingSlot={leadingSlot}
      {...(cta != null ? { actions: cta } : {})}
      data-testid={testId}
    />
  );
}

SummaryHeader.displayName = 'SummaryHeader';
