import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BulkBar } from './BulkBar.js';
import type { BulkAction } from './BulkBar.js';

describe('BulkBar', () => {
  it('renders the selected count', () => {
    render(<BulkBar selectedCount={5} onAction={vi.fn()} />);
    expect(screen.getByText('5 selected')).toBeInTheDocument();
  });

  it('renders a singular count correctly', () => {
    render(<BulkBar selectedCount={1} onAction={vi.fn()} />);
    expect(screen.getByText('1 selected')).toBeInTheDocument();
  });

  it('renders all 6 role-action buttons', () => {
    render(<BulkBar selectedCount={3} onAction={vi.fn()} />);
    expect(screen.getByRole('button', { name: 'Page' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Cover' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Back' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Blank' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Duplicate' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Remove' })).toBeInTheDocument();
  });

  it.each([
    ['Page', 'page'],
    ['Cover', 'cover'],
    ['Back', 'back'],
    ['Blank', 'blank'],
    ['Duplicate', 'duplicate'],
    ['Remove', 'remove'],
  ] satisfies [string, BulkAction][])(
    'clicking %s fires onAction with %s',
    async (label, action) => {
      const onAction = vi.fn();
      render(<BulkBar selectedCount={2} onAction={onAction} />);
      await userEvent.click(screen.getByRole('button', { name: label }));
      expect(onAction).toHaveBeenCalledWith(action);
      expect(onAction).toHaveBeenCalledTimes(1);
    },
  );

  it('does not render the Clear button when onClear is not provided', () => {
    render(<BulkBar selectedCount={3} onAction={vi.fn()} />);
    expect(screen.queryByRole('button', { name: 'Clear' })).not.toBeInTheDocument();
  });

  it('renders the Clear button when onClear is provided', () => {
    render(<BulkBar selectedCount={3} onAction={vi.fn()} onClear={vi.fn()} />);
    expect(screen.getByRole('button', { name: 'Clear' })).toBeInTheDocument();
  });

  it('fires onClear when the Clear button is clicked', async () => {
    const onClear = vi.fn();
    render(<BulkBar selectedCount={3} onAction={vi.fn()} onClear={onClear} />);
    await userEvent.click(screen.getByRole('button', { name: 'Clear' }));
    expect(onClear).toHaveBeenCalledTimes(1);
  });

  it('Remove button carries danger styling', () => {
    render(<BulkBar selectedCount={2} onAction={vi.fn()} />);
    const removeBtn = screen.getByRole('button', { name: 'Remove' });
    // The Button component maps variant="danger" to the CSS class "danger"
    expect(removeBtn).toHaveClass('danger');
  });

  it('forwards data-testid to the root element', () => {
    render(<BulkBar selectedCount={4} onAction={vi.fn()} data-testid="my-bulk-bar" />);
    expect(screen.getByTestId('my-bulk-bar')).toBeInTheDocument();
  });

  it('Clear button carries the correct testid', () => {
    render(<BulkBar selectedCount={2} onAction={vi.fn()} onClear={vi.fn()} />);
    expect(screen.getByTestId('bulk-bar-clear')).toBeInTheDocument();
  });
});
