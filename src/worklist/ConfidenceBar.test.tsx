/**
 * Tests for <ConfidenceBar> (M6.6, issue #155).
 */

import * as React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ConfidenceBar } from './ConfidenceBar';

describe('<ConfidenceBar>', () => {
  it('renders with a testid', () => {
    render(<ConfidenceBar confidence={0.8} />);
    expect(screen.getByTestId('confidence-bar')).toBeDefined();
  });

  it('sets aria-valuenow to the confidence percentage', () => {
    render(<ConfidenceBar confidence={0.75} />);
    const bar = screen.getByRole('progressbar');
    expect(bar.getAttribute('aria-valuenow')).toBe('75');
  });

  it('clamps confidence to 0–100', () => {
    render(<ConfidenceBar confidence={1.5} />);
    const bar = screen.getByRole('progressbar');
    expect(bar.getAttribute('aria-valuenow')).toBe('100');
  });

  it('handles zero confidence', () => {
    render(<ConfidenceBar confidence={0} />);
    const bar = screen.getByRole('progressbar');
    expect(bar.getAttribute('aria-valuenow')).toBe('0');
  });

  it('handles null confidence', () => {
    render(<ConfidenceBar confidence={null} />);
    const bar = screen.getByRole('progressbar');
    expect(bar.getAttribute('aria-valuenow')).toBe('0');
  });

  it('handles undefined confidence', () => {
    render(<ConfidenceBar confidence={undefined} />);
    const bar = screen.getByRole('progressbar');
    expect(bar.getAttribute('aria-valuenow')).toBe('0');
  });

  it('applies custom className', () => {
    const { container } = render(<ConfidenceBar confidence={0.5} className="my-bar" />);
    const outer = container.firstElementChild;
    expect(outer?.className).toContain('my-bar');
  });
});
