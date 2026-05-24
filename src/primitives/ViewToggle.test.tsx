import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { ViewToggle } from './ViewToggle.js';

describe('ViewToggle', () => {
  it('renders List and Thumbnails options', () => {
    render(<ViewToggle mode="list" onChange={() => {}} />);
    expect(screen.getByText('List')).toBeTruthy();
    expect(screen.getByText('Thumbnails')).toBeTruthy();
  });

  it('marks active option with --active class', () => {
    render(<ViewToggle mode="thumb" onChange={() => {}} />);
    const thumbBtn = screen.getByText('Thumbnails').closest('[data-id]');
    expect(thumbBtn?.classList.contains('view-toggle__option--active')).toBe(true);
  });

  it('does not mark inactive option with --active class', () => {
    render(<ViewToggle mode="thumb" onChange={() => {}} />);
    const listBtn = screen.getByText('List').closest('[data-id]');
    expect(listBtn?.classList.contains('view-toggle__option--active')).toBe(false);
  });

  it('calls onChange with "list" when List clicked', () => {
    const onChange = vi.fn();
    render(<ViewToggle mode="thumb" onChange={onChange} />);
    fireEvent.click(screen.getByText('List'));
    expect(onChange).toHaveBeenCalledWith('list');
  });

  it('calls onChange with "thumb" when Thumbnails clicked', () => {
    const onChange = vi.fn();
    render(<ViewToggle mode="list" onChange={onChange} />);
    fireEvent.click(screen.getByText('Thumbnails'));
    expect(onChange).toHaveBeenCalledWith('thumb');
  });

  it('defaults to "list" mode when mode not provided', () => {
    render(<ViewToggle onChange={() => {}} />);
    const listBtn = screen.getByText('List').closest('[data-id]');
    expect(listBtn?.classList.contains('view-toggle__option--active')).toBe(true);
  });

  it('forwards className', () => {
    const { container } = render(<ViewToggle onChange={() => {}} className="custom" />);
    expect(container.querySelector('.custom')).toBeTruthy();
  });
});
