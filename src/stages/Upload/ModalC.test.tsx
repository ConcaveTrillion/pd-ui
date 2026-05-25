/**
 * ModalC tests — Upload stage 4-step desktop right-side sheet.
 *
 * Pattern notes (mirrors ModalB.test.tsx):
 * - Radix Dialog in jsdom uses portals; content is in DOM after render when open=true.
 * - Radix mounts synchronously in jsdom with no animation; waitFor not needed.
 * - If tests flake, wrap assertions in waitFor.
 */

import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import * as React from 'react';
import { ModalC } from './ModalC.js';
import {
  UPLOAD_MODAL_C,
  UPLOAD_MODAL_C_RAIL,
  uploadModalCStepTestId,
} from '../../testids/index.js';

// ─── Helpers ──────────────────────────────────────────────────────────────────

type Step = 'name' | 'source' | 'review' | 'upload';

const STEP_CONTENT: Record<Step, React.ReactNode> = {
  name: <div data-testid="content-name">Name step content</div>,
  source: <div data-testid="content-source">Source step content</div>,
  review: <div data-testid="content-review">Review step content</div>,
  upload: <div data-testid="content-upload">Upload step content</div>,
};

function renderOpen(overrides: Partial<React.ComponentProps<typeof ModalC>> = {}) {
  const onOpenChange = vi.fn<(arg: boolean) => void>();
  const onStepChange = vi.fn<(arg: Step) => void>();

  render(
    <ModalC
      open={true}
      onOpenChange={onOpenChange}
      step="name"
      onStepChange={onStepChange}
      stepContent={STEP_CONTENT}
      {...overrides}
    />,
  );

  return { onOpenChange, onStepChange };
}

// ─── Tests ────────────────────────────────────────────────────────────────────

describe('ModalC', () => {
  // ── Controlled open prop ──────────────────────────────────────────────────

  it('renders dialog content when open=true', () => {
    renderOpen();
    expect(screen.getByRole('dialog')).toBeInTheDocument();
  });

  it('does not render dialog content when open=false', () => {
    render(
      <ModalC
        open={false}
        onOpenChange={vi.fn()}
        step="name"
        onStepChange={vi.fn()}
        stepContent={STEP_CONTENT}
      />,
    );
    expect(screen.queryByRole('dialog')).toBeNull();
  });

  // ── Testids ───────────────────────────────────────────────────────────────

  it('applies UPLOAD_MODAL_C testid to dialog content', () => {
    renderOpen();
    expect(screen.getByTestId(UPLOAD_MODAL_C)).toBeInTheDocument();
  });

  it('applies UPLOAD_MODAL_C_RAIL testid to the left rail', () => {
    renderOpen();
    expect(screen.getByTestId(UPLOAD_MODAL_C_RAIL)).toBeInTheDocument();
  });

  it('applies per-step testids to each rail item', () => {
    renderOpen();
    expect(screen.getByTestId(uploadModalCStepTestId('name'))).toBeInTheDocument();
    expect(screen.getByTestId(uploadModalCStepTestId('source'))).toBeInTheDocument();
    expect(screen.getByTestId(uploadModalCStepTestId('review'))).toBeInTheDocument();
    expect(screen.getByTestId(uploadModalCStepTestId('upload'))).toBeInTheDocument();
  });

  // ── Rail click → onStepChange ─────────────────────────────────────────────

  it('clicking a rail item invokes onStepChange with the correct step', () => {
    const { onStepChange } = renderOpen({ step: 'name' });
    const sourceItem = screen.getByTestId(uploadModalCStepTestId('source'));
    fireEvent.click(sourceItem);
    expect(onStepChange).toHaveBeenCalledOnce();
    expect(onStepChange).toHaveBeenCalledWith('source');
  });

  it('clicking each rail item calls onStepChange with its step', () => {
    const steps: Step[] = ['name', 'source', 'review', 'upload'];
    for (const targetStep of steps) {
      cleanup();
      const onStepChange = vi.fn<(arg: Step) => void>();
      render(
        <ModalC
          open={true}
          onOpenChange={vi.fn()}
          step="name"
          onStepChange={onStepChange}
          stepContent={STEP_CONTENT}
        />,
      );
      fireEvent.click(screen.getByTestId(uploadModalCStepTestId(targetStep)));
      expect(onStepChange).toHaveBeenCalledWith(targetStep);
    }
  });

  // ── Step content rendering ────────────────────────────────────────────────

  it('renders the stepContent for the current step', () => {
    renderOpen({ step: 'review' });
    expect(screen.getByTestId('content-review')).toBeInTheDocument();
  });

  it('does not render stepContent for other steps', () => {
    renderOpen({ step: 'name' });
    expect(screen.queryByTestId('content-source')).toBeNull();
    expect(screen.queryByTestId('content-review')).toBeNull();
    expect(screen.queryByTestId('content-upload')).toBeNull();
  });

  it('renders name step content when step=name', () => {
    renderOpen({ step: 'name' });
    expect(screen.getByTestId('content-name')).toBeInTheDocument();
  });

  it('renders upload step content when step=upload', () => {
    renderOpen({ step: 'upload' });
    expect(screen.getByTestId('content-upload')).toBeInTheDocument();
  });

  // ── aria-current ──────────────────────────────────────────────────────────

  it('active rail item has aria-current="step"', () => {
    renderOpen({ step: 'source' });
    const activeItem = screen.getByTestId(uploadModalCStepTestId('source'));
    expect(activeItem).toHaveAttribute('aria-current', 'step');
  });

  it('inactive rail items do not have aria-current="step"', () => {
    renderOpen({ step: 'source' });
    const nameItem = screen.getByTestId(uploadModalCStepTestId('name'));
    const reviewItem = screen.getByTestId(uploadModalCStepTestId('review'));
    const uploadItem = screen.getByTestId(uploadModalCStepTestId('upload'));
    expect(nameItem).not.toHaveAttribute('aria-current', 'step');
    expect(reviewItem).not.toHaveAttribute('aria-current', 'step');
    expect(uploadItem).not.toHaveAttribute('aria-current', 'step');
  });

  // ── Step ordering / past steps ────────────────────────────────────────────

  it('steps before the current step do not have aria-current', () => {
    renderOpen({ step: 'review' });
    expect(screen.getByTestId(uploadModalCStepTestId('name'))).not.toHaveAttribute(
      'aria-current',
      'step',
    );
    expect(screen.getByTestId(uploadModalCStepTestId('source'))).not.toHaveAttribute(
      'aria-current',
      'step',
    );
  });

  it('renders 4 rail items', () => {
    renderOpen();
    // The rail has nav role or a list; at minimum 4 items are present
    const rail = screen.getByTestId(UPLOAD_MODAL_C_RAIL);
    const items = rail.querySelectorAll('[data-step]');
    expect(items).toHaveLength(4);
  });

  // ── Title ─────────────────────────────────────────────────────────────────

  it('renders a visible dialog title', () => {
    renderOpen();
    expect(screen.getByRole('heading')).toBeInTheDocument();
  });
});
