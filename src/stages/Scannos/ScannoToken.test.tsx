import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { ScannoToken } from './ScannoToken.js';
import type { ScannoSource } from './ScannoToken.js';

const SOURCES: ScannoSource[] = ['rule', 'ocr', 'manual'];

describe('ScannoToken', () => {
  // ─── Source variants ────────────────────────────────────────────────────────

  it.each(SOURCES)('renders token text for source=%s', (source) => {
    render(<ScannoToken token="teh" source={source} />);
    expect(screen.getByText('teh')).toBeInTheDocument();
  });

  it.each(SOURCES)('applies modifier class scanno-token--%s for source=%s', (source) => {
    const { container } = render(<ScannoToken token="teh" source={source} />);
    const el = container.firstElementChild;
    expect(el).toHaveClass(`scanno-token--${source}`);
  });

  it.each(SOURCES)('sets data-source=%s attribute for CSS hooks', (source) => {
    const { container } = render(<ScannoToken token="teh" source={source} />);
    const el = container.firstElementChild;
    expect(el).toHaveAttribute('data-source', source);
  });

  // ─── Element type switch ────────────────────────────────────────────────────

  it('renders a <span> when onClick is not provided', () => {
    render(<ScannoToken token="teh" source="rule" />);
    const el = screen.getByText('teh');
    expect(el.tagName).toBe('SPAN');
  });

  it('renders a <button> when onClick is provided', () => {
    render(<ScannoToken token="teh" source="rule" onClick={vi.fn()} />);
    const btn = screen.getByRole('button');
    expect(btn).toBeInTheDocument();
    expect(btn).toHaveTextContent('teh');
  });

  // ─── Callback ──────────────────────────────────────────────────────────────

  it('fires onClick when button is clicked', async () => {
    const handler = vi.fn();
    render(<ScannoToken token="teh" source="ocr" onClick={handler} />);
    await userEvent.click(screen.getByRole('button'));
    expect(handler).toHaveBeenCalledOnce();
  });

  it('does not throw when span is clicked without onClick', async () => {
    render(<ScannoToken token="teh" source="manual" />);
    await userEvent.click(screen.getByText('teh'));
    // no assertion — just must not throw
  });

  // ─── testid ─────────────────────────────────────────────────────────────────

  it('sets the default data-testid on the root element', () => {
    const { container } = render(<ScannoToken token="teh" source="rule" />);
    expect(container.firstElementChild).toHaveAttribute('data-testid', 'scanno-token');
  });

  it('accepts a custom data-testid', () => {
    const { container } = render(<ScannoToken token="teh" source="rule" data-testid="my-token" />);
    expect(container.firstElementChild).toHaveAttribute('data-testid', 'my-token');
  });
});
