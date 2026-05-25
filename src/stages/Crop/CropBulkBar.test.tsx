import * as React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { CropBulkBar } from './CropBulkBar.js';

describe('CropBulkBar', () => {
  it('shows selectedCount via BulkActionBar "{N} selected"', () => {
    render(<CropBulkBar selectedCount={5} onAction={vi.fn()} />);
    expect(screen.getByText('5 selected')).toBeInTheDocument();
  });

  it('shows flagSummary when provided', () => {
    render(
      <CropBulkBar
        selectedCount={3}
        flagSummary="2 over-crop · 1 deskew fail"
        onAction={vi.fn()}
      />,
    );
    expect(screen.getByText('2 over-crop · 1 deskew fail')).toBeInTheDocument();
  });

  it('does not show flagSummary element when not provided', () => {
    render(<CropBulkBar selectedCount={1} onAction={vi.fn()} />);
    expect(screen.queryByTestId('bulk-action-bar-flag-summary')).not.toBeInTheDocument();
  });

  it('fires onAction("redeskew") when Re-deskew is clicked', async () => {
    const onAction = vi.fn();
    render(<CropBulkBar selectedCount={2} onAction={onAction} />);
    await userEvent.click(screen.getByTestId('crop-bulk-bar-action-redeskew'));
    expect(onAction).toHaveBeenCalledWith('redeskew');
    expect(onAction).toHaveBeenCalledTimes(1);
  });

  it('fires onAction("rerunCrop") when Re-run crop is clicked', async () => {
    const onAction = vi.fn();
    render(<CropBulkBar selectedCount={4} onAction={onAction} />);
    await userEvent.click(screen.getByTestId('crop-bulk-bar-action-rerunCrop'));
    expect(onAction).toHaveBeenCalledWith('rerunCrop');
  });

  it('fires onAction("acceptAsIs") when Accept as-is is clicked', async () => {
    const onAction = vi.fn();
    render(<CropBulkBar selectedCount={1} onAction={onAction} />);
    await userEvent.click(screen.getByTestId('crop-bulk-bar-action-acceptAsIs'));
    expect(onAction).toHaveBeenCalledWith('acceptAsIs');
  });

  it('fires onAction("restoreDefault") when Restore default is clicked', async () => {
    const onAction = vi.fn();
    render(<CropBulkBar selectedCount={1} onAction={onAction} />);
    await userEvent.click(screen.getByTestId('crop-bulk-bar-action-restoreDefault'));
    expect(onAction).toHaveBeenCalledWith('restoreDefault');
  });

  it('Re-run crop button label includes the selected count', () => {
    render(<CropBulkBar selectedCount={7} onAction={vi.fn()} />);
    expect(screen.getByText('Re-run crop (7)')).toBeInTheDocument();
  });

  it('updates Re-run crop count when selectedCount changes', () => {
    const { rerender } = render(<CropBulkBar selectedCount={3} onAction={vi.fn()} />);
    expect(screen.getByText('Re-run crop (3)')).toBeInTheDocument();
    rerender(<CropBulkBar selectedCount={9} onAction={vi.fn()} />);
    expect(screen.getByText('Re-run crop (9)')).toBeInTheDocument();
  });

  it('fires onClear when Clear is clicked', async () => {
    const onClear = vi.fn();
    render(<CropBulkBar selectedCount={2} onAction={vi.fn()} onClear={onClear} />);
    await userEvent.click(screen.getByRole('button', { name: /clear selection/i }));
    expect(onClear).toHaveBeenCalledTimes(1);
  });

  it('renders Clear button disabled when onClear is not provided', () => {
    render(<CropBulkBar selectedCount={2} onAction={vi.fn()} />);
    expect(screen.getByRole('button', { name: /clear selection/i })).toBeDisabled();
  });

  it('forwards variant prop to BulkActionBar', () => {
    const { container } = render(
      <CropBulkBar selectedCount={1} onAction={vi.fn()} variant="float" />,
    );
    expect(container.querySelector('.bulk-action-bar--float')).toBeInTheDocument();
  });

  it('uses dock variant by default', () => {
    const { container } = render(<CropBulkBar selectedCount={1} onAction={vi.fn()} />);
    expect(container.querySelector('.bulk-action-bar--dock')).toBeInTheDocument();
  });

  it('forwards data-testid to the root element', () => {
    render(<CropBulkBar selectedCount={1} onAction={vi.fn()} data-testid="my-crop-bar" />);
    expect(screen.getByTestId('my-crop-bar')).toBeInTheDocument();
  });

  it('uses default testid "crop-bulk-bar" when data-testid is not provided', () => {
    render(<CropBulkBar selectedCount={1} onAction={vi.fn()} />);
    expect(screen.getByTestId('crop-bulk-bar')).toBeInTheDocument();
  });
});
