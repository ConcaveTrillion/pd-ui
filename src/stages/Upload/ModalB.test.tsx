/**
 * ModalB tests — Upload stage compact drop-target modal.
 *
 * Pattern notes:
 * - Radix Dialog in jsdom uses portals; content is in DOM after render when open=true.
 * - Drop events use a mock DataTransfer since jsdom doesn't implement it natively.
 * - waitFor patterns are NOT needed here because Radix mounts synchronously in jsdom
 *   when there is no animation. If tests flake, wrap assertions in waitFor.
 */

import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ModalB } from './ModalB.js';
import {
  UPLOAD_MODAL_B,
  UPLOAD_MODAL_B_DROP_ZONE,
  UPLOAD_MODAL_B_FILE_INPUT,
} from '../../testids/index.js';

// ─── Helpers ──────────────────────────────────────────────────────────────────

function renderOpen(
  overrides: Partial<React.ComponentProps<typeof ModalB>> = {},
) {
  const onOpenChange = vi.fn<[boolean], void>();
  const onFiles = vi.fn<[FileList | File[]], void>();

  render(
    <ModalB
      open={true}
      onOpenChange={onOpenChange}
      onFiles={onFiles}
      {...overrides}
    />,
  );

  return { onOpenChange, onFiles };
}

// ─── Tests ────────────────────────────────────────────────────────────────────

describe('ModalB', () => {
  // ── Controlled open prop ──────────────────────────────────────────────────

  it('renders dialog content when open=true', () => {
    renderOpen();
    expect(screen.getByRole('dialog')).toBeInTheDocument();
  });

  it('does not render dialog content when open=false', () => {
    render(
      <ModalB
        open={false}
        onOpenChange={vi.fn()}
        onFiles={vi.fn()}
      />,
    );
    expect(screen.queryByRole('dialog')).toBeNull();
  });

  // ── Testids ───────────────────────────────────────────────────────────────

  it('applies UPLOAD_MODAL_B testid to dialog content', () => {
    renderOpen();
    expect(screen.getByTestId(UPLOAD_MODAL_B)).toBeInTheDocument();
  });

  it('applies UPLOAD_MODAL_B_DROP_ZONE testid to drop zone', () => {
    renderOpen();
    expect(screen.getByTestId(UPLOAD_MODAL_B_DROP_ZONE)).toBeInTheDocument();
  });

  it('applies UPLOAD_MODAL_B_FILE_INPUT testid to file input', () => {
    renderOpen();
    expect(screen.getByTestId(UPLOAD_MODAL_B_FILE_INPUT)).toBeInTheDocument();
  });

  // ── a11y ──────────────────────────────────────────────────────────────────

  it('drop zone has role="button"', () => {
    renderOpen();
    const dropZone = screen.getByTestId(UPLOAD_MODAL_B_DROP_ZONE);
    expect(dropZone).toHaveAttribute('role', 'button');
  });

  it('drop zone has aria-label="Upload images"', () => {
    renderOpen();
    const dropZone = screen.getByTestId(UPLOAD_MODAL_B_DROP_ZONE);
    expect(dropZone).toHaveAttribute('aria-label', 'Upload images');
  });

  it('file input is of type=file with multiple attribute', () => {
    renderOpen();
    const input = screen.getByTestId(UPLOAD_MODAL_B_FILE_INPUT);
    expect(input).toHaveAttribute('type', 'file');
    expect(input).toHaveAttribute('multiple');
  });

  // ── File input change → onFiles ───────────────────────────────────────────

  it('invokes onFiles when file input changes', async () => {
    const user = userEvent.setup();
    const { onFiles } = renderOpen();
    const input = screen.getByTestId(UPLOAD_MODAL_B_FILE_INPUT);
    const file = new File(['content'], 'scan001.png', { type: 'image/png' });
    await user.upload(input, file);
    expect(onFiles).toHaveBeenCalledOnce();
    const [arg] = onFiles.mock.lastCall ?? [];
    // arg is a FileList or File[]
    expect(arg).toBeDefined();
  });

  // ── Drop event → onFiles ──────────────────────────────────────────────────

  it('invokes onFiles on drop event with DataTransfer.files', () => {
    const { onFiles } = renderOpen();
    const dropZone = screen.getByTestId(UPLOAD_MODAL_B_DROP_ZONE);

    const file = new File(['data'], 'page001.png', { type: 'image/png' });

    // Build a minimal DataTransfer-like object
    const dataTransfer = {
      files: Object.assign([file], {
        item: (i: number) => [file][i] ?? null,
        length: 1,
      }) as unknown as FileList,
      items: [],
      types: [],
    };

    fireEvent.dragOver(dropZone, { dataTransfer });
    fireEvent.drop(dropZone, { dataTransfer });

    expect(onFiles).toHaveBeenCalledOnce();
    const [arg] = onFiles.mock.lastCall ?? [];
    expect(arg).toBeDefined();
  });

  // ── Drop zone click → file input ──────────────────────────────────────────

  it('clicking the drop zone triggers the hidden file input click', () => {
    renderOpen();
    const dropZone = screen.getByTestId(UPLOAD_MODAL_B_DROP_ZONE);
    const input = screen.getByTestId<HTMLInputElement>(UPLOAD_MODAL_B_FILE_INPUT);
    const clickSpy = vi.spyOn(input, 'click');
    fireEvent.click(dropZone);
    expect(clickSpy).toHaveBeenCalledOnce();
  });

  // ── Title ─────────────────────────────────────────────────────────────────

  it('renders a visible dialog title', () => {
    renderOpen();
    expect(screen.getByRole('heading')).toBeInTheDocument();
  });
});
