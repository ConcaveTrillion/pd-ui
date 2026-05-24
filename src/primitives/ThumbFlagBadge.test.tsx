import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { ThumbFlagBadge } from './ThumbFlagBadge.js';

describe('ThumbFlagBadge', () => {
  it('renders a FlagChip with the given kind', () => {
    const { container } = render(<ThumbFlagBadge kind="blurry" />);
    expect(container.querySelector('[data-kind="blurry"]')).toBeTruthy();
  });

  it('renders with thumb-flag-badge wrapper class', () => {
    const { container } = render(<ThumbFlagBadge kind="skew" />);
    expect(container.querySelector('.thumb-flag-badge')).toBeTruthy();
  });

  it('passes count to FlagChip', () => {
    render(<ThumbFlagBadge kind="dark" count={5} />);
    expect(screen.getByText('5')).toBeTruthy();
  });

  it('forwards className', () => {
    const { container } = render(<ThumbFlagBadge kind="blurry" className="extra" />);
    expect(container.querySelector('.extra')).toBeTruthy();
  });

  it('forwards additional FlagChip props', () => {
    const { container } = render(<ThumbFlagBadge kind="blurry" active />);
    expect(container.querySelector('.flag-chip--active')).toBeTruthy();
  });
});
