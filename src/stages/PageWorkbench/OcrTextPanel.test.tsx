/**
 * OcrTextPanel tests.
 */
import * as React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { OcrTextPanel } from './OcrTextPanel.js';
import type { OcrLine } from './OcrTextPanel.js';

// ── Fixtures ──────────────────────────────────────────────────────────────────

const WORD_A = { id: 'w1', text: 'Hello', confidence: 0.95 };
const WORD_B = { id: 'w2', text: 'world', confidence: 0.75 };
const WORD_C = { id: 'w3', text: 'foo', confidence: 0.50, flags: ['dict-miss', 'low-conf'] };

const LINE_1: OcrLine = { id: 'L1', text: 'Hello world', words: [WORD_A, WORD_B] };
const LINE_2: OcrLine = { id: 'L2', text: 'foo bar', words: [WORD_C] };
const LINE_NO_WORDS: OcrLine = { id: 'L3', text: 'Fallback line text' };

// ── Tests ─────────────────────────────────────────────────────────────────────

describe('OcrTextPanel', () => {
  it('renders all lines in cards mode (default)', () => {
    render(<OcrTextPanel lines={[LINE_1, LINE_2]} />);

    // Both line ids should appear as headers
    expect(screen.getByText('L1')).toBeInTheDocument();
    expect(screen.getByText('L2')).toBeInTheDocument();
  });

  it('renders word text in cards mode', () => {
    render(<OcrTextPanel lines={[LINE_1]} />);
    expect(screen.getByText('Hello')).toBeInTheDocument();
    expect(screen.getByText('world')).toBeInTheDocument();
  });

  it('renders word text in rows mode', () => {
    render(<OcrTextPanel lines={[LINE_1]} viewMode="rows" />);
    expect(screen.getByText('Hello')).toBeInTheDocument();
    expect(screen.getByText('world')).toBeInTheDocument();
  });

  it('switching viewMode fires onViewModeChange', () => {
    const onViewModeChange = vi.fn();
    render(
      <OcrTextPanel
        lines={[LINE_1]}
        viewMode="cards"
        onViewModeChange={onViewModeChange}
      />,
    );

    // Click the "Rows" segment button
    const rowsButton = screen.getByText('Rows');
    fireEvent.click(rowsButton);

    expect(onViewModeChange).toHaveBeenCalledWith('rows');
  });

  it('clicking a word fires onWordEdit(wordId)', () => {
    const onWordEdit = vi.fn();
    render(<OcrTextPanel lines={[LINE_1]} onWordEdit={onWordEdit} />);

    const helloEl = screen.getByText('Hello');
    fireEvent.click(helloEl);

    expect(onWordEdit).toHaveBeenCalledWith('w1');
  });

  it('clicking a word in rows mode fires onWordEdit(wordId)', () => {
    const onWordEdit = vi.fn();
    render(
      <OcrTextPanel lines={[LINE_1]} viewMode="rows" onWordEdit={onWordEdit} />,
    );

    const helloEl = screen.getByText('Hello');
    fireEvent.click(helloEl);

    expect(onWordEdit).toHaveBeenCalledWith('w1');
  });

  it('renders ConfPip per word', () => {
    render(<OcrTextPanel lines={[LINE_1, LINE_2]} />);

    // ConfPip shows confidence values as formatted decimals
    expect(screen.getByText('0.95')).toBeInTheDocument();
    expect(screen.getByText('0.75')).toBeInTheDocument();
    expect(screen.getByText('0.50')).toBeInTheDocument();
  });

  it('renders flag indicators when word.flags is non-empty', () => {
    render(<OcrTextPanel lines={[LINE_2]} />);
    expect(screen.getByText('dict-miss')).toBeInTheDocument();
    expect(screen.getByText('low-conf')).toBeInTheDocument();
  });

  it('does not render flags when word.flags is absent', () => {
    render(<OcrTextPanel lines={[LINE_1]} />);
    expect(screen.queryByText('dict-miss')).not.toBeInTheDocument();
  });

  it('forwards data-testid to the outer <aside>', () => {
    render(<OcrTextPanel lines={[LINE_1]} data-testid="my-panel" />);
    expect(screen.getByTestId('my-panel')).toBeInTheDocument();
  });

  it('uses default OCR_TEXT_PANEL testid when none provided', () => {
    render(<OcrTextPanel lines={[LINE_1]} />);
    expect(screen.getByTestId('ocr-text-panel')).toBeInTheDocument();
  });

  it('shows view toggle only when onViewModeChange is provided', () => {
    const { rerender } = render(<OcrTextPanel lines={[LINE_1]} />);
    // No toggle without the handler
    expect(screen.queryByText('Cards')).not.toBeInTheDocument();

    const onViewModeChange = vi.fn();
    rerender(
      <OcrTextPanel
        lines={[LINE_1]}
        viewMode="cards"
        onViewModeChange={onViewModeChange}
      />,
    );
    expect(screen.getByText('Cards')).toBeInTheDocument();
    expect(screen.getByText('Rows')).toBeInTheDocument();
  });

  it('falls back to line.text when words array is absent', () => {
    render(<OcrTextPanel lines={[LINE_NO_WORDS]} />);
    expect(screen.getByText('Fallback line text')).toBeInTheDocument();
  });

  it('shows empty state when lines array is empty', () => {
    render(<OcrTextPanel lines={[]} />);
    expect(screen.getByText('No lines')).toBeInTheDocument();
  });

  it('renders custom title', () => {
    render(<OcrTextPanel lines={[]} title="My OCR Review" />);
    expect(screen.getByText('My OCR Review')).toBeInTheDocument();
  });

  it('defaults to "OCR text" title', () => {
    render(<OcrTextPanel lines={[]} />);
    expect(screen.getByText('OCR text')).toBeInTheDocument();
  });
});
