import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { TableHeader } from './TableHeader.js';

const columns = [
  { id: 'page', label: 'Page', sortable: true },
  { id: 'status', label: 'Status', sortable: false },
  { id: 'flags', label: 'Flags', sortable: true },
];

describe('TableHeader', () => {
  it('renders all column labels', () => {
    render(<TableHeader columns={columns} />);
    expect(screen.getByText('Page')).toBeTruthy();
    expect(screen.getByText('Status')).toBeTruthy();
    expect(screen.getByText('Flags')).toBeTruthy();
  });

  it('renders with table-header class', () => {
    const { container } = render(<TableHeader columns={columns} />);
    expect(container.querySelector('.table-header')).toBeTruthy();
  });

  it('calls onSort when a sortable column header is clicked', () => {
    const onSort = vi.fn();
    render(<TableHeader columns={columns} onSort={onSort} />);
    fireEvent.click(screen.getByText('Page'));
    expect(onSort).toHaveBeenCalledWith('page', expect.any(String));
  });

  it('does not call onSort for non-sortable columns', () => {
    const onSort = vi.fn();
    render(<TableHeader columns={columns} onSort={onSort} />);
    fireEvent.click(screen.getByText('Status'));
    expect(onSort).not.toHaveBeenCalled();
  });

  it('shows ascending indicator for active sorted column (asc)', () => {
    const { container } = render(<TableHeader columns={columns} sortKey="page" sortDir="asc" />);
    expect(container.querySelector('[data-sort="asc"]')).toBeTruthy();
  });

  it('shows descending indicator for active sorted column (desc)', () => {
    const { container } = render(<TableHeader columns={columns} sortKey="page" sortDir="desc" />);
    expect(container.querySelector('[data-sort="desc"]')).toBeTruthy();
  });

  it('forwards className', () => {
    const { container } = render(<TableHeader columns={columns} className="extra" />);
    expect(container.querySelector('.extra')).toBeTruthy();
  });
});
