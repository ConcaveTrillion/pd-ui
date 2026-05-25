import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { DownloadFooter } from './DownloadFooter.js';
import {
  VALIDATION_DOWNLOAD_FOOTER,
  VALIDATION_DOWNLOAD_FOOTER_DOWNLOAD,
  VALIDATION_DOWNLOAD_FOOTER_FIX,
} from '../../testids/index.js';

// ─── Tests: pass state ────────────────────────────────────────────────────────

describe('DownloadFooter — pass state', () => {
  it('renders root with VALIDATION_DOWNLOAD_FOOTER testid', () => {
    render(<DownloadFooter state="pass" />);
    expect(screen.getByTestId(VALIDATION_DOWNLOAD_FOOTER)).toBeInTheDocument();
  });

  it('renders a Download button', () => {
    render(<DownloadFooter state="pass" />);
    const btn = screen.getByTestId(VALIDATION_DOWNLOAD_FOOTER_DOWNLOAD);
    expect(btn).toBeInTheDocument();
    expect(btn).toHaveTextContent('Download');
  });

  it('Download button is enabled when onDownload is provided', () => {
    render(<DownloadFooter state="pass" onDownload={() => undefined} />);
    expect(screen.getByTestId(VALIDATION_DOWNLOAD_FOOTER_DOWNLOAD)).not.toBeDisabled();
  });

  it('Download button is disabled when onDownload is absent', () => {
    render(<DownloadFooter state="pass" />);
    expect(screen.getByTestId(VALIDATION_DOWNLOAD_FOOTER_DOWNLOAD)).toBeDisabled();
  });

  it('calls onDownload when Download is clicked', async () => {
    const user = userEvent.setup();
    const onDownload = vi.fn();
    render(<DownloadFooter state="pass" onDownload={onDownload} />);
    await user.click(screen.getByTestId(VALIDATION_DOWNLOAD_FOOTER_DOWNLOAD));
    expect(onDownload).toHaveBeenCalledOnce();
  });

  it('does not render a Fix button in pass state', () => {
    render(<DownloadFooter state="pass" />);
    expect(screen.queryByTestId(VALIDATION_DOWNLOAD_FOOTER_FIX)).not.toBeInTheDocument();
  });
});

// ─── Tests: warn state ────────────────────────────────────────────────────────

describe('DownloadFooter — warn state', () => {
  it('renders root with VALIDATION_DOWNLOAD_FOOTER testid', () => {
    render(<DownloadFooter state="warn" />);
    expect(screen.getByTestId(VALIDATION_DOWNLOAD_FOOTER)).toBeInTheDocument();
  });

  it('renders "Download anyway" button', () => {
    render(<DownloadFooter state="warn" />);
    const btn = screen.getByTestId(VALIDATION_DOWNLOAD_FOOTER_DOWNLOAD);
    expect(btn).toBeInTheDocument();
    expect(btn).toHaveTextContent('Download anyway');
  });

  it('renders "Fix & rebuild" button', () => {
    render(<DownloadFooter state="warn" />);
    const btn = screen.getByTestId(VALIDATION_DOWNLOAD_FOOTER_FIX);
    expect(btn).toBeInTheDocument();
    expect(btn).toHaveTextContent('Fix & rebuild');
  });

  it('Download anyway is disabled when onDownload is absent', () => {
    render(<DownloadFooter state="warn" />);
    expect(screen.getByTestId(VALIDATION_DOWNLOAD_FOOTER_DOWNLOAD)).toBeDisabled();
  });

  it('Download anyway is enabled when onDownload is provided', () => {
    render(<DownloadFooter state="warn" onDownload={() => undefined} />);
    expect(screen.getByTestId(VALIDATION_DOWNLOAD_FOOTER_DOWNLOAD)).not.toBeDisabled();
  });

  it('Fix & rebuild is disabled when onFix is absent', () => {
    render(<DownloadFooter state="warn" />);
    expect(screen.getByTestId(VALIDATION_DOWNLOAD_FOOTER_FIX)).toBeDisabled();
  });

  it('Fix & rebuild is enabled when onFix is provided', () => {
    render(<DownloadFooter state="warn" onFix={() => undefined} />);
    expect(screen.getByTestId(VALIDATION_DOWNLOAD_FOOTER_FIX)).not.toBeDisabled();
  });

  it('calls onDownload when Download anyway is clicked', async () => {
    const user = userEvent.setup();
    const onDownload = vi.fn();
    render(<DownloadFooter state="warn" onDownload={onDownload} />);
    await user.click(screen.getByTestId(VALIDATION_DOWNLOAD_FOOTER_DOWNLOAD));
    expect(onDownload).toHaveBeenCalledOnce();
  });

  it('calls onFix when Fix & rebuild is clicked', async () => {
    const user = userEvent.setup();
    const onFix = vi.fn();
    render(<DownloadFooter state="warn" onFix={onFix} />);
    await user.click(screen.getByTestId(VALIDATION_DOWNLOAD_FOOTER_FIX));
    expect(onFix).toHaveBeenCalledOnce();
  });
});

// ─── Tests: error state ───────────────────────────────────────────────────────

describe('DownloadFooter — error state', () => {
  it('renders root with VALIDATION_DOWNLOAD_FOOTER testid', () => {
    render(<DownloadFooter state="error" fixableCount={3} />);
    expect(screen.getByTestId(VALIDATION_DOWNLOAD_FOOTER)).toBeInTheDocument();
  });

  it('renders a disabled Download button', () => {
    render(<DownloadFooter state="error" fixableCount={3} />);
    const btn = screen.getByTestId(VALIDATION_DOWNLOAD_FOOTER_DOWNLOAD);
    expect(btn).toBeInTheDocument();
    expect(btn).toBeDisabled();
  });

  it('renders "Fix all (N)" button with fixableCount', () => {
    render(<DownloadFooter state="error" fixableCount={5} />);
    const btn = screen.getByTestId(VALIDATION_DOWNLOAD_FOOTER_FIX);
    expect(btn).toBeInTheDocument();
    expect(btn).toHaveTextContent('Fix all (5)');
  });

  it('Fix all shows correct count for different fixableCount values', () => {
    render(<DownloadFooter state="error" fixableCount={12} />);
    expect(screen.getByTestId(VALIDATION_DOWNLOAD_FOOTER_FIX)).toHaveTextContent('Fix all (12)');
  });

  it('Fix all button is disabled when onFix is absent', () => {
    render(<DownloadFooter state="error" fixableCount={3} />);
    expect(screen.getByTestId(VALIDATION_DOWNLOAD_FOOTER_FIX)).toBeDisabled();
  });

  it('Fix all button is enabled when onFix is provided', () => {
    render(<DownloadFooter state="error" fixableCount={3} onFix={() => undefined} />);
    expect(screen.getByTestId(VALIDATION_DOWNLOAD_FOOTER_FIX)).not.toBeDisabled();
  });

  it('calls onFix when Fix all is clicked', async () => {
    const user = userEvent.setup();
    const onFix = vi.fn();
    render(<DownloadFooter state="error" fixableCount={3} onFix={onFix} />);
    await user.click(screen.getByTestId(VALIDATION_DOWNLOAD_FOOTER_FIX));
    expect(onFix).toHaveBeenCalledOnce();
  });

  it('Download button is always disabled in error state (even with onDownload)', () => {
    render(<DownloadFooter state="error" fixableCount={3} onDownload={() => undefined} />);
    expect(screen.getByTestId(VALIDATION_DOWNLOAD_FOOTER_DOWNLOAD)).toBeDisabled();
  });
});
