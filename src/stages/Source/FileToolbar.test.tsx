import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { FileToolbar } from './FileToolbar.js';
import type { SourceFilterCounts } from './FileToolbar.js';

const COUNTS: SourceFilterCounts = {
  all: 120,
  marked: 80,
  skipped: 15,
  unmarked: 22,
  inserts: 3,
};

describe('FileToolbar', () => {
  it('renders 5 filter chips with labels and counts', () => {
    render(
      <FileToolbar
        filter="all"
        onFilterChange={() => undefined}
        counts={COUNTS}
        density="m"
        onDensityChange={() => undefined}
      />,
    );

    expect(screen.getByText('All')).toBeInTheDocument();
    expect(screen.getByText('120')).toBeInTheDocument();
    expect(screen.getByText('Marked')).toBeInTheDocument();
    expect(screen.getByText('80')).toBeInTheDocument();
    expect(screen.getByText('Skipped')).toBeInTheDocument();
    expect(screen.getByText('15')).toBeInTheDocument();
    expect(screen.getByText('Unmarked')).toBeInTheDocument();
    expect(screen.getByText('22')).toBeInTheDocument();
    expect(screen.getByText('Inserts')).toBeInTheDocument();
    expect(screen.getByText('3')).toBeInTheDocument();
  });

  it('active chip has aria-pressed=true; others have aria-pressed=false', () => {
    render(
      <FileToolbar
        filter="marked"
        onFilterChange={() => undefined}
        counts={COUNTS}
        density="m"
        onDensityChange={() => undefined}
      />,
    );

    expect(screen.getByTestId('file-toolbar-filter-marked')).toHaveAttribute(
      'aria-pressed',
      'true',
    );
    expect(screen.getByTestId('file-toolbar-filter-all')).toHaveAttribute(
      'aria-pressed',
      'false',
    );
    expect(screen.getByTestId('file-toolbar-filter-skipped')).toHaveAttribute(
      'aria-pressed',
      'false',
    );
    expect(screen.getByTestId('file-toolbar-filter-unmarked')).toHaveAttribute(
      'aria-pressed',
      'false',
    );
    expect(screen.getByTestId('file-toolbar-filter-inserts')).toHaveAttribute(
      'aria-pressed',
      'false',
    );
  });

  it('click chip fires onFilterChange with correct filter key', async () => {
    const user = userEvent.setup();
    const onFilterChange = vi.fn();

    render(
      <FileToolbar
        filter="all"
        onFilterChange={onFilterChange}
        counts={COUNTS}
        density="m"
        onDensityChange={() => undefined}
      />,
    );

    await user.click(screen.getByTestId('file-toolbar-filter-skipped'));
    expect(onFilterChange).toHaveBeenCalledOnce();
    expect(onFilterChange).toHaveBeenCalledWith('skipped');
  });

  it('density Segmented value matches density prop', () => {
    render(
      <FileToolbar
        filter="all"
        onFilterChange={() => undefined}
        counts={COUNTS}
        density="l"
        onDensityChange={() => undefined}
      />,
    );

    // The 'L' segment should have aria-checked=true (Segmented uses radio semantics)
    const segmentL = screen.getByRole('radio', { name: 'L' });
    expect(segmentL).toHaveAttribute('aria-checked', 'true');

    const segmentS = screen.getByRole('radio', { name: 'S' });
    expect(segmentS).toHaveAttribute('aria-checked', 'false');
  });

  it('density change fires onDensityChange', async () => {
    const user = userEvent.setup();
    const onDensityChange = vi.fn();

    render(
      <FileToolbar
        filter="all"
        onFilterChange={() => undefined}
        counts={COUNTS}
        density="m"
        onDensityChange={onDensityChange}
      />,
    );

    await user.click(screen.getByRole('radio', { name: 'S' }));
    expect(onDensityChange).toHaveBeenCalledOnce();
    expect(onDensityChange).toHaveBeenCalledWith('s');
  });

  it('Insert button renders only when onInsert is provided', () => {
    const { rerender } = render(
      <FileToolbar
        filter="all"
        onFilterChange={() => undefined}
        counts={COUNTS}
        density="m"
        onDensityChange={() => undefined}
      />,
    );

    expect(screen.queryByTestId('file-toolbar-insert')).not.toBeInTheDocument();

    rerender(
      <FileToolbar
        filter="all"
        onFilterChange={() => undefined}
        counts={COUNTS}
        density="m"
        onDensityChange={() => undefined}
        onInsert={() => undefined}
      />,
    );

    expect(screen.getByTestId('file-toolbar-insert')).toBeInTheDocument();
  });

  it('Insert click fires onInsert', async () => {
    const user = userEvent.setup();
    const onInsert = vi.fn();

    render(
      <FileToolbar
        filter="all"
        onFilterChange={() => undefined}
        counts={COUNTS}
        density="m"
        onDensityChange={() => undefined}
        onInsert={onInsert}
      />,
    );

    await user.click(screen.getByTestId('file-toolbar-insert'));
    expect(onInsert).toHaveBeenCalledOnce();
  });

  it('forwards data-testid to root element', () => {
    render(
      <FileToolbar
        filter="all"
        onFilterChange={() => undefined}
        counts={COUNTS}
        density="m"
        onDensityChange={() => undefined}
        data-testid="my-file-toolbar"
      />,
    );

    expect(screen.getByTestId('my-file-toolbar')).toBeInTheDocument();
  });
});
