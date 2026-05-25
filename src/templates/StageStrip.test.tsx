/**
 * Tests for StageStrip molecule (#340).
 *
 * Design source: StageContextStrip in docs/templates/design_handoff_pd_ui/
 * Export name reconciliation: design calls it StageContextStrip; the plan
 * (Task 7 in docs/plans/2026-05-24-pd-ui-design-handoff.md) exports it as
 * StageStrip — a cleaner name for the pd-ui library API surface.
 */
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { StageStrip, PIPELINE_STAGES } from './StageStrip.js';

// ─────────────────────────────────────────────────────────────────────────────
// Sample stage list (minimal for tests — consumers supply their own list)
// ─────────────────────────────────────────────────────────────────────────────
const SAMPLE_STAGES = [
  { id: 'source', short: 'source', group: 'Source' },
  { id: 'dewarp', short: 'dewarp', group: 'Source' },
  { id: 'ocr', short: 'ocr', group: 'OCR' },
  { id: 'validation', short: 'validate', group: 'Pack' },
] as const;

describe('StageStrip', () => {
  // ── Rendering ──────────────────────────────────────────────────────────────

  it('renders with data-testid="stage-strip"', () => {
    render(<StageStrip stages={[...SAMPLE_STAGES]} current="source" data-testid="stage-strip" />);
    expect(screen.getByTestId('stage-strip')).toBeTruthy();
  });

  it('renders the current stage id', () => {
    render(<StageStrip stages={[...SAMPLE_STAGES]} current="ocr" data-testid="strip" />);
    const strip = screen.getByTestId('strip');
    expect(strip.textContent).toContain('ocr');
  });

  it('renders stage counter n/total', () => {
    render(<StageStrip stages={[...SAMPLE_STAGES]} current="dewarp" data-testid="strip" />);
    // dewarp is index 1 → "2/4"
    const strip = screen.getByTestId('strip');
    expect(strip.textContent).toContain('2/4');
  });

  // ── Status variants ────────────────────────────────────────────────────────

  it('shows "all checks green" when flagged and dirty are both undefined', () => {
    render(<StageStrip stages={[...SAMPLE_STAGES]} current="source" data-testid="strip" />);
    expect(screen.getByTestId('strip').textContent).toContain('all checks green');
  });

  it('shows error count when flagged is set', () => {
    render(
      <StageStrip stages={[...SAMPLE_STAGES]} current="source" flagged={3} data-testid="strip" />,
    );
    expect(screen.getByTestId('strip').textContent).toContain('3');
    expect(screen.getByTestId('strip').textContent).toContain('errors');
  });

  it('shows warning count when dirty is set', () => {
    render(
      <StageStrip stages={[...SAMPLE_STAGES]} current="source" dirty={7} data-testid="strip" />,
    );
    expect(screen.getByTestId('strip').textContent).toContain('7');
    expect(screen.getByTestId('strip').textContent).toContain('warnings');
  });

  it('shows both counts when both are set', () => {
    render(
      <StageStrip
        stages={[...SAMPLE_STAGES]}
        current="source"
        flagged={2}
        dirty={5}
        data-testid="strip"
      />,
    );
    const text = screen.getByTestId('strip').textContent ?? '';
    expect(text).toContain('2');
    expect(text).toContain('errors');
    expect(text).toContain('5');
    expect(text).toContain('warnings');
  });

  it('adds stage-strip--running modifier class when running=true', () => {
    render(<StageStrip stages={[...SAMPLE_STAGES]} current="source" running data-testid="strip" />);
    const el = screen.getByTestId('strip');
    expect(el.classList.contains('stage-strip--running')).toBe(true);
  });

  it('does NOT add running modifier when running is false', () => {
    render(<StageStrip stages={[...SAMPLE_STAGES]} current="source" data-testid="strip" />);
    const el = screen.getByTestId('strip');
    expect(el.classList.contains('stage-strip--running')).toBe(false);
  });

  // ── Click handling ─────────────────────────────────────────────────────────

  it('calls onStageClick with stage id when a pipeline dot is clicked', () => {
    const spy = vi.fn();
    render(
      <StageStrip
        stages={[...SAMPLE_STAGES]}
        current="ocr"
        onStageClick={spy}
        data-testid="strip"
      />,
    );
    // The "source" dot should be rendered and clickable
    const sourceButton = screen.getByTitle('1. source');
    fireEvent.click(sourceButton);
    expect(spy).toHaveBeenCalledWith('source');
  });

  it('calls onStageClick when current stage pill is clicked', () => {
    const spy = vi.fn();
    render(
      <StageStrip
        stages={[...SAMPLE_STAGES]}
        current="ocr"
        onStageClick={spy}
        data-testid="strip"
      />,
    );
    // Current stage pill button has aria-label "Current stage: ocr"
    const pill = screen.getByRole('button', { name: /current stage: ocr/i });
    fireEvent.click(pill);
    expect(spy).toHaveBeenCalledWith('ocr');
  });

  it('disables Next button when flagged > 0', () => {
    render(<StageStrip stages={[...SAMPLE_STAGES]} current="source" flagged={1} />);
    const nextBtn = screen.getByRole('button', { name: /next/i });
    expect((nextBtn as HTMLButtonElement).disabled).toBe(true);
  });

  it('does NOT disable Next button when flagged is 0', () => {
    render(<StageStrip stages={[...SAMPLE_STAGES]} current="source" flagged={0} />);
    const nextBtn = screen.getByRole('button', { name: /next/i });
    expect((nextBtn as HTMLButtonElement).disabled).toBe(false);
  });

  it('calls onPrev when Prev button clicked', () => {
    const onPrev = vi.fn();
    render(<StageStrip stages={[...SAMPLE_STAGES]} current="source" onPrev={onPrev} />);
    fireEvent.click(screen.getByRole('button', { name: /prev/i }));
    expect(onPrev).toHaveBeenCalledOnce();
  });

  it('calls onNext when Next button clicked', () => {
    const onNext = vi.fn();
    render(<StageStrip stages={[...SAMPLE_STAGES]} current="source" onNext={onNext} />);
    fireEvent.click(screen.getByRole('button', { name: /next/i }));
    expect(onNext).toHaveBeenCalledOnce();
  });

  // ── actions slot ──────────────────────────────────────────────────────────

  it('renders actions slot content', () => {
    render(
      <StageStrip
        stages={[...SAMPLE_STAGES]}
        current="source"
        actions={<button data-testid="custom-action">Custom</button>}
      />,
    );
    expect(screen.getByTestId('custom-action')).toBeTruthy();
  });

  // ── PIPELINE_STAGES export ────────────────────────────────────────────────

  it('exports PIPELINE_STAGES with 22 entries', () => {
    expect(PIPELINE_STAGES).toHaveLength(22);
  });

  it('PIPELINE_STAGES first entry is source', () => {
    expect(PIPELINE_STAGES[0]?.id).toBe('source');
  });

  // ── ref forwarding ────────────────────────────────────────────────────────

  it('forwards ref to the root element', () => {
    const ref = { current: null as HTMLDivElement | null };
    render(<StageStrip stages={[...SAMPLE_STAGES]} current="source" ref={ref} />);
    expect(ref.current?.tagName).toBe('DIV');
  });

  // ── variant prop (non-breaking Phase 2 M10 addition) ─────────────────────

  it('adds stage-strip--configure modifier when variant="configure"', () => {
    render(
      <StageStrip
        stages={[...SAMPLE_STAGES]}
        current="source"
        variant="configure"
        data-testid="strip"
      />,
    );
    const el = screen.getByTestId('strip');
    expect(el.classList.contains('stage-strip--configure')).toBe(true);
  });

  it('does NOT add configure modifier when variant is omitted', () => {
    render(<StageStrip stages={[...SAMPLE_STAGES]} current="source" data-testid="strip" />);
    const el = screen.getByTestId('strip');
    expect(el.classList.contains('stage-strip--configure')).toBe(false);
  });

  it('does NOT add configure modifier when variant="default"', () => {
    render(
      <StageStrip
        stages={[...SAMPLE_STAGES]}
        current="source"
        variant="default"
        data-testid="strip"
      />,
    );
    const el = screen.getByTestId('strip');
    expect(el.classList.contains('stage-strip--configure')).toBe(false);
  });

  it('variant=configure does not break existing running modifier', () => {
    render(
      <StageStrip
        stages={[...SAMPLE_STAGES]}
        current="source"
        variant="configure"
        running
        data-testid="strip"
      />,
    );
    const el = screen.getByTestId('strip');
    expect(el.classList.contains('stage-strip--configure')).toBe(true);
    expect(el.classList.contains('stage-strip--running')).toBe(true);
  });
});
