import * as React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { SummaryHeader } from './SummaryHeader.js';
import type { ValidationCounts } from './SummaryHeader.js';
import { VALIDATION_SUMMARY_HEADER, VALIDATION_SUMMARY_HEADER_CTA } from '../../testids/index.js';

// ── helpers ───────────────────────────────────────────────────────────────────

const passCounts: ValidationCounts = { pass: 8, warn: 0, error: 0 };
const warnCounts: ValidationCounts = { pass: 6, warn: 2, error: 0 };
const errorCounts: ValidationCounts = { pass: 4, warn: 1, error: 3 };

// ── pass state ────────────────────────────────────────────────────────────────

describe('SummaryHeader — pass state', () => {
  it('renders root with correct testid', () => {
    render(<SummaryHeader state="pass" counts={passCounts} />);
    expect(screen.getByTestId(VALIDATION_SUMMARY_HEADER)).toBeInTheDocument();
  });

  it('uses success Banner tone (data-tone=success)', () => {
    render(<SummaryHeader state="pass" counts={passCounts} />);
    expect(screen.getByTestId(VALIDATION_SUMMARY_HEADER)).toHaveAttribute('data-tone', 'success');
  });

  it('renders the pass headline', () => {
    render(<SummaryHeader state="pass" counts={passCounts} />);
    expect(screen.getByText(/Package validation passed/)).toBeInTheDocument();
  });

  it('renders pass count chip', () => {
    render(<SummaryHeader state="pass" counts={passCounts} />);
    // The count "8" should appear alongside the pass icon
    expect(screen.getByText('8')).toBeInTheDocument();
  });

  it('renders Download CTA when onDownload is provided', () => {
    render(<SummaryHeader state="pass" counts={passCounts} onDownload={vi.fn()} />);
    expect(screen.getByTestId(VALIDATION_SUMMARY_HEADER_CTA)).toHaveTextContent('Download');
  });

  it('does not render CTA when onDownload is omitted', () => {
    render(<SummaryHeader state="pass" counts={passCounts} />);
    expect(screen.queryByTestId(VALIDATION_SUMMARY_HEADER_CTA)).not.toBeInTheDocument();
  });

  it('calls onDownload when Download is clicked', async () => {
    const user = userEvent.setup();
    const onDownload = vi.fn();
    render(<SummaryHeader state="pass" counts={passCounts} onDownload={onDownload} />);
    await user.click(screen.getByTestId(VALIDATION_SUMMARY_HEADER_CTA));
    expect(onDownload).toHaveBeenCalledTimes(1);
  });

  it('does not render Fix All CTA even if onFixAll is provided', () => {
    render(<SummaryHeader state="pass" counts={passCounts} onFixAll={vi.fn()} />);
    const cta = screen.queryByTestId(VALIDATION_SUMMARY_HEADER_CTA);
    // Either no CTA or CTA is Download, never Fix All
    if (cta != null) {
      expect(cta).not.toHaveTextContent('Fix All');
    }
  });
});

// ── warn state ────────────────────────────────────────────────────────────────

describe('SummaryHeader — warn state', () => {
  it('renders root with correct testid', () => {
    render(<SummaryHeader state="warn" counts={warnCounts} />);
    expect(screen.getByTestId(VALIDATION_SUMMARY_HEADER)).toBeInTheDocument();
  });

  it('uses warning Banner tone (data-tone=warning)', () => {
    render(<SummaryHeader state="warn" counts={warnCounts} />);
    expect(screen.getByTestId(VALIDATION_SUMMARY_HEADER)).toHaveAttribute('data-tone', 'warning');
  });

  it('renders the warn headline', () => {
    render(<SummaryHeader state="warn" counts={warnCounts} />);
    expect(screen.getByText(/Package ready with warnings/)).toBeInTheDocument();
  });

  it('renders warn count in subtext', () => {
    render(<SummaryHeader state="warn" counts={warnCounts} />);
    expect(screen.getByText(/2 checks raised warnings/)).toBeInTheDocument();
  });

  it('renders Fix All CTA when onFixAll is provided', () => {
    render(<SummaryHeader state="warn" counts={warnCounts} onFixAll={vi.fn()} />);
    expect(screen.getByTestId(VALIDATION_SUMMARY_HEADER_CTA)).toHaveTextContent('Fix All');
  });

  it('does not render CTA when onFixAll is omitted', () => {
    render(<SummaryHeader state="warn" counts={warnCounts} />);
    expect(screen.queryByTestId(VALIDATION_SUMMARY_HEADER_CTA)).not.toBeInTheDocument();
  });

  it('calls onFixAll when Fix All is clicked', async () => {
    const user = userEvent.setup();
    const onFixAll = vi.fn();
    render(<SummaryHeader state="warn" counts={warnCounts} onFixAll={onFixAll} />);
    await user.click(screen.getByTestId(VALIDATION_SUMMARY_HEADER_CTA));
    expect(onFixAll).toHaveBeenCalledTimes(1);
  });
});

// ── error state ───────────────────────────────────────────────────────────────

describe('SummaryHeader — error state', () => {
  it('renders root with correct testid', () => {
    render(<SummaryHeader state="error" counts={errorCounts} />);
    expect(screen.getByTestId(VALIDATION_SUMMARY_HEADER)).toBeInTheDocument();
  });

  it('uses danger Banner tone (data-tone=danger)', () => {
    render(<SummaryHeader state="error" counts={errorCounts} />);
    expect(screen.getByTestId(VALIDATION_SUMMARY_HEADER)).toHaveAttribute('data-tone', 'danger');
  });

  it('renders the error headline', () => {
    render(<SummaryHeader state="error" counts={errorCounts} />);
    expect(screen.getByText(/Package has errors/)).toBeInTheDocument();
  });

  it('renders error count in subtext', () => {
    render(<SummaryHeader state="error" counts={errorCounts} />);
    expect(screen.getByText(/3 checks failed/)).toBeInTheDocument();
  });

  it('renders Fix All CTA when onFixAll is provided', () => {
    render(<SummaryHeader state="error" counts={errorCounts} onFixAll={vi.fn()} />);
    expect(screen.getByTestId(VALIDATION_SUMMARY_HEADER_CTA)).toHaveTextContent('Fix All');
  });

  it('does not render CTA when onFixAll is omitted', () => {
    render(<SummaryHeader state="error" counts={errorCounts} />);
    expect(screen.queryByTestId(VALIDATION_SUMMARY_HEADER_CTA)).not.toBeInTheDocument();
  });

  it('calls onFixAll when Fix All is clicked', async () => {
    const user = userEvent.setup();
    const onFixAll = vi.fn();
    render(<SummaryHeader state="error" counts={errorCounts} onFixAll={onFixAll} />);
    await user.click(screen.getByTestId(VALIDATION_SUMMARY_HEADER_CTA));
    expect(onFixAll).toHaveBeenCalledTimes(1);
  });
});

// ── counts rendering ──────────────────────────────────────────────────────────

describe('SummaryHeader — counts', () => {
  it('renders pass + warn + error counts when all non-zero', () => {
    render(<SummaryHeader state="warn" counts={errorCounts} />);
    // errorCounts = { pass: 4, warn: 1, error: 3 }
    expect(screen.getByText('4')).toBeInTheDocument();
    expect(screen.getByText('1')).toBeInTheDocument();
    expect(screen.getByText('3')).toBeInTheDocument();
  });

  it('renders skip count chip when skip > 0', () => {
    const countsWithSkip: ValidationCounts = {
      pass: 5,
      warn: 1,
      error: 0,
      skip: 2,
    };
    render(<SummaryHeader state="warn" counts={countsWithSkip} />);
    expect(screen.getByText('2')).toBeInTheDocument();
  });

  it('does not render skip chip when skip is 0', () => {
    const countsNoSkip: ValidationCounts = {
      pass: 5,
      warn: 1,
      error: 0,
      skip: 0,
    };
    render(<SummaryHeader state="warn" counts={countsNoSkip} />);
    // Only pass + warn shown
    expect(screen.queryByText('0')).not.toBeInTheDocument();
  });

  it('does not render skip chip when skip is absent', () => {
    render(<SummaryHeader state="pass" counts={passCounts} />);
    // passCounts has no skip field — just confirm no crash
    expect(screen.getByTestId(VALIDATION_SUMMARY_HEADER)).toBeInTheDocument();
  });
});

// ── data-testid forwarding ────────────────────────────────────────────────────

describe('SummaryHeader — data-testid forwarding', () => {
  it('uses default testid', () => {
    render(<SummaryHeader state="pass" counts={passCounts} />);
    expect(screen.getByTestId(VALIDATION_SUMMARY_HEADER)).toBeInTheDocument();
  });

  it('forwards custom data-testid', () => {
    render(<SummaryHeader state="pass" counts={passCounts} data-testid="my-header" />);
    expect(screen.getByTestId('my-header')).toBeInTheDocument();
    expect(screen.queryByTestId(VALIDATION_SUMMARY_HEADER)).not.toBeInTheDocument();
  });
});

// ── singular/plural subtext ───────────────────────────────────────────────────

describe('SummaryHeader — singular subtext', () => {
  it('uses singular "check" when count is 1 (warn)', () => {
    const single: ValidationCounts = { pass: 7, warn: 1, error: 0 };
    render(<SummaryHeader state="warn" counts={single} />);
    expect(screen.getByText(/1 check raised warnings/)).toBeInTheDocument();
  });

  it('uses singular "check" when count is 1 (error)', () => {
    const single: ValidationCounts = { pass: 7, warn: 0, error: 1 };
    render(<SummaryHeader state="error" counts={single} />);
    expect(screen.getByText(/1 check failed/)).toBeInTheDocument();
  });
});
