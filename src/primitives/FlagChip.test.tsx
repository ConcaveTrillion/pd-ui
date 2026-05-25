import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { FlagChip } from './FlagChip.js';

describe('FlagChip', () => {
  it('renders the kind as text when no label provided', () => {
    render(<FlagChip kind="blurry" />);
    expect(screen.getByText('blurry')).toBeTruthy();
  });

  it('renders provided label instead of kind', () => {
    render(<FlagChip kind="blurry" label="Blurry pages" />);
    expect(screen.getByText('Blurry pages')).toBeTruthy();
  });

  it('renders count badge when count provided', () => {
    render(<FlagChip kind="blurry" count={5} />);
    expect(screen.getByText('5')).toBeTruthy();
  });

  it('omits count badge when count not provided', () => {
    const { container } = render(<FlagChip kind="blurry" />);
    expect(container.querySelector('.flag-chip__count')).toBeNull();
  });

  it('applies active modifier class', () => {
    const { container } = render(<FlagChip kind="blurry" active />);
    expect(container.querySelector('.flag-chip--active')).toBeTruthy();
  });

  it('applies muted modifier class', () => {
    const { container } = render(<FlagChip kind="blurry" mute />);
    expect(container.querySelector('.flag-chip--muted')).toBeTruthy();
  });

  it('calls onClick when clicked', () => {
    const onClick = vi.fn();
    render(<FlagChip kind="blurry" onClick={onClick} />);
    screen
      .getByText('blurry')
      .closest('.flag-chip')
      ?.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('forwards className', () => {
    const { container } = render(<FlagChip kind="blurry" className="custom" />);
    expect(container.querySelector('.custom')).toBeTruthy();
  });
});
