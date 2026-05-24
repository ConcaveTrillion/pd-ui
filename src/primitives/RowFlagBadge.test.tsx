import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { RowFlagBadge } from './RowFlagBadge.js';

describe('RowFlagBadge', () => {
  it('renders the flag kind', () => {
    render(<RowFlagBadge kind="blurry" />);
    expect(screen.getByText('blurry')).toBeTruthy();
  });

  it('has data-kind attribute for CSS tone mapping', () => {
    const { container } = render(<RowFlagBadge kind="skew" />);
    const el = container.querySelector('[data-kind="skew"]');
    expect(el).toBeTruthy();
  });

  it('forwards className', () => {
    const { container } = render(<RowFlagBadge kind="blurry" className="custom" />);
    expect(container.querySelector('.custom')).toBeTruthy();
  });

  it('applies row-flag-badge root class', () => {
    const { container } = render(<RowFlagBadge kind="dark" />);
    expect(container.querySelector('.row-flag-badge')).toBeTruthy();
  });
});
