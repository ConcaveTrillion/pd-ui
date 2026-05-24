import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { TableFooter } from './TableFooter.js';

describe('TableFooter', () => {
  it('renders current page and total pages', () => {
    render(<TableFooter page={2} totalPages={5} onPageChange={() => {}} />);
    expect(screen.getByText(/2/)).toBeTruthy();
    expect(screen.getByText(/5/)).toBeTruthy();
  });

  it('renders with table-footer class', () => {
    const { container } = render(
      <TableFooter page={1} totalPages={3} onPageChange={() => {}} />,
    );
    expect(container.querySelector('.table-footer')).toBeTruthy();
  });

  it('calls onPageChange with page - 1 when prev is clicked', () => {
    const handler = vi.fn();
    render(<TableFooter page={3} totalPages={5} onPageChange={handler} />);
    fireEvent.click(screen.getByRole('button', { name: /prev/i }));
    expect(handler).toHaveBeenCalledWith(2);
  });

  it('calls onPageChange with page + 1 when next is clicked', () => {
    const handler = vi.fn();
    render(<TableFooter page={3} totalPages={5} onPageChange={handler} />);
    fireEvent.click(screen.getByRole('button', { name: /next/i }));
    expect(handler).toHaveBeenCalledWith(4);
  });

  it('disables prev button on first page', () => {
    render(<TableFooter page={1} totalPages={5} onPageChange={() => {}} />);
    const prevBtn = screen.getByRole('button', { name: /prev/i });
    expect(prevBtn.getAttribute('disabled')).not.toBeNull();
  });

  it('disables next button on last page', () => {
    render(<TableFooter page={5} totalPages={5} onPageChange={() => {}} />);
    const nextBtn = screen.getByRole('button', { name: /next/i });
    expect(nextBtn.getAttribute('disabled')).not.toBeNull();
  });

  it('shows total rows when provided', () => {
    render(
      <TableFooter page={1} totalPages={5} onPageChange={() => {}} totalRows={128} />,
    );
    expect(screen.getByText(/128/)).toBeTruthy();
  });

  it('forwards className', () => {
    const { container } = render(
      <TableFooter page={1} totalPages={3} onPageChange={() => {}} className="extra" />,
    );
    expect(container.querySelector('.extra')).toBeTruthy();
  });
});
