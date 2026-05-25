import * as React from 'react';
import { SCANNO_TOKEN } from '../../testids/index.js';

// ─── Types ────────────────────────────────────────────────────────────────────

/**
 * The source that flagged this scanno token.
 *
 * - `'rule'`   — matched a pattern/dictionary rule (uses --fuzzy underline)
 * - `'ocr'`    — flagged as low-confidence OCR output (uses --ocr underline)
 * - `'manual'` — manually marked by the user (uses --gt underline)
 */
export type ScannoSource = 'rule' | 'ocr' | 'manual';

/** Props for the ScannoToken component. */
export interface ScannoTokenProps {
  /** The display text of the suspect token. */
  token: string;
  /** Which detection source flagged this token. Controls underline color. */
  source: ScannoSource;
  /**
   * Click handler. When provided the root element is rendered as a `<button>`
   * for correct keyboard and a11y semantics; otherwise a `<span>`.
   */
  onClick?: () => void;
  'data-testid'?: string;
}

// ─── Component ────────────────────────────────────────────────────────────────

/**
 * ScannoToken — inline underlined span (or button) marking a suspect token
 * in page text during the Scannos review stage.
 *
 * The underline color is derived from the `source` prop via CSS modifier
 * classes (`.scanno-token--rule`, `.scanno-token--ocr`, `.scanno-token--manual`),
 * each mapping to a design-system token.
 *
 * Renders a `<button>` when `onClick` is provided; a `<span>` otherwise.
 */
export function ScannoToken({
  token,
  source,
  onClick,
  'data-testid': testId = SCANNO_TOKEN,
}: ScannoTokenProps) {
  const className = `scanno-token scanno-token--${source}`;
  const commonProps = {
    className,
    'data-testid': testId,
    'data-source': source,
  };

  if (onClick !== undefined) {
    return (
      <button type="button" {...commonProps} onClick={onClick}>
        {token}
      </button>
    );
  }

  return <span {...commonProps}>{token}</span>;
}

ScannoToken.displayName = 'ScannoToken';
