import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { FilterToolbar } from './FilterToolbar.js';

describe('FilterToolbar', () => {
  it('renders the search input', () => {
    render(<FilterToolbar value="" onValueChange={() => {}} />);
    expect(screen.getByRole('searchbox')).toBeTruthy();
  });

  it('shows current value in the input', () => {
    render(<FilterToolbar value="hello" onValueChange={() => {}} />);
    expect(screen.getByDisplayValue('hello')).toBeTruthy();
  });

  it('calls onValueChange when user types', () => {
    const handler = vi.fn();
    render(<FilterToolbar value="" onValueChange={handler} />);
    const input = screen.getByRole('searchbox');
    fireEvent.change(input, { target: { value: 'blurry' } });
    expect(handler).toHaveBeenCalledWith('blurry');
  });

  it('renders a clear button when value is non-empty', () => {
    render(<FilterToolbar value="blurry" onValueChange={() => {}} />);
    expect(screen.getByRole('button', { name: /clear/i })).toBeTruthy();
  });

  it('does not render a clear button when value is empty', () => {
    render(<FilterToolbar value="" onValueChange={() => {}} />);
    expect(screen.queryByRole('button', { name: /clear/i })).toBeNull();
  });

  it('calls onValueChange with empty string when clear is clicked', () => {
    const handler = vi.fn();
    render(<FilterToolbar value="blurry" onValueChange={handler} />);
    fireEvent.click(screen.getByRole('button', { name: /clear/i }));
    expect(handler).toHaveBeenCalledWith('');
  });

  it('renders placeholder text', () => {
    render(<FilterToolbar value="" onValueChange={() => {}} placeholder="Search flags…" />);
    const input = screen.getByRole('searchbox');
    expect(input.getAttribute('placeholder')).toBe('Search flags…');
  });

  it('renders with filter-toolbar class', () => {
    const { container } = render(<FilterToolbar value="" onValueChange={() => {}} />);
    expect(container.querySelector('.filter-toolbar')).toBeTruthy();
  });

  it('forwards className', () => {
    const { container } = render(
      <FilterToolbar value="" onValueChange={() => {}} className="extra" />,
    );
    expect(container.querySelector('.extra')).toBeTruthy();
  });
});
